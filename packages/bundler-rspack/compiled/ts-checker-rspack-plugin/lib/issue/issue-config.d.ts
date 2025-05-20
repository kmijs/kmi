import type * as rspack from '@rspack/core';
import type { IssueOptions } from './issue-options';
import type { IssuePredicate } from './issue-predicate';
interface IssueConfig {
    predicate: IssuePredicate;
}
declare function createIssueConfig(compiler: rspack.Compiler, options: IssueOptions | undefined): IssueConfig;
export { IssueConfig, createIssueConfig };
