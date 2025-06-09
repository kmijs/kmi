import { existsSync } from 'node:fs'
import { dirname, join } from 'node:path'
import {
  BaseGenerator,
  chalk,
  clackPrompts,
  execa,
  fsExtra,
  getGitInfo,
  installWithNpmClient,
  logger,
  pkgUp,
  semver,
  tryPaths,
  type yParser,
} from '@umijs/utils'
import { ERegistry, type UmiTemplate, unpackTemplate } from './template'

interface ITemplateArgs {
  template?: UmiTemplate
}

interface IArgs extends yParser.Arguments, ITemplateArgs {
  default?: boolean
  git?: boolean
  install?: boolean
}

interface IContext {
  projectRoot: string
  inMonorepo: boolean
  target: string
}

interface ITemplatePluginParams {
  pluginName?: string
}

interface ITemplateParams extends ITemplatePluginParams {
  version: string
  npmClient: ENpmClient
  registry: string
  author: string
  email: string
  withHusky: boolean
  extraNpmrc: string
  kmiVersion: string
}

enum ENpmClient {
  npm = 'npm',
  cnpm = 'cnpm',
  tnpm = 'tnpm',
  yarn = 'yarn',
  pnpm = 'pnpm',
}

enum ETemplate {
  app = 'app',
  max = 'max',
  antProExample = 'ant-pro-example', // New template type
}

export interface IDefaultData extends ITemplateParams {
  appTemplate?: ETemplate
  kmiVersion: string
}

const pkg = require('../package')

async function getLatestUmiVersion(
  registry: string = ERegistry.npm,
): Promise<string> {
  try {
    const registryUrl =
      registry === ERegistry.taobao
        ? 'https://registry.npmmirror.com'
        : 'https://registry.npmjs.org'

    const response = await fetch(`${registryUrl}/umi/latest`)
    const data = await response.json()

    return `^${data.version}`
  } catch (error) {
    logger.warn('Failed to fetch latest umi version, using fallback version')
    return '^4.4.11' // 回退版本
  }
}

const getDefaultData = async (
  registry: string = ERegistry.npm,
): Promise<IDefaultData> => {
  const latestUmiVersion = await getLatestUmiVersion(registry)

  return {
    pluginName: 'umi-plugin-demo',
    email: 'i@domain.com',
    author: 'umijs',
    version: latestUmiVersion,
    kmiVersion: pkg.version,
    npmClient: ENpmClient.pnpm,
    registry: ERegistry.npm,
    withHusky: false,
    extraNpmrc: '',
    appTemplate: ETemplate.app,
  } satisfies IDefaultData
}

interface IGeneratorOpts {
  cwd: string
  args: IArgs
  defaultData?: IDefaultData
}

