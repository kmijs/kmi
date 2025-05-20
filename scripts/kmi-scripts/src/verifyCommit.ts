import 'zx/globals'

const msgPath = process.argv[2]

;(async () => {
  if (!msgPath) process.exit()

  const msg = fs.readFileSync(msgPath, 'utf-8').trim()

  // 如果是Merge 请求不做格式校验
  if (/^Merge .{1,50}/.test(msg)) {
    return
  }

  const commitRE =
    // eslint-disable-next-line regexp/no-unused-capturing-group
    /^(revert: )?(feat|fix|docs|style|refactor|perf|test|workflow|build|ci|chore|types|wip|release|dep|Merge|template|example|e2e)(?:\(.+\))?: .{1,50}/

  if (!commitRE.test(msg)) {
    console.log()
    console.error(
      `  ${chalk.bgRed.white(' ERROR ')} ${chalk.red(
        'invalid commit message format.',
      )}\n\n${chalk.red(
        '  Proper commit message format is required for automated changelog generation. Examples:\n\n',
      )}    ${chalk.green("feat(bundler-webpack): add 'comments' option")}\n` +
        `    ${chalk.green(
          'fix(core): handle events on blur (close #28)',
        )}\n\n${
          // TODO
          chalk.red('  See  提交规范.\n')
        }`,
    )
    process.exit(1)
  }
})()
