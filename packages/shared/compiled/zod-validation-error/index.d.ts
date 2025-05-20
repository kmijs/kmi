import * as zod from 'zod';

type ZodError = zod.ZodError;
type ZodIssue = zod.ZodIssue;
declare class ValidationError extends Error {
    details: Array<zod.ZodIssue>;
    name: 'ZodValidationError';
    constructor(message: string, details?: Array<zod.ZodIssue> | undefined);
    toString(): string;
}
type FromZodIssueOptions = {
    issueSeparator?: string;
    unionSeparator?: string;
    prefix?: string | null;
    prefixSeparator?: string;
    includePath?: boolean;
};
declare function fromZodIssue(issue: ZodIssue, options?: FromZodIssueOptions): ValidationError;
type FromZodErrorOptions = FromZodIssueOptions & {
    maxIssuesInMessage?: number;
};
declare function fromZodError(zodError: ZodError, options?: FromZodErrorOptions): ValidationError;
declare const toValidationError: (options?: Parameters<typeof fromZodError>[1]) => (err: unknown) => ValidationError;
declare function isValidationError(err: unknown): err is ValidationError;
declare function isValidationErrorLike(err: unknown): err is ValidationError;
declare const errorMap: zod.ZodErrorMap;

export { ValidationError, errorMap, fromZodError, fromZodIssue, isValidationError, isValidationErrorLike, toValidationError };
export type { FromZodErrorOptions, FromZodIssueOptions, ZodError, ZodIssue };
