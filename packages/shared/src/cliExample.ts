/**
 * CLI 示例类
 *
 * @export
 * @class CLIExample
 */
export class CLIExample {
  command: string

  baseCommandName: string

  content: string[] = []

  /**
   * Creates an instance of CLIExample.
   * @param {string} command 命令行名称
   * @memberof CLIExample
   */
  constructor(command: string, baseCommandName = 'kmi') {
    this.command = command
    this.baseCommandName = baseCommandName
    this.content.push('')
  }

  /**
   * 分组
   *
   * @param {string} group 组名称
   * @returns
   * @memberof CLIExample
   */
  group(group: string): CLIExample {
    this.content.push(`\n# ${group}\n`)
    return this
  }

  /**
   * 规则
   *
   * @param {string} rule 规则名称
   * @param {string} [comment] 规则说明
   * @returns
   * @memberof CLIExample
   */
  rule(rule: string, comment?: string): CLIExample {
    this.content.push(
      `${this.baseCommandName} ${this.command} ${rule}${
        comment ? `\t# ${comment}` : ''
      }`,
    )
    return this
  }

  toString(): string {
    return this.content.join('')
  }
}