export default async ({ cwd, args, defaultData }: IGeneratorOpts) => {
  let [name] = args._ as string[]
  let npmClient = ENpmClient.pnpm
  let registry = ERegistry.npm

  if (!defaultData) {
    defaultData = await getDefaultData()
  }

  let appTemplate = defaultData?.appTemplate || ETemplate.app
  const { username, email } = await getGitInfo()
  const author = email && username ? `${username} <${email}>` : ''

  // plugin params
  const pluginName = `umi-plugin-${name || 'demo'}`

  let target = name ? join(cwd, name as string) : cwd

  const { isCancel, text, select, intro, outro } = clackPrompts
  const exitPrompt = () => {
    outro(chalk.red('Exit create-kmi'))
    process.exit(1)
  }
  const setName = async () => {
    name = (await text({
      message: "What's the target folder name?",
      initialValue: (name as string) || 'my-app',
      validate: (value: string) => {
        if (!value.length) {
          return 'Please input project name'
        }
        if (value !== '.' && fsExtra.existsSync(join(cwd, value))) {
          return `Folder ${value} already exists`
        }
      },
    })) as string
  }
  const selectAppTemplate = async () => {
    appTemplate = (await select({
      message: 'Pick Umi App Template',
      options: [
        { label: 'Simple App', value: ETemplate.app },
        {
          label: 'Ant Design Pro (from templates/max)',
          value: ETemplate.max,
          hint: 'more plugins and ready to use features',
        },
        {
          label: 'Ant Design Pro (from examples/ant-pro)',
          value: ETemplate.antProExample,
          hint: 'local example, direct copy',
        },
      ],
      initialValue: ETemplate.app,
    })) as ETemplate
  }
  const selectNpmClient = async () => {
    npmClient = (await select({
      message: 'Pick Npm Client',
      options: [
        { label: ENpmClient.npm, value: ENpmClient.npm },
        { label: ENpmClient.cnpm, value: ENpmClient.cnpm },
        { label: ENpmClient.tnpm, value: ENpmClient.tnpm },
        { label: ENpmClient.yarn, value: ENpmClient.yarn },
        { label: ENpmClient.pnpm, value: ENpmClient.pnpm, hint: 'recommended' },
      ],
      initialValue: ENpmClient.pnpm,
    })) as ENpmClient
  }
  const selectRegistry = async () => {
    registry = (await select({
      message: 'Pick Npm Registry',
      options: [
        {
          label: 'npm',
          value: ERegistry.npm,
        },
        {
          label: 'taobao',
          value: ERegistry.taobao,
          hint: 'recommended for China',
        },
      ],
      initialValue: ERegistry.npm,
    })) as ERegistry
  }
  const internalTemplatePrompts = async () => {
    intro(chalk.bgHex('#19BDD2')(' create-kmi '))

    await setName()
    if (isCancel(name)) {
      exitPrompt()
    }

    target = join(cwd, name)

    await selectAppTemplate()
    if (isCancel(appTemplate)) {
      exitPrompt()
    }

    await selectNpmClient()
    if (isCancel(npmClient)) {
      exitPrompt()
    }

    await selectRegistry()
    if (isCancel(registry)) {
      exitPrompt()
    }

    outro(chalk.green(`You're all set!`))
  }

  // --default
  const useDefaultData = !!args.default
  // --template
  const useExternalTemplate = !!args.template

  // Determine primary operation: external template, ant-pro-example, or other internal template
  if (useExternalTemplate) {
    if (!name) {
      // Name might not be set if --template is used directly without positional arg
      // Need to ensure 'target' is defined before unpackTemplate
      // However, unpackTemplate itself might handle 'dest' creation or require it
      // For now, assume 'target' needs to be resolved.
      // This part might need more robust handling for 'name' and 'target' if using only --template
      const tempName = await text({
        message: "What's the target folder name for the external template?",
        initialValue: 'my-external-app',
        validate: (value: string) => {
          if (!value.length) return 'Please input project name'
          if (value !== '.' && fsExtra.existsSync(join(cwd, value))) return `Folder ${value} already exists`
          return true
        }
      })
      if (isCancel(tempName)) exitPrompt();
      name = tempName as string;
      target = join(cwd, name);
    }
    // Ensure npmClient and registry are prompted if not using default flow that includes internalTemplatePrompts
    if (useDefaultData) { // If --default is also passed with --template
        npmClient = defaultData.npmClient;
        registry = defaultData.registry;
    } else {
        await selectNpmClient(); if (isCancel(npmClient)) exitPrompt();
        await selectRegistry(); if (isCancel(registry)) exitPrompt();
    }
    await unpackTemplate({
      template: args.template!,
      dest: target,
      registry,
    });
  } else {
    // Not using an external template, so it's either an internal one or our ant-pro-example
    if (!useDefaultData) {
      await internalTemplatePrompts(); // This sets name, target, appTemplate, npmClient, registry
    } else {
      // Using default data, ensure 'name' and 'target' are set
      // appTemplate, npmClient, registry are from defaultData
      if (!name) name = defaultData.pluginName?.replace(/^umi-plugin-/, '') || 'my-app';
      target = join(cwd, name);
      // Check for existing directory if name was derived or default
      if (name !== '.' && fsExtra.existsSync(target)) {
         const { go } = await clackPrompts.group({
            go: () => clackPrompts.confirm({ message: `Target directory ${target} exists. Continue?` })
         }, { onCancel: exitPrompt });
         if (!go) exitPrompt();
      }
    }

    // Now, appTemplate, target, etc., are set from either prompts or defaults
    if (appTemplate === ETemplate.antProExample) {
      logger.info(`Copying Ant Design Pro (from examples/ant-pro) template to ${target}...`);
      const srcPath = join(__dirname, '..', '..', 'examples', 'ant-pro');
      try {
        fsExtra.ensureDirSync(target); // Ensure target directory exists
        fsExtra.copySync(srcPath, target, { overwrite: true }); // Overwrite true can be risky, but often needed
        // Handle .tpl files, assuming this logic is still desired for copied examples
        const files = fsExtra.readdirSync(target);
        for (const file of files) {
          if (file.endsWith('.tpl')) {
            fsExtra.renameSync(
              join(target, file),
              join(target, file.replace(/\.tpl$/, '')),
            );
          }
        }
        logger.ready(`Successfully initialized Ant Design Pro (from examples/ant-pro) at ${target}`);
      } catch (e: any) {
        logger.error(`Error copying template: ${e.message}`);
        exitPrompt();
      }
    } else {
      // This is for ETemplate.app or ETemplate.max (original internal templates)
      // injectInternalTemplateFiles will be called later for these
    }
  }

  const version = pkg.version

  // detect monorepo
  const monorepoRoot = await detectMonorepoRoot({ target })
  const inMonorepo = !!monorepoRoot
  const projectRoot = inMonorepo ? monorepoRoot : target

  // git
  const shouldInitGit = args.git !== false
  // now husky is not supported in monorepo
  const withHusky = shouldInitGit && !inMonorepo

  // pnpm
  let pnpmExtraNpmrc = ''
  const isPnpm = npmClient === ENpmClient.pnpm
  let pnpmMajorVersion: number | undefined
  let pnpmVersion: string | undefined
  if (isPnpm) {
    pnpmVersion = await getPnpmVersion()
    pnpmMajorVersion = Number.parseInt(pnpmVersion.split('.')[0], 10)
    logger.debug(`pnpm version: ${pnpmVersion}`)
    if (pnpmMajorVersion === 7) {
      // suppress pnpm v7 warning ( 7.0.0 < pnpm < 7.13.5 )
      // https://pnpm.io/npmrc#strict-peer-dependencies
      pnpmExtraNpmrc = 'strict-peer-dependencies=false'
    }
  }

  const injectInternalTemplateFiles = async () => {
    // This function is now only for ETemplate.app and ETemplate.max
    if (appTemplate === ETemplate.antProExample) {
      // Already handled, do nothing here.
      return;
    }
    const latestUmiVersion = await getLatestUmiVersion(registry as string)

    const generator = new BaseGenerator({
      // appTemplate here will be 'app' or 'max'
      path: join(__dirname, '..', 'templates', appTemplate as string),
      target,
      slient: true,
      data: useDefaultData
        ? defaultData
        : ({
            version: latestUmiVersion,
            kmiVersion: version,
            npmClient,
            registry,
            author,
            email,
            withHusky,
            extraNpmrc: isPnpm ? pnpmExtraNpmrc : '',
            pluginName,
          } satisfies ITemplateParams),
    })
    await generator.run()
  }

  // Call injectInternalTemplateFiles only if not external and not antProExample
  if (!useExternalTemplate && appTemplate !== ETemplate.antProExample) {
    await injectInternalTemplateFiles()
  }

  const context: IContext = {
    inMonorepo,
    target,
    projectRoot,
  }

  if (!withHusky) {
    await removeHusky(context)
  }

  if (inMonorepo) {
    // monorepo should move .npmrc to root
    await moveNpmrc(context)
  }

  // init git
  if (shouldInitGit) {
    await initGit(context)
  } else {
    logger.info('Skip Git init')
  }

  // install deps
  const isPnpm8 = pnpmMajorVersion === 8
  // https://github.com/pnpm/pnpm/releases/tag/v8.7.0
  // https://pnpm.io/npmrc#resolution-mode
  const pnpmHighestResolutionMinVersion = '8.7.0'
  const isPnpmHighestResolution =
    isPnpm8 && pnpmVersion && semver.gte(pnpmVersion!, pnpmHighestResolutionMinVersion)

  // Determine if installation should be skipped
  let skipInstall = args.install === false;
  if (useDefaultData && args.install === undefined) { // If --default is used, and --install is not specified, skip install by default.
    // However, specific templates might want to override this. For now, let's assume --default implies no install unless --install is true.
    // This behavior might need further clarification based on desired DX for --default.
    // For this change, we'll stick to: if args.install is not false, and (not useDefaultData OR args.install is true), then install.
    skipInstall = true; // Default to skip for --default unless --install is explicitly true
    if (args.install === true) { // if --default and --install
        skipInstall = false;
    }
  }


  if (!skipInstall) {
    logger.info(`Installing dependencies with ${npmClient}...`);
    if (isPnpm8 && !isPnpmHighestResolution) {
      await installAndUpdateWithPnpm(target)
    } else {
      installWithNpmClient({ npmClient, cwd: target })
    }
  } else {
    logger.info('Skip install deps')
    if (isPnpm8 && !skipInstall) { // only show pnpm v8 warning if we were going to install
      logger.warn(
        chalk.yellow(
          'You current using pnpm v8, it will install minimal version of dependencies',
        ),
      )
      logger.warn(
        chalk.green(
          `Recommended that you run ${chalk.bold.cyan(
            'pnpm up -L',
          )} to install latest version of dependencies`,
        ),
      )
    }
  }
}

