import chalk from '../compiled/chalk'

const formatError = (code: string) => chalk.bgRed.bold(` ${code} `) as string

export const ERROR_CODE = {
  /**
   * 配置校验失败, 配置不符合预期, 请检查插件是否注册, 或者配置是否正确填写
   */
  CONFIG_VALIDATE_FAILED: formatError('K0001'),
  /**
   * 网络异常, 请检查是否联网或者未链接 VPM
   */
  NETWORK_ERROR: formatError('K0002'),
  /**
   * 远程配置环境未找到, 从 kconf 中未读到 所传的环境变量
   */
  REMOTE_CONFIG_ENV_INVALID: formatError('K2001'),
  /**
   * 远程配置校验失败, 从 kconf 中读取的配置不符合预期
   */
  REMOTE_CONFIG_VALIDATE_FAILED: formatError('K2002'),
  /**
   * 获取 kconf 失败
   */
  REMOTE_CONFIG_FETCH_KCONF_FAILED: formatError('K2003'),
  /**
   * 安装依赖 网络异常, 请检查是否联网或者未链接 VPM
   */
  REMOTE_CONFIG_INSTALL_REQUEST_ERROR: formatError('K2004'),
  /**
   * 安装依赖 插件安装失败, npm 插件可能不存在或者版本写错
   */
  REMOTE_CONFIG_INSTALL_FAILED: formatError('K2005'),
  /**
   * 远程插件配置重复
   */
  REMOTE_CONFIG_PLUGIN_DUPLICATE: formatError('K2006'),
  /**
   * 当前 Kmi 版本不支持 当前远程插件运行
   */
  REMOTE_CONFIG_PLUGIN_VERSION_INVALID: formatError('K2007'),
  /**
   * 插件路径获取失败
   */
  REMOTE_CONFIG_PLUGIN_PATH_INVALID: formatError('K2008'),
  /**
   * 无效的插件, 无法正确解析插件
   */
  PLUGIN_INVALID_NO_RESOLVE: formatError('K3001'),
  /**
   * 插件重复注册
   */
  PLUGIN_DUPLICATE: formatError('K3002'),
  /**
   * @kmijs/es 未安装
   */
  KMI_ES_NOT_INSTALLED: formatError('K4000'),
  /**
   * 解决方案预设不存在
   */
  SOLUTION_PRESET_NOT_EXISTS: formatError('K4001'),
  /**
   * 无效的 Kmi 项目, 请确认项目是否正确安装了 Kmi 相关依赖
   */
  INVALID_KMI_PROJECT: formatError('K4002'),
  /**
   * 不允许直接定义 process.env, 如需定义请使用 process.env.XXX 代替
   */
  PROCESS_ENV_NOT_ALLOWED: formatError('K5001'),
  /**
   * 运行时路由不允许手动安装 react-router 相关依赖
   */
  RUNTIME_ROUTER_MANUAL_INSTALL_DEPENDENCY: formatError('K6000'),
  /**
   * 电商项目需要在 package.json 中明确 template, 当前项目缺少 template 标识, 请增加后在运行
   */
  ES_PROJECT_TEMPLATE_NOT_FOUND: formatError('K7000'),
  /**
   * 未定义 modifyUniCodeChecker 导致 check 命令无法执行
   */
  CHECK_COMMAND_NOT_FOUND_MODIFY_UNI_CODE_CHECKER: formatError('K7001'),
  /**
   * 未知错误
   */
  UNKNOWN_ERROR: formatError('K9999'),
}
