// fork zx 兼容低版本 移除无用包
import chalk from 'chalk';
import yParser from 'yargs-parser';
import { spawn } from 'child_process';
import psTreeModule from 'ps-tree';
import { inspect, promisify } from 'util';
import which from 'which';

export const sleep = promisify(setTimeout);
export const argv = yParser(process.argv.slice(2));

const psTree = promisify(psTreeModule);

export function $(pieces, ...args) {
  let { verbose, shell, prefix } = $;
  let __from = new Error().stack.split(/^\s*at\s/m)[2].trim();

  let cmd = pieces[0],
    i = 0;
  while (i < args.length) {
    let s;
    if (Array.isArray(args[i])) {
      s = args[i].map((x) => $.quote(substitute(x))).join(' ');
    } else {
      s = $.quote(substitute(args[i]));
    }
    cmd += s + pieces[++i];
  }

  let resolve, reject;
  let promise = new ProcessPromise((...args) => ([resolve, reject] = args));

  promise._run = () => {
    if (promise.child) return;
    if (promise._prerun) promise._prerun();
    if (verbose) {
      printCmd(cmd);
    }

    let child = spawn(prefix + cmd, {
      cwd: process.cwd(),
      shell: typeof shell === 'string' ? shell : true,
      stdio: [promise._inheritStdin ? 'inherit' : 'pipe', 'pipe', 'pipe'],
      windowsHide: true,
    });

    child.on('exit', (code) => {
      child.on('close', () => {
        let output = new ProcessOutput({
          code,
          stdout,
          stderr,
          combined,
          message:
            `${stderr || '\n'}    at ${__from}\n    exit code: ${code}` +
            (exitCodeInfo(code) ? ' (' + exitCodeInfo(code) + ')' : ''),
        });
        (code === 0 || promise._nothrow ? resolve : reject)(output);
        promise._resolved = true;
      });
    });

    let stdout = '',
      stderr = '',
      combined = '';
    let onStdout = (data) => {
      if (verbose) process.stdout.write(data);
      stdout += data;
      combined += data;
    };
    let onStderr = (data) => {
      if (verbose) process.stderr.write(data);
      stderr += data;
      combined += data;
    };
    if (!promise._piped) child.stdout.on('data', onStdout);
    child.stderr.on('data', onStderr);
    promise.child = child;
    if (promise._postrun) promise._postrun();
  };
  setTimeout(promise._run, 0); // Make sure all subprocesses started.
  return promise;
}

$.verbose = !argv.quiet;
if (typeof argv.shell === 'string') {
  $.shell = argv.shell;
  $.prefix = '';
} else {
  try {
    $.shell = which.sync('bash');
    $.prefix = 'set -euo pipefail;';
  } catch (e) {
    $.prefix = ''; // Bash not found, no prefix.
  }
}
if (typeof argv.prefix === 'string') {
  $.prefix = argv.prefix;
}
$.quote = quote;

export function cd(path) {
  if ($.verbose) console.log('$', colorize(`cd ${path}`));
  process.chdir(path);
}

export function nothrow(promise) {
  promise._nothrow = true;
  return promise;
}

export class ProcessPromise extends Promise {
  child = undefined;
  _nothrow = false;
  _resolved = false;
  _inheritStdin = true;
  _piped = false;
  _prerun = undefined;
  _postrun = undefined;

  get stdin() {
    this._inheritStdin = false;
    this._run();
    return this.child.stdin;
  }

  get stdout() {
    this._inheritStdin = false;
    this._run();
    return this.child.stdout;
  }

  get stderr() {
    this._inheritStdin = false;
    this._run();
    return this.child.stderr;
  }

  get exitCode() {
    return this.then((p) => p.exitCode).catch((p) => p.exitCode);
  }

  then(onfulfilled, onrejected) {
    if (this._run) this._run();
    return super.then(onfulfilled, onrejected);
  }

  pipe(dest) {
    if (typeof dest === 'string') {
      throw new Error('The pipe() method does not take strings. Forgot $?');
    }
    if (this._resolved === true) {
      throw new Error(
        "The pipe() method shouldn't be called after promise is already resolved!",
      );
    }
    this._piped = true;
    if (dest instanceof ProcessPromise) {
      dest._inheritStdin = false;
      dest._prerun = this._run;
      dest._postrun = () => this.stdout.pipe(dest.child.stdin);
      return dest;
    } else {
      this._postrun = () => this.stdout.pipe(dest);
      return this;
    }
  }