async function detectMonorepoRoot(opts: {
  target: string
}): Promise<string | null> {
  const { target } = opts
  const rootPkg = await pkgUp.pkgUp({ cwd: dirname(target) })
  if (!rootPkg) {
    return null
  }
  const rootDir = dirname(rootPkg)
  if (
    tryPaths([
      join(rootDir, 'lerna.json'),
      join(rootDir, 'pnpm-workspace.yaml'),
    ])
  ) {
    return rootDir
  }
  return null
}

async function moveNpmrc(opts: IContext) {
  const { target, projectRoot } = opts
  const sourceNpmrc = join(target, './.npmrc')
  const targetNpmrc = join(projectRoot, './.npmrc')
  if (!existsSync(targetNpmrc)) {
    await fsExtra.copyFile(sourceNpmrc, targetNpmrc)
  }
  await fsExtra.remove(sourceNpmrc)
}

async function initGit(opts: IContext) {
  const { projectRoot } = opts
  const isGit = existsSync(join(projectRoot, '.git'))
  if (isGit) return
  try {
    await execa.execa('git', ['init'], { cwd: projectRoot })
  } catch {
    logger.error('Initial the git repo failed')
  }
}

async function removeHusky(opts: IContext) {
  const dir = join(opts.target, './.husky')
  if (existsSync(dir)) {
    await fsExtra.remove(dir)
  }
}

// pnpm v8 will install minimal version of the dependencies
// so we upgrade all deps to the latest version
async function installAndUpdateWithPnpm(cwd: string) {
  await execa.execa('pnpm', ['up', '-L'], { cwd, stdio: 'inherit' })
}

async function getPnpmVersion() {
  try {
    const { stdout } = await execa.execa('pnpm', ['--version'])
    return stdout.trim()
  } catch (e) {
    throw new Error('Please install pnpm first', { cause: e })
  }
}
