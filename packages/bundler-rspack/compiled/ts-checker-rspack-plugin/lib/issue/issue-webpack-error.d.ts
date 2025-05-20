import type { FormatterPathType } from '../formatter';
import type { Issue } from './issue';
declare class IssueWebpackError extends Error {
    readonly issue: Issue;
    readonly hideStack = true;
    file?: string;
    constructor(message: string, pathType: FormatterPathType, issue: Issue);
}
export { IssueWebpackError };
