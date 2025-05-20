import type { Issue } from './index';
type IssuePredicate = (issue: Issue) => boolean;
declare function createTrivialIssuePredicate(result: boolean): IssuePredicate;
declare function composeIssuePredicates(predicates: IssuePredicate[]): IssuePredicate;
export { IssuePredicate, createTrivialIssuePredicate, composeIssuePredicates };