  async kill(signal = 'SIGTERM') {
    this.catch((_) => _);
    let children = await psTree(this.child.pid);
    for (const p of children) {
      try {
        process.kill(p.PID, signal);
      } catch (e) {}
    }
    try {
      process.kill(this.child.pid, signal);
    } catch (e) {}
  }
}

export class ProcessOutput extends Error {
  #code = 0;
  #stdout = '';
  #stderr = '';
  #combined = '';

  constructor({ code, stdout, stderr, combined, message }) {
    super(message);
    this.#code = code;
    this.#stdout = stdout;
    this.#stderr = stderr;
    this.#combined = combined;
  }

  toString() {
    return this.#combined;
  }

  get stdout() {
    return this.#stdout;
  }

  get stderr() {
    return this.#stderr;
  }

  get exitCode() {
    return this.#code;
  }

  [inspect.custom]() {
    let stringify = (s, c) => (s.length === 0 ? "''" : c(inspect(s)));
    return `ProcessOutput {
  stdout: ${stringify(this.stdout, chalk.green)},
  stderr: ${stringify(this.stderr, chalk.red)},
  exitCode: ${(this.exitCode === 0 ? chalk.green : chalk.red)(this.exitCode)}${
      exitCodeInfo(this.exitCode)
        ? chalk.grey(' (' + exitCodeInfo(this.exitCode) + ')')
        : ''
    }
}`;
  }
}

function printCmd(cmd) {
  if (/\n/.test(cmd)) {
    console.log(
      cmd
        .split('\n')
        .map((line, i) => (i === 0 ? '$' : '>') + ' ' + colorize(line))
        .join('\n'),
    );
  } else {
    console.log('$', colorize(cmd));
  }
}

function colorize(cmd) {
  return cmd.replace(/^[\w_.-]+(\s|$)/, (substr) => {
    return chalk.greenBright(substr);
  });
}

function substitute(arg) {
  if (arg instanceof ProcessOutput) {
    return arg.stdout.replace(/\n$/, '');
  }
  return `${arg}`;
}

function quote(arg) {
  if (/^[a-z0-9/_.-]+$/i.test(arg) || arg === '') {
    return arg;
  }
  return (
    `$'` +
    arg
      .replace(/\\/g, '\\\\')
      .replace(/'/g, "\\'")
      .replace(/\f/g, '\\f')
      .replace(/\n/g, '\\n')
      .replace(/\r/g, '\\r')
      .replace(/\t/g, '\\t')
      .replace(/\v/g, '\\v')
      .replace(/\0/g, '\\0') +
    `'`
  );
}

function exitCodeInfo(exitCode) {
  return {
    2: 'Misuse of shell builtins',
    126: 'Invoked command cannot execute',
    127: 'Command not found',
    128: 'Invalid exit argument',
    129: 'Hangup',
    130: 'Interrupt',
    131: 'Quit and dump core',
    132: 'Illegal instruction',
    133: 'Trace/breakpoint trap',
    134: 'Process aborted',
    135: 'Bus error: "access to undefined portion of memory object"',
    136: 'Floating point exception: "erroneous arithmetic operation"',
    137: 'Kill (terminate immediately)',
    138: 'User-defined 1',
    139: 'Segmentation violation',
    140: 'User-defined 2',
    141: 'Write to pipe with no one reading',
    142: 'Signal raised by alarm',
    143: 'Termination (request to terminate)',
    145: 'Child process terminated, stopped (or continued*)',
    146: 'Continue if stopped',
    147: 'Stop executing temporarily',
    148: 'Terminal stop signal',
    149: 'Background process attempting to read from tty ("in")',
    150: 'Background process attempting to write to tty ("out")',
    151: 'Urgent data available on socket',
    152: 'CPU time limit exceeded',
    153: 'File size limit exceeded',
    154: 'Signal raised by timer counting virtual time: "virtual timer expired"',
    155: 'Profiling timer expired',
    157: 'Pollable event',
    159: 'Bad syscall',
  }[exitCode];
}
