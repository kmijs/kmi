declare type Primitive = string | number | symbol | bigint | boolean | null | undefined;
declare type Scalars = Primitive | Primitive[];

declare namespace util {
    type AssertEqual<T, U> = (<V>() => V extends T ? 1 : 2) extends <V>() => V extends U ? 1 : 2 ? true : false;
    export const assertEqual: <A, B>(val: AssertEqual<A, B>) => AssertEqual<A, B>;
    export function assertIs<T>(_arg: T): void;
    export function assertNever(_x: never): never;
    export type Omit<T, K extends keyof T> = Pick<T, Exclude<keyof T, K>>;
    export type OmitKeys<T, K extends string> = Pick<T, Exclude<keyof T, K>>;
    export type MakePartial<T, K extends keyof T> = Omit<T, K> & Partial<Pick<T, K>>;
    export const arrayToEnum: <T extends string, U extends [T, ...T[]]>(items: U) => { [k in U[number]]: k; };
    export const getValidEnumValues: (obj: any) => any[];
    export const objectValues: (obj: any) => any[];
    export const objectKeys: ObjectConstructor["keys"];
    export const find: <T>(arr: T[], checker: (arg: T) => any) => T | undefined;
    export type identity<T> = T;
    export type flatten<T> = identity<{
        [k in keyof T]: T[k];
    }>;
    export type noUndefined<T> = T extends undefined ? never : T;
    export const isInteger: NumberConstructor["isInteger"];
    export function joinValues<T extends any[]>(array: T, separator?: string): string;
    export const jsonStringifyReplacer: (_: string, value: any) => any;
    export {};
}
declare const ZodParsedType: {
    function: "function";
    number: "number";
    string: "string";
    nan: "nan";
    integer: "integer";
    float: "float";
    boolean: "boolean";
    date: "date";
    bigint: "bigint";
    symbol: "symbol";
    undefined: "undefined";
    null: "null";
    array: "array";
    object: "object";
    unknown: "unknown";
    promise: "promise";
    void: "void";
    never: "never";
    map: "map";
    set: "set";
};
declare type ZodParsedType = keyof typeof ZodParsedType;
declare const getParsedType: (data: any) => ZodParsedType;

declare type allKeys<T> = T extends any ? keyof T : never;
declare type inferFlattenedErrors<T extends ZodType<any, any, any>, U = string> = typeToFlattenedError<TypeOf<T>, U>;
declare type typeToFlattenedError<T, U = string> = {
    formErrors: U[];
    fieldErrors: {
        [P in allKeys<T>]?: U[];
    };
};
declare const ZodIssueCode: {
    invalid_type: "invalid_type";
    invalid_literal: "invalid_literal";
    custom: "custom";
    invalid_union: "invalid_union";
    invalid_union_discriminator: "invalid_union_discriminator";
    invalid_enum_value: "invalid_enum_value";
    unrecognized_keys: "unrecognized_keys";
    invalid_arguments: "invalid_arguments";
    invalid_return_type: "invalid_return_type";
    invalid_date: "invalid_date";
    invalid_string: "invalid_string";
    too_small: "too_small";
    too_big: "too_big";
    invalid_intersection_types: "invalid_intersection_types";
    not_multiple_of: "not_multiple_of";
    not_finite: "not_finite";
};
declare type ZodIssueCode = keyof typeof ZodIssueCode;
declare type ZodIssueBase = {
    path: (string | number)[];
    message?: string;
};
interface ZodInvalidTypeIssue extends ZodIssueBase {
    code: typeof ZodIssueCode.invalid_type;
    expected: ZodParsedType;
    received: ZodParsedType;
}
interface ZodInvalidLiteralIssue extends ZodIssueBase {
    code: typeof ZodIssueCode.invalid_literal;
    expected: unknown;
    received: unknown;
}
interface ZodUnrecognizedKeysIssue extends ZodIssueBase {
    code: typeof ZodIssueCode.unrecognized_keys;
    keys: string[];
}
interface ZodInvalidUnionIssue extends ZodIssueBase {
    code: typeof ZodIssueCode.invalid_union;
    unionErrors: ZodError[];
}
interface ZodInvalidUnionDiscriminatorIssue extends ZodIssueBase {
    code: typeof ZodIssueCode.invalid_union_discriminator;
    options: Primitive[];
}
interface ZodInvalidEnumValueIssue extends ZodIssueBase {
    received: string | number;
    code: typeof ZodIssueCode.invalid_enum_value;
    options: (string | number)[];
}
interface ZodInvalidArgumentsIssue extends ZodIssueBase {
    code: typeof ZodIssueCode.invalid_arguments;
    argumentsError: ZodError;
}
interface ZodInvalidReturnTypeIssue extends ZodIssueBase {
    code: typeof ZodIssueCode.invalid_return_type;
    returnTypeError: ZodError;
}
interface ZodInvalidDateIssue extends ZodIssueBase {
    code: typeof ZodIssueCode.invalid_date;
}
declare type StringValidation = "email" | "url" | "uuid" | "regex" | "cuid" | "cuid2" | "datetime" | {
    startsWith: string;
} | {
    endsWith: string;
};
interface ZodInvalidStringIssue extends ZodIssueBase {
    code: typeof ZodIssueCode.invalid_string;
    validation: StringValidation;
}
interface ZodTooSmallIssue extends ZodIssueBase {
    code: typeof ZodIssueCode.too_small;
    minimum: number;
    inclusive: boolean;
    exact?: boolean;
    type: "array" | "string" | "number" | "set" | "date";
}
interface ZodTooBigIssue extends ZodIssueBase {
    code: typeof ZodIssueCode.too_big;
    maximum: number;
    inclusive: boolean;
    exact?: boolean;
    type: "array" | "string" | "number" | "set" | "date";
}
interface ZodInvalidIntersectionTypesIssue extends ZodIssueBase {
    code: typeof ZodIssueCode.invalid_intersection_types;
}
interface ZodNotMultipleOfIssue extends ZodIssueBase {
    code: typeof ZodIssueCode.not_multiple_of;
    multipleOf: number;
}
interface ZodNotFiniteIssue extends ZodIssueBase {
    code: typeof ZodIssueCode.not_finite;
}
interface ZodCustomIssue extends ZodIssueBase {
    code: typeof ZodIssueCode.custom;
    params?: {
        [k: string]: any;
    };
}
declare type DenormalizedError = {
    [k: string]: DenormalizedError | string[];
};
declare type ZodIssueOptionalMessage = ZodInvalidTypeIssue | ZodInvalidLiteralIssue | ZodUnrecognizedKeysIssue | ZodInvalidUnionIssue | ZodInvalidUnionDiscriminatorIssue | ZodInvalidEnumValueIssue | ZodInvalidArgumentsIssue | ZodInvalidReturnTypeIssue | ZodInvalidDateIssue | ZodInvalidStringIssue | ZodTooSmallIssue | ZodTooBigIssue | ZodInvalidIntersectionTypesIssue | ZodNotMultipleOfIssue | ZodNotFiniteIssue | ZodCustomIssue;
declare type ZodIssue = ZodIssueOptionalMessage & {
    fatal?: boolean;
    message: string;
};
declare const quotelessJson: (obj: any) => string;
declare type ZodFormattedError<T, U = string> = {
    _errors: U[];
} & (NonNullable<T> extends [any, ...any[]] ? {
    [K in keyof NonNullable<T>]?: ZodFormattedError<NonNullable<T>[K], U>;
} : NonNullable<T> extends any[] ? {
    [k: number]: ZodFormattedError<NonNullable<T>[number], U>;
} : NonNullable<T> extends object ? {
    [K in keyof NonNullable<T>]?: ZodFormattedError<NonNullable<T>[K], U>;
} : unknown);
declare type inferFormattedError<T extends ZodType<any, any, any>, U = string> = ZodFormattedError<TypeOf<T>, U>;
declare class ZodError<T = any> extends Error {
    issues: ZodIssue[];
    get errors(): ZodIssue[];
    constructor(issues: ZodIssue[]);
    format(): ZodFormattedError<T>;
    format<U>(mapper: (issue: ZodIssue) => U): ZodFormattedError<T, U>;
    static create: (issues: ZodIssue[]) => ZodError<any>;
    toString(): string;
    get message(): string;
    get isEmpty(): boolean;
    addIssue: (sub: ZodIssue) => void;
    addIssues: (subs?: ZodIssue[]) => void;
    flatten(): typeToFlattenedError<T>;
    flatten<U>(mapper?: (issue: ZodIssue) => U): typeToFlattenedError<T, U>;
    get formErrors(): typeToFlattenedError<T, string>;
}
declare type stripPath<T extends object> = T extends any ? util.OmitKeys<T, "path"> : never;
declare type IssueData = stripPath<ZodIssueOptionalMessage> & {
    path?: (string | number)[];
    fatal?: boolean;
};
declare type ErrorMapCtx = {
    defaultError: string;
    data: any;
};
declare type ZodErrorMap = (issue: ZodIssueOptionalMessage, _ctx: ErrorMapCtx) => {
    message: string;
};

declare const errorMap: ZodErrorMap;

declare function setErrorMap(map: ZodErrorMap): void;
declare function getErrorMap(): ZodErrorMap;

declare const makeIssue: (params: {
    data: any;
    path: (string | number)[];
    errorMaps: ZodErrorMap[];
    issueData: IssueData;
}) => ZodIssue;
declare type ParseParams = {
    path: (string | number)[];
    errorMap: ZodErrorMap;
    async: boolean;
};
declare type ParsePathComponent = string | number;
declare type ParsePath = ParsePathComponent[];
declare const EMPTY_PATH: ParsePath;
interface ParseContext {
    readonly common: {
        readonly issues: ZodIssue[];
        readonly contextualErrorMap?: ZodErrorMap;
        readonly async: boolean;
    };
    readonly path: ParsePath;
    readonly schemaErrorMap?: ZodErrorMap;
    readonly parent: ParseContext | null;
    readonly data: any;
    readonly parsedType: ZodParsedType;
}
declare type ParseInput = {
    data: any;
    path: (string | number)[];
    parent: ParseContext;
};
declare function addIssueToContext(ctx: ParseContext, issueData: IssueData): void;
declare type ObjectPair = {
    key: SyncParseReturnType<any>;
    value: SyncParseReturnType<any>;
};
declare class ParseStatus {
    value: "aborted" | "dirty" | "valid";
    dirty(): void;
    abort(): void;
    static mergeArray(status: ParseStatus, results: SyncParseReturnType<any>[]): SyncParseReturnType;
    static mergeObjectAsync(status: ParseStatus, pairs: {
        key: ParseReturnType<any>;
        value: ParseReturnType<any>;
    }[]): Promise<SyncParseReturnType<any>>;
    static mergeObjectSync(status: ParseStatus, pairs: {
        key: SyncParseReturnType<any>;
        value: SyncParseReturnType<any>;
        alwaysSet?: boolean;
    }[]): SyncParseReturnType;
}
interface ParseResult {
    status: "aborted" | "dirty" | "valid";
    data: any;
}
declare type INVALID = {
    status: "aborted";
};
declare const INVALID: INVALID;
declare type DIRTY<T> = {
    status: "dirty";
    value: T;
};
declare const DIRTY: <T>(value: T) => DIRTY<T>;
declare type OK<T> = {
    status: "valid";
    value: T;
};
declare const OK: <T>(value: T) => OK<T>;
declare type SyncParseReturnType<T = any> = OK<T> | DIRTY<T> | INVALID;
declare type AsyncParseReturnType<T> = Promise<SyncParseReturnType<T>>;
declare type ParseReturnType<T> = SyncParseReturnType<T> | AsyncParseReturnType<T>;
declare const isAborted: (x: ParseReturnType<any>) => x is INVALID;
declare const isDirty: <T>(x: ParseReturnType<T>) => x is OK<T> | DIRTY<T>;
declare const isValid: <T>(x: ParseReturnType<T>) => x is OK<T> | DIRTY<T>;
declare const isAsync: <T>(x: ParseReturnType<T>) => x is AsyncParseReturnType<T>;

declare namespace enumUtil {
    type UnionToIntersectionFn<T> = (T extends unknown ? (k: () => T) => void : never) extends (k: infer Intersection) => void ? Intersection : never;
    type GetUnionLast<T> = UnionToIntersectionFn<T> extends () => infer Last ? Last : never;
    type UnionToTuple<T, Tuple extends unknown[] = []> = [T] extends [never] ? Tuple : UnionToTuple<Exclude<T, GetUnionLast<T>>, [GetUnionLast<T>, ...Tuple]>;
    type CastToStringTuple<T> = T extends [string, ...string[]] ? T : never;
    export type UnionToTupleString<T> = CastToStringTuple<UnionToTuple<T>>;
    export {};
}

declare namespace errorUtil {
    type ErrMessage = string | {
        message?: string;
    };
    const errToObj: (message?: ErrMessage | undefined) => {
        message?: string | undefined;
    };
    const toString: (message?: ErrMessage | undefined) => string | undefined;
}

declare namespace partialUtil {
    type DeepPartial<T extends ZodTypeAny> = T extends ZodObject<infer Shape, infer Params, infer Catchall> ? ZodObject<{
        [k in keyof Shape]: ZodOptional<DeepPartial<Shape[k]>>;
    }, Params, Catchall> : T extends ZodArray<infer Type, infer Card> ? ZodArray<DeepPartial<Type>, Card> : T extends ZodOptional<infer Type> ? ZodOptional<DeepPartial<Type>> : T extends ZodNullable<infer Type> ? ZodNullable<DeepPartial<Type>> : T extends ZodTuple<infer Items> ? {
        [k in keyof Items]: Items[k] extends ZodTypeAny ? DeepPartial<Items[k]> : never;
    } extends infer PI ? PI extends ZodTupleItems ? ZodTuple<PI> : never : never : T;
}

declare type RefinementCtx = {
    addIssue: (arg: IssueData) => void;
    path: (string | number)[];
};
declare type ZodRawShape = {
    [k: string]: ZodTypeAny;
};
declare type ZodTypeAny = ZodType<any, any, any>;
declare type TypeOf<T extends ZodType<any, any, any>> = T["_output"];
declare type input<T extends ZodType<any, any, any>> = T["_input"];
declare type output<T extends ZodType<any, any, any>> = T["_output"];

declare type CustomErrorParams = Partial<util.Omit<ZodCustomIssue, "code">>;
interface ZodTypeDef {
    errorMap?: ZodErrorMap;
    description?: string;
}
declare type RawCreateParams = {
    errorMap?: ZodErrorMap;
    invalid_type_error?: string;
    required_error?: string;
    description?: string;
} | undefined;
declare type ProcessedCreateParams = {
    errorMap?: ZodErrorMap;
    description?: string;
};
declare type SafeParseSuccess<Output> = {
    success: true;
    data: Output;
};
declare type SafeParseError<Input> = {
    success: false;
    error: ZodError<Input>;
};
declare type SafeParseReturnType<Input, Output> = SafeParseSuccess<Output> | SafeParseError<Input>;
declare abstract class ZodType<Output = any, Def extends ZodTypeDef = ZodTypeDef, Input = Output> {
    readonly _type: Output;
    readonly _output: Output;
    readonly _input: Input;
    readonly _def: Def;
    get description(): string | undefined;
    abstract _parse(input: ParseInput): ParseReturnType<Output>;
    _getType(input: ParseInput): string;
    _getOrReturnCtx(input: ParseInput, ctx?: ParseContext | undefined): ParseContext;
    _processInputParams(input: ParseInput): {
        status: ParseStatus;
        ctx: ParseContext;
    };
    _parseSync(input: ParseInput): SyncParseReturnType<Output>;
    _parseAsync(input: ParseInput): AsyncParseReturnType<Output>;
    parse(data: unknown, params?: Partial<ParseParams>): Output;
    safeParse(data: unknown, params?: Partial<ParseParams>): SafeParseReturnType<Input, Output>;
    parseAsync(data: unknown, params?: Partial<ParseParams>): Promise<Output>;
    safeParseAsync(data: unknown, params?: Partial<ParseParams>): Promise<SafeParseReturnType<Input, Output>>;
    /** Alias of safeParseAsync */
    spa: (data: unknown, params?: Partial<ParseParams> | undefined) => Promise<SafeParseReturnType<Input, Output>>;
    refine<RefinedOutput extends Output>(check: (arg: Output) => arg is RefinedOutput, message?: string | CustomErrorParams | ((arg: Output) => CustomErrorParams)): ZodEffects<this, RefinedOutput, Input>;
    refine(check: (arg: Output) => unknown | Promise<unknown>, message?: string | CustomErrorParams | ((arg: Output) => CustomErrorParams)): ZodEffects<this, Output, Input>;
    refinement<RefinedOutput extends Output>(check: (arg: Output) => arg is RefinedOutput, refinementData: IssueData | ((arg: Output, ctx: RefinementCtx) => IssueData)): ZodEffects<this, RefinedOutput, Input>;
    refinement(check: (arg: Output) => boolean, refinementData: IssueData | ((arg: Output, ctx: RefinementCtx) => IssueData)): ZodEffects<this, Output, Input>;
    _refinement(refinement: RefinementEffect<Output>["refinement"]): ZodEffects<this, Output, Input>;
    superRefine<RefinedOutput extends Output>(refinement: (arg: Output, ctx: RefinementCtx) => arg is RefinedOutput): ZodEffects<this, RefinedOutput, Input>;
    superRefine(refinement: (arg: Output, ctx: RefinementCtx) => void): ZodEffects<this, Output, Input>;
    constructor(def: Def);
    optional(): ZodOptional<this>;
    nullable(): ZodNullable<this>;
    nullish(): ZodOptional<ZodNullable<this>>;
    array(): ZodArray<this>;
    promise(): ZodPromise<this>;
    or<T extends ZodTypeAny>(option: T): ZodUnion<[this, T]>;
    and<T extends ZodTypeAny>(incoming: T): ZodIntersection<this, T>;
    transform<NewOut>(transform: (arg: Output, ctx: RefinementCtx) => NewOut | Promise<NewOut>): ZodEffects<this, NewOut>;
    default(def: util.noUndefined<Input>): ZodDefault<this>;
    default(def: () => util.noUndefined<Input>): ZodDefault<this>;
    brand<B extends string | number | symbol>(brand?: B): ZodBranded<this, B>;
    catch(def: Output): ZodCatch<this>;
    catch(def: () => Output): ZodCatch<this>;
    describe(description: string): this;
    pipe<T extends ZodTypeAny>(target: T): ZodPipeline<this, T>;
    isOptional(): boolean;
    isNullable(): boolean;
}
declare type ZodStringCheck = {
    kind: "min";
    value: number;
    message?: string;
} | {
    kind: "max";
    value: number;
    message?: string;
} | {
    kind: "length";
    value: number;
    message?: string;
} | {
    kind: "email";
    message?: string;
} | {
    kind: "url";
    message?: string;
} | {
    kind: "uuid";
    message?: string;
} | {
    kind: "cuid";
    message?: string;
} | {
    kind: "cuid2";
    message?: string;
} | {
    kind: "startsWith";
    value: string;
    message?: string;
} | {
    kind: "endsWith";
    value: string;
    message?: string;
} | {
    kind: "regex";
    regex: RegExp;
    message?: string;
} | {
    kind: "trim";
    message?: string;
} | {
    kind: "datetime";
    offset: boolean;
    precision: number | null;
    message?: string;
};
interface ZodStringDef extends ZodTypeDef {
    checks: ZodStringCheck[];
    typeName: ZodFirstPartyTypeKind.ZodString;
    coerce: boolean;
}
declare class ZodString extends ZodType<string, ZodStringDef> {
    _parse(input: ParseInput): ParseReturnType<string>;
    protected _regex: (regex: RegExp, validation: StringValidation, message?: errorUtil.ErrMessage | undefined) => ZodEffects<this, string, string>;
    _addCheck(check: ZodStringCheck): ZodString;
    email(message?: errorUtil.ErrMessage): ZodString;
    url(message?: errorUtil.ErrMessage): ZodString;
    uuid(message?: errorUtil.ErrMessage): ZodString;
    cuid(message?: errorUtil.ErrMessage): ZodString;
    cuid2(message?: errorUtil.ErrMessage): ZodString;
    datetime(options?: string | {
        message?: string | undefined;
        precision?: number | null;
        offset?: boolean;
    }): ZodString;
    regex(regex: RegExp, message?: errorUtil.ErrMessage): ZodString;
    startsWith(value: string, message?: errorUtil.ErrMessage): ZodString;
    endsWith(value: string, message?: errorUtil.ErrMessage): ZodString;
    min(minLength: number, message?: errorUtil.ErrMessage): ZodString;
    max(maxLength: number, message?: errorUtil.ErrMessage): ZodString;
    length(len: number, message?: errorUtil.ErrMessage): ZodString;
    /**
     * @deprecated Use z.string().min(1) instead.
     * @see {@link ZodString.min}
     */
    nonempty: (message?: errorUtil.ErrMessage | undefined) => ZodString;
    trim: () => ZodString;
    get isDatetime(): boolean;
    get isEmail(): boolean;
    get isURL(): boolean;
    get isUUID(): boolean;
    get isCUID(): boolean;
    get isCUID2(): boolean;
    get minLength(): number | null;
    get maxLength(): number | null;
    static create: (params?: ({
        errorMap?: ZodErrorMap | undefined;
        invalid_type_error?: string | undefined;
        required_error?: string | undefined;
        description?: string | undefined;
    } & {
        coerce?: true | undefined;
    }) | undefined) => ZodString;
}
declare type ZodNumberCheck = {
    kind: "min";
    value: number;
    inclusive: boolean;
    message?: string;
} | {
    kind: "max";
    value: number;
    inclusive: boolean;
    message?: string;
} | {
    kind: "int";
    message?: string;
} | {
    kind: "multipleOf";
    value: number;
    message?: string;
} | {
    kind: "finite";
    message?: string;
};
interface ZodNumberDef extends ZodTypeDef {
    checks: ZodNumberCheck[];
    typeName: ZodFirstPartyTypeKind.ZodNumber;
    coerce: boolean;
}
declare class ZodNumber extends ZodType<number, ZodNumberDef> {
    _parse(input: ParseInput): ParseReturnType<number>;
    static create: (params?: ({
        errorMap?: ZodErrorMap | undefined;
        invalid_type_error?: string | undefined;
        required_error?: string | undefined;
        description?: string | undefined;
    } & {
        coerce?: boolean | undefined;
    }) | undefined) => ZodNumber;
    gte(value: number, message?: errorUtil.ErrMessage): ZodNumber;
    min: (value: number, message?: errorUtil.ErrMessage | undefined) => ZodNumber;
    gt(value: number, message?: errorUtil.ErrMessage): ZodNumber;
    lte(value: number, message?: errorUtil.ErrMessage): ZodNumber;
    max: (value: number, message?: errorUtil.ErrMessage | undefined) => ZodNumber;
    lt(value: number, message?: errorUtil.ErrMessage): ZodNumber;
    protected setLimit(kind: "min" | "max", value: number, inclusive: boolean, message?: string): ZodNumber;
    _addCheck(check: ZodNumberCheck): ZodNumber;
    int(message?: errorUtil.ErrMessage): ZodNumber;
    positive(message?: errorUtil.ErrMessage): ZodNumber;
    negative(message?: errorUtil.ErrMessage): ZodNumber;
    nonpositive(message?: errorUtil.ErrMessage): ZodNumber;
    nonnegative(message?: errorUtil.ErrMessage): ZodNumber;
    multipleOf(value: number, message?: errorUtil.ErrMessage): ZodNumber;
    finite(message?: errorUtil.ErrMessage): ZodNumber;
    step: (value: number, message?: errorUtil.ErrMessage | undefined) => ZodNumber;
    get minValue(): number | null;
    get maxValue(): number | null;
    get isInt(): boolean;
    get isFinite(): boolean;
}
interface ZodBigIntDef extends ZodTypeDef {
    typeName: ZodFirstPartyTypeKind.ZodBigInt;
    coerce: boolean;
}
declare class ZodBigInt extends ZodType<bigint, ZodBigIntDef> {
    _parse(input: ParseInput): ParseReturnType<bigint>;
    static create: (params?: ({
        errorMap?: ZodErrorMap | undefined;
        invalid_type_error?: string | undefined;
        required_error?: string | undefined;
        description?: string | undefined;
    } & {
        coerce?: boolean | undefined;
    }) | undefined) => ZodBigInt;
}
interface ZodBooleanDef extends ZodTypeDef {
    typeName: ZodFirstPartyTypeKind.ZodBoolean;
    coerce: boolean;
}
declare class ZodBoolean extends ZodType<boolean, ZodBooleanDef> {
    _parse(input: ParseInput): ParseReturnType<boolean>;
    static create: (params?: ({
        errorMap?: ZodErrorMap | undefined;
        invalid_type_error?: string | undefined;
        required_error?: string | undefined;
        description?: string | undefined;
    } & {
        coerce?: boolean | undefined;
    }) | undefined) => ZodBoolean;
}
declare type ZodDateCheck = {
    kind: "min";
    value: number;
    message?: string;
} | {
    kind: "max";
    value: number;
    message?: string;
};
interface ZodDateDef extends ZodTypeDef {
    checks: ZodDateCheck[];
    coerce: boolean;
    typeName: ZodFirstPartyTypeKind.ZodDate;
}
declare class ZodDate extends ZodType<Date, ZodDateDef> {
    _parse(input: ParseInput): ParseReturnType<this["_output"]>;
    _addCheck(check: ZodDateCheck): ZodDate;
    min(minDate: Date, message?: errorUtil.ErrMessage): ZodDate;
    max(maxDate: Date, message?: errorUtil.ErrMessage): ZodDate;
    get minDate(): Date | null;
    get maxDate(): Date | null;
    static create: (params?: ({
        errorMap?: ZodErrorMap | undefined;
        invalid_type_error?: string | undefined;
        required_error?: string | undefined;
        description?: string | undefined;
    } & {
        coerce?: boolean | undefined;
    }) | undefined) => ZodDate;
}
interface ZodSymbolDef extends ZodTypeDef {
    typeName: ZodFirstPartyTypeKind.ZodSymbol;
}
declare class ZodSymbol extends ZodType<symbol, ZodSymbolDef, symbol> {
    _parse(input: ParseInput): ParseReturnType<this["_output"]>;
    static create: (params?: RawCreateParams) => ZodSymbol;
}
interface ZodUndefinedDef extends ZodTypeDef {
    typeName: ZodFirstPartyTypeKind.ZodUndefined;
}
declare class ZodUndefined extends ZodType<undefined, ZodUndefinedDef> {
    _parse(input: ParseInput): ParseReturnType<this["_output"]>;
    params?: RawCreateParams;
    static create: (params?: RawCreateParams) => ZodUndefined;
}
interface ZodNullDef extends ZodTypeDef {
    typeName: ZodFirstPartyTypeKind.ZodNull;
}
declare class ZodNull extends ZodType<null, ZodNullDef> {
    _parse(input: ParseInput): ParseReturnType<this["_output"]>;
    static create: (params?: RawCreateParams) => ZodNull;
}
interface ZodAnyDef extends ZodTypeDef {
    typeName: ZodFirstPartyTypeKind.ZodAny;
}
declare class ZodAny extends ZodType<any, ZodAnyDef> {
    _any: true;
    _parse(input: ParseInput): ParseReturnType<this["_output"]>;
    static create: (params?: RawCreateParams) => ZodAny;
}
interface ZodUnknownDef extends ZodTypeDef {
    typeName: ZodFirstPartyTypeKind.ZodUnknown;
}
declare class ZodUnknown extends ZodType<unknown, ZodUnknownDef> {
    _unknown: true;
    _parse(input: ParseInput): ParseReturnType<this["_output"]>;
    static create: (params?: RawCreateParams) => ZodUnknown;
}
interface ZodNeverDef extends ZodTypeDef {
    typeName: ZodFirstPartyTypeKind.ZodNever;
}
declare class ZodNever extends ZodType<never, ZodNeverDef> {
    _parse(input: ParseInput): ParseReturnType<this["_output"]>;
    static create: (params?: RawCreateParams) => ZodNever;
}
interface ZodVoidDef extends ZodTypeDef {
    typeName: ZodFirstPartyTypeKind.ZodVoid;
}
declare class ZodVoid extends ZodType<void, ZodVoidDef> {
    _parse(input: ParseInput): ParseReturnType<this["_output"]>;
    static create: (params?: RawCreateParams) => ZodVoid;
}
interface ZodArrayDef<T extends ZodTypeAny = ZodTypeAny> extends ZodTypeDef {
    type: T;
    typeName: ZodFirstPartyTypeKind.ZodArray;
    exactLength: {
        value: number;
        message?: string;
    } | null;
    minLength: {
        value: number;
        message?: string;
    } | null;
    maxLength: {
        value: number;
        message?: string;
    } | null;
}
declare type ArrayCardinality = "many" | "atleastone";
declare type arrayOutputType<T extends ZodTypeAny, Cardinality extends ArrayCardinality = "many"> = Cardinality extends "atleastone" ? [T["_output"], ...T["_output"][]] : T["_output"][];
declare class ZodArray<T extends ZodTypeAny, Cardinality extends ArrayCardinality = "many"> extends ZodType<arrayOutputType<T, Cardinality>, ZodArrayDef<T>, Cardinality extends "atleastone" ? [T["_input"], ...T["_input"][]] : T["_input"][]> {
    _parse(input: ParseInput): ParseReturnType<this["_output"]>;
    get element(): T;
    min(minLength: number, message?: errorUtil.ErrMessage): this;
    max(maxLength: number, message?: errorUtil.ErrMessage): this;
    length(len: number, message?: errorUtil.ErrMessage): this;
    nonempty(message?: errorUtil.ErrMessage): ZodArray<T, "atleastone">;
    static create: <T_1 extends ZodTypeAny>(schema: T_1, params?: RawCreateParams) => ZodArray<T_1, "many">;
}
declare type ZodNonEmptyArray<T extends ZodTypeAny> = ZodArray<T, "atleastone">;
declare namespace objectUtil {
    export type MergeShapes<U extends ZodRawShape, V extends ZodRawShape> = {
        [k in Exclude<keyof U, keyof V>]: U[k];
    } & V;
    type optionalKeys<T extends object> = {
        [k in keyof T]: undefined extends T[k] ? k : never;
    }[keyof T];
    type requiredKeys<T extends object> = {
        [k in keyof T]: undefined extends T[k] ? never : k;
    }[keyof T];
    export type addQuestionMarks<T extends object> = Partial<Pick<T, optionalKeys<T>>> & Pick<T, requiredKeys<T>>;
    export type identity<T> = T;
    export type flatten<T extends object> = identity<{
        [k in keyof T]: T[k];
    }>;
    export type noNeverKeys<T extends ZodRawShape> = {
        [k in keyof T]: [T[k]] extends [never] ? never : k;
    }[keyof T];
    export type noNever<T extends ZodRawShape> = identity<{
        [k in noNeverKeys<T>]: k extends keyof T ? T[k] : never;
    }>;
    export const mergeShapes: <U extends ZodRawShape, T extends ZodRawShape>(first: U, second: T) => T & U;
    export {};
}
declare type extendShape<A, B> = util.flatten<Omit<A, keyof B> & B>;
declare type UnknownKeysParam = "passthrough" | "strict" | "strip";
interface ZodObjectDef<T extends ZodRawShape = ZodRawShape, UnknownKeys extends UnknownKeysParam = UnknownKeysParam, Catchall extends ZodTypeAny = ZodTypeAny> extends ZodTypeDef {
    typeName: ZodFirstPartyTypeKind.ZodObject;
    shape: () => T;
    catchall: Catchall;
    unknownKeys: UnknownKeys;
}
declare type mergeTypes<A, B> = {
    [k in keyof A | keyof B]: k extends keyof B ? B[k] : k extends keyof A ? A[k] : never;
};
declare type processType<T extends object> = util.flatten<objectUtil.addQuestionMarks<T>>;
declare type baseObjectOutputType<Shape extends ZodRawShape> = objectUtil.addQuestionMarks<{
    [k in keyof Shape]: Shape[k]["_output"];
}>;
declare type objectOutputType<Shape extends ZodRawShape, Catchall extends ZodTypeAny> = ZodTypeAny extends Catchall ? objectUtil.flatten<baseObjectOutputType<Shape>> : objectUtil.flatten<baseObjectOutputType<Shape> & {
    [k: string]: Catchall["_output"];
}>;
declare type baseObjectInputType<Shape extends ZodRawShape> = objectUtil.flatten<objectUtil.addQuestionMarks<{
    [k in keyof Shape]: Shape[k]["_input"];
}>>;
declare type objectInputType<Shape extends ZodRawShape, Catchall extends ZodTypeAny> = ZodTypeAny extends Catchall ? baseObjectInputType<Shape> : objectUtil.flatten<baseObjectInputType<Shape> & {
    [k: string]: Catchall["_input"];
}>;
declare type deoptional<T extends ZodTypeAny> = T extends ZodOptional<infer U> ? deoptional<U> : T extends ZodNullable<infer U> ? ZodNullable<deoptional<U>> : T;
declare type SomeZodObject = ZodObject<ZodRawShape, UnknownKeysParam, ZodTypeAny>;
declare type objectKeyMask<Obj> = {
    [k in keyof Obj]?: true;
};
declare type noUnrecognized<Obj extends object, Shape extends object> = {
    [k in keyof Obj]: k extends keyof Shape ? Obj[k] : never;
};
declare class ZodObject<T extends ZodRawShape, UnknownKeys extends UnknownKeysParam = UnknownKeysParam, Catchall extends ZodTypeAny = ZodTypeAny, Output = objectOutputType<T, Catchall>, Input = objectInputType<T, Catchall>> extends ZodType<Output, ZodObjectDef<T, UnknownKeys, Catchall>, Input> {
    private _cached;
    _getCached(): {
        shape: T;
        keys: string[];
    };
    _parse(input: ParseInput): ParseReturnType<this["_output"]>;
    get shape(): T;
    strict(message?: errorUtil.ErrMessage): ZodObject<T, "strict", Catchall>;
    strip(): ZodObject<T, "strip", Catchall>;
    passthrough(): ZodObject<T, "passthrough", Catchall>;
    /**
     * @deprecated In most cases, this is no longer needed - unknown properties are now silently stripped.
     * If you want to pass through unknown properties, use `.passthrough()` instead.
     */
    nonstrict: () => ZodObject<T, "passthrough", Catchall>;
    extend<Augmentation extends ZodRawShape>(augmentation: Augmentation): ZodObject<extendShape<T, Augmentation>, UnknownKeys, Catchall>;
    /**
     * @deprecated Use `.extend` instead
     *  */
    augment: <Augmentation extends ZodRawShape>(augmentation: Augmentation) => ZodObject<{ [k in keyof (Omit<T, keyof Augmentation> & Augmentation)]: (Omit<T, keyof Augmentation> & Augmentation)[k]; }, UnknownKeys, Catchall, objectOutputType<{ [k in keyof (Omit<T, keyof Augmentation> & Augmentation)]: (Omit<T, keyof Augmentation> & Augmentation)[k]; }, Catchall>, objectInputType<{ [k in keyof (Omit<T, keyof Augmentation> & Augmentation)]: (Omit<T, keyof Augmentation> & Augmentation)[k]; }, Catchall>>;
    /**
     * Prior to zod@1.0.12 there was a bug in the
     * inferred type of merged objects. Please
     * upgrade if you are experiencing issues.
     */
    merge<Incoming extends AnyZodObject, Augmentation extends Incoming["shape"]>(merging: Incoming): ZodObject<extendShape<T, Augmentation>, Incoming["_def"]["unknownKeys"], Incoming["_def"]["catchall"]>;
    setKey<Key extends string, Schema extends ZodTypeAny>(key: Key, schema: Schema): ZodObject<T & {
        [k in Key]: Schema;
    }, UnknownKeys, Catchall>;
    catchall<Index extends ZodTypeAny>(index: Index): ZodObject<T, UnknownKeys, Index>;
    pick<Mask extends objectKeyMask<T>>(mask: noUnrecognized<Mask, T>): ZodObject<Pick<T, Extract<keyof T, keyof Mask>>, UnknownKeys, Catchall>;
    omit<Mask extends objectKeyMask<T>>(mask: noUnrecognized<Mask, objectKeyMask<T>>): ZodObject<Omit<T, keyof Mask>, UnknownKeys, Catchall>;
    deepPartial(): partialUtil.DeepPartial<this>;
    partial(): ZodObject<{
        [k in keyof T]: ZodOptional<T[k]>;
    }, UnknownKeys, Catchall>;
    partial<Mask extends objectKeyMask<T>>(mask: noUnrecognized<Mask, objectKeyMask<T>>): ZodObject<objectUtil.noNever<{
        [k in keyof T]: k extends keyof Mask ? ZodOptional<T[k]> : T[k];
    }>, UnknownKeys, Catchall>;
    required(): ZodObject<{
        [k in keyof T]: deoptional<T[k]>;
    }, UnknownKeys, Catchall>;
    required<Mask extends objectKeyMask<T>>(mask: noUnrecognized<Mask, objectKeyMask<T>>): ZodObject<objectUtil.noNever<{
        [k in keyof T]: k extends keyof Mask ? deoptional<T[k]> : T[k];
    }>, UnknownKeys, Catchall>;
    keyof(): ZodEnum<enumUtil.UnionToTupleString<keyof T>>;
    static create: <T_1 extends ZodRawShape>(shape: T_1, params?: RawCreateParams) => ZodObject<T_1, "strip", ZodTypeAny, { [k in keyof baseObjectOutputType<T_1>]: baseObjectOutputType<T_1>[k]; }, { [k_2 in keyof objectUtil.addQuestionMarks<{ [k_1 in keyof T_1]: T_1[k_1]["_input"]; }>]: objectUtil.addQuestionMarks<{ [k_1 in keyof T_1]: T_1[k_1]["_input"]; }>[k_2]; }>;
    static strictCreate: <T_1 extends ZodRawShape>(shape: T_1, params?: RawCreateParams) => ZodObject<T_1, "strict", ZodTypeAny, { [k in keyof baseObjectOutputType<T_1>]: baseObjectOutputType<T_1>[k]; }, { [k_2 in keyof objectUtil.addQuestionMarks<{ [k_1 in keyof T_1]: T_1[k_1]["_input"]; }>]: objectUtil.addQuestionMarks<{ [k_1 in keyof T_1]: T_1[k_1]["_input"]; }>[k_2]; }>;
    static lazycreate: <T_1 extends ZodRawShape>(shape: () => T_1, params?: RawCreateParams) => ZodObject<T_1, "strip", ZodTypeAny, { [k in keyof baseObjectOutputType<T_1>]: baseObjectOutputType<T_1>[k]; }, { [k_2 in keyof objectUtil.addQuestionMarks<{ [k_1 in keyof T_1]: T_1[k_1]["_input"]; }>]: objectUtil.addQuestionMarks<{ [k_1 in keyof T_1]: T_1[k_1]["_input"]; }>[k_2]; }>;
}
declare type AnyZodObject = ZodObject<any, any, any>;
declare type ZodUnionOptions = Readonly<[ZodTypeAny, ...ZodTypeAny[]]>;
interface ZodUnionDef<T extends ZodUnionOptions = Readonly<[
    ZodTypeAny,
    ZodTypeAny,
    ...ZodTypeAny[]
]>> extends ZodTypeDef {
    options: T;
    typeName: ZodFirstPartyTypeKind.ZodUnion;
}
declare class ZodUnion<T extends ZodUnionOptions> extends ZodType<T[number]["_output"], ZodUnionDef<T>, T[number]["_input"]> {
    _parse(input: ParseInput): ParseReturnType<this["_output"]>;
    get options(): T;
    static create: <T_1 extends readonly [ZodTypeAny, ZodTypeAny, ...ZodTypeAny[]]>(types: T_1, params?: RawCreateParams) => ZodUnion<T_1>;
}
declare type ZodDiscriminatedUnionOption<Discriminator extends string> = ZodObject<{
    [key in Discriminator]: ZodTypeAny;
} & ZodRawShape, UnknownKeysParam, ZodTypeAny>;
interface ZodDiscriminatedUnionDef<Discriminator extends string, Options extends ZodDiscriminatedUnionOption<string>[] = ZodDiscriminatedUnionOption<string>[]> extends ZodTypeDef {
    discriminator: Discriminator;
    options: Options;
    optionsMap: Map<Primitive, ZodDiscriminatedUnionOption<any>>;
    typeName: ZodFirstPartyTypeKind.ZodDiscriminatedUnion;
}
declare class ZodDiscriminatedUnion<Discriminator extends string, Options extends ZodDiscriminatedUnionOption<Discriminator>[]> extends ZodType<output<Options[number]>, ZodDiscriminatedUnionDef<Discriminator, Options>, input<Options[number]>> {
    _parse(input: ParseInput): ParseReturnType<this["_output"]>;
    get discriminator(): Discriminator;
    get options(): Options;
    get optionsMap(): Map<Primitive, ZodDiscriminatedUnionOption<any>>;
    /**
     * The constructor of the discriminated union schema. Its behaviour is very similar to that of the normal z.union() constructor.
     * However, it only allows a union of objects, all of which need to share a discriminator property. This property must
     * have a different value for each object in the union.
     * @param discriminator the name of the discriminator property
     * @param types an array of object schemas
     * @param params
     */
    static create<Discriminator extends string, Types extends [
        ZodDiscriminatedUnionOption<Discriminator>,
        ...ZodDiscriminatedUnionOption<Discriminator>[]
    ]>(discriminator: Discriminator, options: Types, params?: RawCreateParams): ZodDiscriminatedUnion<Discriminator, Types>;
}
interface ZodIntersectionDef<T extends ZodTypeAny = ZodTypeAny, U extends ZodTypeAny = ZodTypeAny> extends ZodTypeDef {
    left: T;
    right: U;
    typeName: ZodFirstPartyTypeKind.ZodIntersection;
}
declare class ZodIntersection<T extends ZodTypeAny, U extends ZodTypeAny> extends ZodType<T["_output"] & U["_output"], ZodIntersectionDef<T, U>, T["_input"] & U["_input"]> {
    _parse(input: ParseInput): ParseReturnType<this["_output"]>;
    static create: <T_1 extends ZodTypeAny, U_1 extends ZodTypeAny>(left: T_1, right: U_1, params?: RawCreateParams) => ZodIntersection<T_1, U_1>;
}
declare type ZodTupleItems = [ZodTypeAny, ...ZodTypeAny[]];
declare type AssertArray<T> = T extends any[] ? T : never;
declare type OutputTypeOfTuple<T extends ZodTupleItems | []> = AssertArray<{
    [k in keyof T]: T[k] extends ZodType<any, any> ? T[k]["_output"] : never;
}>;
declare type OutputTypeOfTupleWithRest<T extends ZodTupleItems | [], Rest extends ZodTypeAny | null = null> = Rest extends ZodTypeAny ? [...OutputTypeOfTuple<T>, ...Rest["_output"][]] : OutputTypeOfTuple<T>;
declare type InputTypeOfTuple<T extends ZodTupleItems | []> = AssertArray<{
    [k in keyof T]: T[k] extends ZodType<any, any> ? T[k]["_input"] : never;
}>;
declare type InputTypeOfTupleWithRest<T extends ZodTupleItems | [], Rest extends ZodTypeAny | null = null> = Rest extends ZodTypeAny ? [...InputTypeOfTuple<T>, ...Rest["_input"][]] : InputTypeOfTuple<T>;
interface ZodTupleDef<T extends ZodTupleItems | [] = ZodTupleItems, Rest extends ZodTypeAny | null = null> extends ZodTypeDef {
    items: T;
    rest: Rest;
    typeName: ZodFirstPartyTypeKind.ZodTuple;
}
declare type AnyZodTuple = ZodTuple<[
    ZodTypeAny,
    ...ZodTypeAny[]
] | [], ZodTypeAny | null>;
declare class ZodTuple<T extends [ZodTypeAny, ...ZodTypeAny[]] | [] = [ZodTypeAny, ...ZodTypeAny[]], Rest extends ZodTypeAny | null = null> extends ZodType<OutputTypeOfTupleWithRest<T, Rest>, ZodTupleDef<T, Rest>, InputTypeOfTupleWithRest<T, Rest>> {
    _parse(input: ParseInput): ParseReturnType<this["_output"]>;
    get items(): T;
    rest<Rest extends ZodTypeAny>(rest: Rest): ZodTuple<T, Rest>;
    static create: <T_1 extends [] | [ZodTypeAny, ...ZodTypeAny[]]>(schemas: T_1, params?: RawCreateParams) => ZodTuple<T_1, null>;
}
interface ZodRecordDef<Key extends KeySchema = ZodString, Value extends ZodTypeAny = ZodTypeAny> extends ZodTypeDef {
    valueType: Value;
    keyType: Key;
    typeName: ZodFirstPartyTypeKind.ZodRecord;
}
declare type KeySchema = ZodType<string | number | symbol, any, any>;
declare type RecordType<K extends string | number | symbol, V> = [
    string
] extends [K] ? Record<K, V> : [number] extends [K] ? Record<K, V> : [symbol] extends [K] ? Record<K, V> : Partial<Record<K, V>>;
declare class ZodRecord<Key extends KeySchema = ZodString, Value extends ZodTypeAny = ZodTypeAny> extends ZodType<RecordType<Key["_output"], Value["_output"]>, ZodRecordDef<Key, Value>, RecordType<Key["_input"], Value["_input"]>> {
    get keySchema(): Key;
    get valueSchema(): Value;
    _parse(input: ParseInput): ParseReturnType<this["_output"]>;
    get element(): Value;
    static create<Value extends ZodTypeAny>(valueType: Value, params?: RawCreateParams): ZodRecord<ZodString, Value>;
    static create<Keys extends KeySchema, Value extends ZodTypeAny>(keySchema: Keys, valueType: Value, params?: RawCreateParams): ZodRecord<Keys, Value>;
}
interface ZodMapDef<Key extends ZodTypeAny = ZodTypeAny, Value extends ZodTypeAny = ZodTypeAny> extends ZodTypeDef {
    valueType: Value;
    keyType: Key;
    typeName: ZodFirstPartyTypeKind.ZodMap;
}
declare class ZodMap<Key extends ZodTypeAny = ZodTypeAny, Value extends ZodTypeAny = ZodTypeAny> extends ZodType<Map<Key["_output"], Value["_output"]>, ZodMapDef<Key, Value>, Map<Key["_input"], Value["_input"]>> {
    _parse(input: ParseInput): ParseReturnType<this["_output"]>;
    static create: <Key_1 extends ZodTypeAny = ZodTypeAny, Value_1 extends ZodTypeAny = ZodTypeAny>(keyType: Key_1, valueType: Value_1, params?: RawCreateParams) => ZodMap<Key_1, Value_1>;
}
interface ZodSetDef<Value extends ZodTypeAny = ZodTypeAny> extends ZodTypeDef {
    valueType: Value;
    typeName: ZodFirstPartyTypeKind.ZodSet;
    minSize: {
        value: number;
        message?: string;
    } | null;
    maxSize: {
        value: number;
        message?: string;
    } | null;
}
declare class ZodSet<Value extends ZodTypeAny = ZodTypeAny> extends ZodType<Set<Value["_output"]>, ZodSetDef<Value>, Set<Value["_input"]>> {
    _parse(input: ParseInput): ParseReturnType<this["_output"]>;
    min(minSize: number, message?: errorUtil.ErrMessage): this;
    max(maxSize: number, message?: errorUtil.ErrMessage): this;
    size(size: number, message?: errorUtil.ErrMessage): this;
    nonempty(message?: errorUtil.ErrMessage): ZodSet<Value>;
    static create: <Value_1 extends ZodTypeAny = ZodTypeAny>(valueType: Value_1, params?: RawCreateParams) => ZodSet<Value_1>;
}
interface ZodFunctionDef<Args extends ZodTuple<any, any> = ZodTuple<any, any>, Returns extends ZodTypeAny = ZodTypeAny> extends ZodTypeDef {
    args: Args;
    returns: Returns;
    typeName: ZodFirstPartyTypeKind.ZodFunction;
}
declare type OuterTypeOfFunction<Args extends ZodTuple<any, any>, Returns extends ZodTypeAny> = Args["_input"] extends Array<any> ? (...args: Args["_input"]) => Returns["_output"] : never;
declare type InnerTypeOfFunction<Args extends ZodTuple<any, any>, Returns extends ZodTypeAny> = Args["_output"] extends Array<any> ? (...args: Args["_output"]) => Returns["_input"] : never;
declare class ZodFunction<Args extends ZodTuple<any, any>, Returns extends ZodTypeAny> extends ZodType<OuterTypeOfFunction<Args, Returns>, ZodFunctionDef<Args, Returns>, InnerTypeOfFunction<Args, Returns>> {
    _parse(input: ParseInput): ParseReturnType<any>;
    parameters(): Args;
    returnType(): Returns;
    args<Items extends Parameters<typeof ZodTuple["create"]>[0]>(...items: Items): ZodFunction<ZodTuple<Items, ZodUnknown>, Returns>;
    returns<NewReturnType extends ZodType<any, any>>(returnType: NewReturnType): ZodFunction<Args, NewReturnType>;
    implement<F extends InnerTypeOfFunction<Args, Returns>>(func: F): ReturnType<F> extends Returns["_output"] ? (...args: Args["_input"]) => ReturnType<F> : OuterTypeOfFunction<Args, Returns>;
    strictImplement(func: InnerTypeOfFunction<Args, Returns>): InnerTypeOfFunction<Args, Returns>;
    validate: <F extends InnerTypeOfFunction<Args, Returns>>(func: F) => ReturnType<F> extends Returns["_output"] ? (...args: Args["_input"]) => ReturnType<F> : OuterTypeOfFunction<Args, Returns>;
    static create(): ZodFunction<ZodTuple<[], ZodUnknown>, ZodUnknown>;
    static create<T extends AnyZodTuple = ZodTuple<[], ZodUnknown>>(args: T): ZodFunction<T, ZodUnknown>;
    static create<T extends AnyZodTuple, U extends ZodTypeAny>(args: T, returns: U): ZodFunction<T, U>;
    static create<T extends AnyZodTuple = ZodTuple<[], ZodUnknown>, U extends ZodTypeAny = ZodUnknown>(args: T, returns: U, params?: RawCreateParams): ZodFunction<T, U>;
}
interface ZodLazyDef<T extends ZodTypeAny = ZodTypeAny> extends ZodTypeDef {
    getter: () => T;
    typeName: ZodFirstPartyTypeKind.ZodLazy;
}
declare class ZodLazy<T extends ZodTypeAny> extends ZodType<output<T>, ZodLazyDef<T>, input<T>> {
    get schema(): T;
    _parse(input: ParseInput): ParseReturnType<this["_output"]>;
    static create: <T_1 extends ZodTypeAny>(getter: () => T_1, params?: RawCreateParams) => ZodLazy<T_1>;
}
interface ZodLiteralDef<T = any> extends ZodTypeDef {
    value: T;
    typeName: ZodFirstPartyTypeKind.ZodLiteral;
}
declare class ZodLiteral<T> extends ZodType<T, ZodLiteralDef<T>> {
    _parse(input: ParseInput): ParseReturnType<this["_output"]>;
    get value(): T;
    static create: <T_1 extends Primitive>(value: T_1, params?: RawCreateParams) => ZodLiteral<T_1>;
}
declare type ArrayKeys = keyof any[];
declare type Indices<T> = Exclude<keyof T, ArrayKeys>;
declare type EnumValues = [string, ...string[]];
declare type Values<T extends EnumValues> = {
    [k in T[number]]: k;
};
interface ZodEnumDef<T extends EnumValues = EnumValues> extends ZodTypeDef {
    values: T;
    typeName: ZodFirstPartyTypeKind.ZodEnum;
}
declare type Writeable<T> = {
    -readonly [P in keyof T]: T[P];
};
declare type FilterEnum<Values, ToExclude> = Values extends [] ? [] : Values extends [infer Head, ...infer Rest] ? Head extends ToExclude ? FilterEnum<Rest, ToExclude> : [Head, ...FilterEnum<Rest, ToExclude>] : never;
declare type typecast<A, T> = A extends T ? A : never;
declare function createZodEnum<U extends string, T extends Readonly<[U, ...U[]]>>(values: T, params?: RawCreateParams): ZodEnum<Writeable<T>>;
declare function createZodEnum<U extends string, T extends [U, ...U[]]>(values: T, params?: RawCreateParams): ZodEnum<T>;
declare class ZodEnum<T extends [string, ...string[]]> extends ZodType<T[number], ZodEnumDef<T>> {
    _parse(input: ParseInput): ParseReturnType<this["_output"]>;
    get options(): T;
    get enum(): Values<T>;
    get Values(): Values<T>;
    get Enum(): Values<T>;
    extract<ToExtract extends readonly [T[number], ...T[number][]]>(values: ToExtract): ZodEnum<Writeable<ToExtract>>;
    exclude<ToExclude extends readonly [T[number], ...T[number][]]>(values: ToExclude): ZodEnum<typecast<Writeable<FilterEnum<T, ToExclude[number]>>, [string, ...string[]]>>;
    static create: typeof createZodEnum;
}
interface ZodNativeEnumDef<T extends EnumLike = EnumLike> extends ZodTypeDef {
    values: T;
    typeName: ZodFirstPartyTypeKind.ZodNativeEnum;
}
declare type EnumLike = {
    [k: string]: string | number;
    [nu: number]: string;
};
declare class ZodNativeEnum<T extends EnumLike> extends ZodType<T[keyof T], ZodNativeEnumDef<T>> {
    _parse(input: ParseInput): ParseReturnType<T[keyof T]>;
    get enum(): T;
    static create: <T_1 extends EnumLike>(values: T_1, params?: RawCreateParams) => ZodNativeEnum<T_1>;
}
interface ZodPromiseDef<T extends ZodTypeAny = ZodTypeAny> extends ZodTypeDef {
    type: T;
    typeName: ZodFirstPartyTypeKind.ZodPromise;
}
declare class ZodPromise<T extends ZodTypeAny> extends ZodType<Promise<T["_output"]>, ZodPromiseDef<T>, Promise<T["_input"]>> {
    unwrap(): T;
    _parse(input: ParseInput): ParseReturnType<this["_output"]>;
    static create: <T_1 extends ZodTypeAny>(schema: T_1, params?: RawCreateParams) => ZodPromise<T_1>;
}
declare type Refinement<T> = (arg: T, ctx: RefinementCtx) => any;
declare type SuperRefinement<T> = (arg: T, ctx: RefinementCtx) => void;
declare type RefinementEffect<T> = {
    type: "refinement";
    refinement: (arg: T, ctx: RefinementCtx) => any;
};
declare type TransformEffect<T> = {
    type: "transform";
    transform: (arg: T, ctx: RefinementCtx) => any;
};
declare type PreprocessEffect<T> = {
    type: "preprocess";
    transform: (arg: T) => any;
};
declare type Effect<T> = RefinementEffect<T> | TransformEffect<T> | PreprocessEffect<T>;
interface ZodEffectsDef<T extends ZodTypeAny = ZodTypeAny> extends ZodTypeDef {
    schema: T;
    typeName: ZodFirstPartyTypeKind.ZodEffects;
    effect: Effect<any>;
}
declare class ZodEffects<T extends ZodTypeAny, Output = output<T>, Input = input<T>> extends ZodType<Output, ZodEffectsDef<T>, Input> {
    innerType(): T;
    sourceType(): T;
    _parse(input: ParseInput): ParseReturnType<this["_output"]>;
    static create: <I extends ZodTypeAny>(schema: I, effect: Effect<I["_output"]>, params?: RawCreateParams) => ZodEffects<I, I["_output"], input<I>>;
    static createWithPreprocess: <I extends ZodTypeAny>(preprocess: (arg: unknown) => unknown, schema: I, params?: RawCreateParams) => ZodEffects<I, I["_output"], unknown>;
}

interface ZodOptionalDef<T extends ZodTypeAny = ZodTypeAny> extends ZodTypeDef {
    innerType: T;
    typeName: ZodFirstPartyTypeKind.ZodOptional;
}
declare type ZodOptionalType<T extends ZodTypeAny> = ZodOptional<T>;
declare class ZodOptional<T extends ZodTypeAny> extends ZodType<T["_output"] | undefined, ZodOptionalDef<T>, T["_input"] | undefined> {
    _parse(input: ParseInput): ParseReturnType<this["_output"]>;
    unwrap(): T;
    static create: <T_1 extends ZodTypeAny>(type: T_1, params?: RawCreateParams) => ZodOptional<T_1>;
}
interface ZodNullableDef<T extends ZodTypeAny = ZodTypeAny> extends ZodTypeDef {
    innerType: T;
    typeName: ZodFirstPartyTypeKind.ZodNullable;
}
declare type ZodNullableType<T extends ZodTypeAny> = ZodNullable<T>;
declare class ZodNullable<T extends ZodTypeAny> extends ZodType<T["_output"] | null, ZodNullableDef<T>, T["_input"] | null> {
    _parse(input: ParseInput): ParseReturnType<this["_output"]>;
    unwrap(): T;
    static create: <T_1 extends ZodTypeAny>(type: T_1, params?: RawCreateParams) => ZodNullable<T_1>;
}
interface ZodDefaultDef<T extends ZodTypeAny = ZodTypeAny> extends ZodTypeDef {
    innerType: T;
    defaultValue: () => util.noUndefined<T["_input"]>;
    typeName: ZodFirstPartyTypeKind.ZodDefault;
}
declare class ZodDefault<T extends ZodTypeAny> extends ZodType<util.noUndefined<T["_output"]>, ZodDefaultDef<T>, T["_input"] | undefined> {
    _parse(input: ParseInput): ParseReturnType<this["_output"]>;
    removeDefault(): T;
    static create: <T_1 extends ZodTypeAny>(type: T_1, params: {
        errorMap?: ZodErrorMap | undefined;
        invalid_type_error?: string | undefined;
        required_error?: string | undefined;
        description?: string | undefined;
    } & {
        default: T_1["_input"] | (() => util.noUndefined<T_1["_input"]>);
    }) => ZodDefault<T_1>;
}
interface ZodCatchDef<T extends ZodTypeAny = ZodTypeAny, C extends T["_input"] = T["_input"]> extends ZodTypeDef {
    innerType: T;
    catchValue: () => C;
    typeName: ZodFirstPartyTypeKind.ZodCatch;
}
declare class ZodCatch<T extends ZodTypeAny> extends ZodType<T["_output"], ZodCatchDef<T>, unknown> {
    _parse(input: ParseInput): ParseReturnType<this["_output"]>;
    removeCatch(): T;
    static create: <T_1 extends ZodTypeAny>(type: T_1, params: {
        errorMap?: ZodErrorMap | undefined;
        invalid_type_error?: string | undefined;
        required_error?: string | undefined;
        description?: string | undefined;
    } & {
        catch: T_1["_output"] | (() => T_1["_output"]);
    }) => ZodCatch<T_1>;
}
interface ZodNaNDef extends ZodTypeDef {
    typeName: ZodFirstPartyTypeKind.ZodNaN;
}
declare class ZodNaN extends ZodType<number, ZodNaNDef> {
    _parse(input: ParseInput): ParseReturnType<any>;
    static create: (params?: RawCreateParams) => ZodNaN;
}
interface ZodBrandedDef<T extends ZodTypeAny> extends ZodTypeDef {
    type: T;
    typeName: ZodFirstPartyTypeKind.ZodBranded;
}
declare const BRAND: unique symbol;
declare type BRAND<T extends string | number | symbol> = {
    [BRAND]: {
        [k in T]: true;
    };
};
declare class ZodBranded<T extends ZodTypeAny, B extends string | number | symbol> extends ZodType<T["_output"] & BRAND<B>, ZodBrandedDef<T>, T["_input"]> {
    _parse(input: ParseInput): ParseReturnType<any>;
    unwrap(): T;
}
interface ZodPipelineDef<A extends ZodTypeAny, B extends ZodTypeAny> extends ZodTypeDef {
    in: A;
    out: B;
    typeName: ZodFirstPartyTypeKind.ZodPipeline;
}
declare class ZodPipeline<A extends ZodTypeAny, B extends ZodTypeAny> extends ZodType<B["_output"], ZodPipelineDef<A, B>, A["_input"]> {
    _parse(input: ParseInput): ParseReturnType<any>;
    static create<A extends ZodTypeAny, B extends ZodTypeAny>(a: A, b: B): ZodPipeline<A, B>;
}
declare const custom: <T>(check?: ((data: unknown) => any) | undefined, params?: Parameters<ZodTypeAny["refine"]>[1], fatal?: boolean | undefined) => ZodType<T, ZodTypeDef, T>;

declare const late: {
    object: <T extends ZodRawShape>(shape: () => T, params?: RawCreateParams) => ZodObject<T, "strip", ZodTypeAny, { [k in keyof baseObjectOutputType<T>]: baseObjectOutputType<T>[k]; }, { [k_2 in keyof objectUtil.addQuestionMarks<{ [k_1 in keyof T]: T[k_1]["_input"]; }>]: objectUtil.addQuestionMarks<{ [k_1 in keyof T]: T[k_1]["_input"]; }>[k_2]; }>;
};
declare enum ZodFirstPartyTypeKind {
    ZodString = "ZodString",
    ZodNumber = "ZodNumber",
    ZodNaN = "ZodNaN",
    ZodBigInt = "ZodBigInt",
    ZodBoolean = "ZodBoolean",
    ZodDate = "ZodDate",
    ZodSymbol = "ZodSymbol",
    ZodUndefined = "ZodUndefined",
    ZodNull = "ZodNull",
    ZodAny = "ZodAny",
    ZodUnknown = "ZodUnknown",
    ZodNever = "ZodNever",
    ZodVoid = "ZodVoid",
    ZodArray = "ZodArray",
    ZodObject = "ZodObject",
    ZodUnion = "ZodUnion",
    ZodDiscriminatedUnion = "ZodDiscriminatedUnion",
    ZodIntersection = "ZodIntersection",
    ZodTuple = "ZodTuple",
    ZodRecord = "ZodRecord",
    ZodMap = "ZodMap",
    ZodSet = "ZodSet",
    ZodFunction = "ZodFunction",
    ZodLazy = "ZodLazy",
    ZodLiteral = "ZodLiteral",
    ZodEnum = "ZodEnum",
    ZodEffects = "ZodEffects",
    ZodNativeEnum = "ZodNativeEnum",
    ZodOptional = "ZodOptional",
    ZodNullable = "ZodNullable",
    ZodDefault = "ZodDefault",
    ZodCatch = "ZodCatch",
    ZodPromise = "ZodPromise",
    ZodBranded = "ZodBranded",
    ZodPipeline = "ZodPipeline"
}
declare type ZodFirstPartySchemaTypes = ZodString | ZodNumber | ZodNaN | ZodBigInt | ZodBoolean | ZodDate | ZodUndefined | ZodNull | ZodAny | ZodUnknown | ZodNever | ZodVoid | ZodArray<any, any> | ZodObject<any, any, any> | ZodUnion<any> | ZodDiscriminatedUnion<any, any> | ZodIntersection<any, any> | ZodTuple<any, any> | ZodRecord<any, any> | ZodMap<any> | ZodSet<any> | ZodFunction<any, any> | ZodLazy<any> | ZodLiteral<any> | ZodEnum<any> | ZodEffects<any, any, any> | ZodNativeEnum<any> | ZodOptional<any> | ZodNullable<any> | ZodDefault<any> | ZodCatch<any> | ZodPromise<any> | ZodBranded<any, any> | ZodPipeline<any, any>;
declare abstract class Class {
    constructor(..._: any[]);
}
declare const instanceOfType: <T extends typeof Class>(cls: T, params?: Parameters<ZodTypeAny["refine"]>[1]) => ZodType<InstanceType<T>, ZodTypeDef, InstanceType<T>>;
declare const stringType: (params?: ({
    errorMap?: ZodErrorMap | undefined;
    invalid_type_error?: string | undefined;
    required_error?: string | undefined;
    description?: string | undefined;
} & {
    coerce?: true | undefined;
}) | undefined) => ZodString;
declare const numberType: (params?: ({
    errorMap?: ZodErrorMap | undefined;
    invalid_type_error?: string | undefined;
    required_error?: string | undefined;
    description?: string | undefined;
} & {
    coerce?: boolean | undefined;
}) | undefined) => ZodNumber;
declare const nanType: (params?: RawCreateParams) => ZodNaN;
declare const bigIntType: (params?: ({
    errorMap?: ZodErrorMap | undefined;
    invalid_type_error?: string | undefined;
    required_error?: string | undefined;
    description?: string | undefined;
} & {
    coerce?: boolean | undefined;
}) | undefined) => ZodBigInt;
declare const booleanType: (params?: ({
    errorMap?: ZodErrorMap | undefined;
    invalid_type_error?: string | undefined;
    required_error?: string | undefined;
    description?: string | undefined;
} & {
    coerce?: boolean | undefined;
}) | undefined) => ZodBoolean;
declare const dateType: (params?: ({
    errorMap?: ZodErrorMap | undefined;
    invalid_type_error?: string | undefined;
    required_error?: string | undefined;
    description?: string | undefined;
} & {
    coerce?: boolean | undefined;
}) | undefined) => ZodDate;
declare const symbolType: (params?: RawCreateParams) => ZodSymbol;
declare const undefinedType: (params?: RawCreateParams) => ZodUndefined;
declare const nullType: (params?: RawCreateParams) => ZodNull;
declare const anyType: (params?: RawCreateParams) => ZodAny;
declare const unknownType: (params?: RawCreateParams) => ZodUnknown;
declare const neverType: (params?: RawCreateParams) => ZodNever;
declare const voidType: (params?: RawCreateParams) => ZodVoid;
declare const arrayType: <T extends ZodTypeAny>(schema: T, params?: RawCreateParams) => ZodArray<T, "many">;
declare const objectType: <T extends ZodRawShape>(shape: T, params?: RawCreateParams) => ZodObject<T, "strip", ZodTypeAny, { [k in keyof baseObjectOutputType<T>]: baseObjectOutputType<T>[k]; }, { [k_2 in keyof objectUtil.addQuestionMarks<{ [k_1 in keyof T]: T[k_1]["_input"]; }>]: objectUtil.addQuestionMarks<{ [k_1 in keyof T]: T[k_1]["_input"]; }>[k_2]; }>;
declare const strictObjectType: <T extends ZodRawShape>(shape: T, params?: RawCreateParams) => ZodObject<T, "strict", ZodTypeAny, { [k in keyof baseObjectOutputType<T>]: baseObjectOutputType<T>[k]; }, { [k_2 in keyof objectUtil.addQuestionMarks<{ [k_1 in keyof T]: T[k_1]["_input"]; }>]: objectUtil.addQuestionMarks<{ [k_1 in keyof T]: T[k_1]["_input"]; }>[k_2]; }>;
declare const unionType: <T extends readonly [ZodTypeAny, ZodTypeAny, ...ZodTypeAny[]]>(types: T, params?: RawCreateParams) => ZodUnion<T>;
declare const discriminatedUnionType: typeof ZodDiscriminatedUnion.create;
declare const intersectionType: <T extends ZodTypeAny, U extends ZodTypeAny>(left: T, right: U, params?: RawCreateParams) => ZodIntersection<T, U>;
declare const tupleType: <T extends [] | [ZodTypeAny, ...ZodTypeAny[]]>(schemas: T, params?: RawCreateParams) => ZodTuple<T, null>;
declare const recordType: typeof ZodRecord.create;
declare const mapType: <Key extends ZodTypeAny = ZodTypeAny, Value extends ZodTypeAny = ZodTypeAny>(keyType: Key, valueType: Value, params?: RawCreateParams) => ZodMap<Key, Value>;
declare const setType: <Value extends ZodTypeAny = ZodTypeAny>(valueType: Value, params?: RawCreateParams) => ZodSet<Value>;
declare const functionType: typeof ZodFunction.create;
declare const lazyType: <T extends ZodTypeAny>(getter: () => T, params?: RawCreateParams) => ZodLazy<T>;
declare const literalType: <T extends Primitive>(value: T, params?: RawCreateParams) => ZodLiteral<T>;
declare const enumType: typeof createZodEnum;
declare const nativeEnumType: <T extends EnumLike>(values: T, params?: RawCreateParams) => ZodNativeEnum<T>;
declare const promiseType: <T extends ZodTypeAny>(schema: T, params?: RawCreateParams) => ZodPromise<T>;
declare const effectsType: <I extends ZodTypeAny>(schema: I, effect: Effect<I["_output"]>, params?: RawCreateParams) => ZodEffects<I, I["_output"], input<I>>;
declare const optionalType: <T extends ZodTypeAny>(type: T, params?: RawCreateParams) => ZodOptional<T>;
declare const nullableType: <T extends ZodTypeAny>(type: T, params?: RawCreateParams) => ZodNullable<T>;
declare const preprocessType: <I extends ZodTypeAny>(preprocess: (arg: unknown) => unknown, schema: I, params?: RawCreateParams) => ZodEffects<I, I["_output"], unknown>;
declare const pipelineType: typeof ZodPipeline.create;
declare const ostring: () => ZodOptional<ZodString>;
declare const onumber: () => ZodOptional<ZodNumber>;
declare const oboolean: () => ZodOptional<ZodBoolean>;
declare const coerce: {
    string: (params?: ({
        errorMap?: ZodErrorMap | undefined;
        invalid_type_error?: string | undefined;
        required_error?: string | undefined;
        description?: string | undefined;
    } & {
        coerce?: true | undefined;
    }) | undefined) => ZodString;
    number: (params?: ({
        errorMap?: ZodErrorMap | undefined;
        invalid_type_error?: string | undefined;
        required_error?: string | undefined;
        description?: string | undefined;
    } & {
        coerce?: boolean | undefined;
    }) | undefined) => ZodNumber;
    boolean: (params?: ({
        errorMap?: ZodErrorMap | undefined;
        invalid_type_error?: string | undefined;
        required_error?: string | undefined;
        description?: string | undefined;
    } & {
        coerce?: boolean | undefined;
    }) | undefined) => ZodBoolean;
    bigint: (params?: ({
        errorMap?: ZodErrorMap | undefined;
        invalid_type_error?: string | undefined;
        required_error?: string | undefined;
        description?: string | undefined;
    } & {
        coerce?: boolean | undefined;
    }) | undefined) => ZodBigInt;
    date: (params?: ({
        errorMap?: ZodErrorMap | undefined;
        invalid_type_error?: string | undefined;
        required_error?: string | undefined;
        description?: string | undefined;
    } & {
        coerce?: boolean | undefined;
    }) | undefined) => ZodDate;
};

declare const NEVER: never;

type mod_AnyZodObject = AnyZodObject;
type mod_AnyZodTuple = AnyZodTuple;
type mod_ArrayCardinality = ArrayCardinality;
type mod_ArrayKeys = ArrayKeys;
type mod_AssertArray<T> = AssertArray<T>;
type mod_AsyncParseReturnType<T> = AsyncParseReturnType<T>;
type mod_BRAND<T extends string | number | symbol> = BRAND<T>;
type mod_CustomErrorParams = CustomErrorParams;
declare const mod_DIRTY: typeof DIRTY;
type mod_DenormalizedError = DenormalizedError;
declare const mod_EMPTY_PATH: typeof EMPTY_PATH;
type mod_Effect<T> = Effect<T>;
type mod_EnumLike = EnumLike;
type mod_EnumValues = EnumValues;
type mod_ErrorMapCtx = ErrorMapCtx;
type mod_FilterEnum<Values, ToExclude> = FilterEnum<Values, ToExclude>;
declare const mod_INVALID: typeof INVALID;
type mod_Indices<T> = Indices<T>;
type mod_InnerTypeOfFunction<Args extends ZodTuple<any, any>, Returns extends ZodTypeAny> = InnerTypeOfFunction<Args, Returns>;
type mod_InputTypeOfTuple<T extends ZodTupleItems | []> = InputTypeOfTuple<T>;
type mod_InputTypeOfTupleWithRest<T extends ZodTupleItems | [], Rest extends ZodTypeAny | null = null> = InputTypeOfTupleWithRest<T, Rest>;
type mod_IssueData = IssueData;
type mod_KeySchema = KeySchema;
declare const mod_NEVER: typeof NEVER;
declare const mod_OK: typeof OK;
type mod_ObjectPair = ObjectPair;
type mod_OuterTypeOfFunction<Args extends ZodTuple<any, any>, Returns extends ZodTypeAny> = OuterTypeOfFunction<Args, Returns>;
type mod_OutputTypeOfTuple<T extends ZodTupleItems | []> = OutputTypeOfTuple<T>;
type mod_OutputTypeOfTupleWithRest<T extends ZodTupleItems | [], Rest extends ZodTypeAny | null = null> = OutputTypeOfTupleWithRest<T, Rest>;
type mod_ParseContext = ParseContext;
type mod_ParseInput = ParseInput;
type mod_ParseParams = ParseParams;
type mod_ParsePath = ParsePath;
type mod_ParsePathComponent = ParsePathComponent;
type mod_ParseResult = ParseResult;
type mod_ParseReturnType<T> = ParseReturnType<T>;
type mod_ParseStatus = ParseStatus;
declare const mod_ParseStatus: typeof ParseStatus;
type mod_PreprocessEffect<T> = PreprocessEffect<T>;
type mod_Primitive = Primitive;
type mod_ProcessedCreateParams = ProcessedCreateParams;
type mod_RawCreateParams = RawCreateParams;
type mod_RecordType<K extends string | number | symbol, V> = RecordType<K, V>;
type mod_Refinement<T> = Refinement<T>;
type mod_RefinementCtx = RefinementCtx;
type mod_RefinementEffect<T> = RefinementEffect<T>;
type mod_SafeParseError<Input> = SafeParseError<Input>;
type mod_SafeParseReturnType<Input, Output> = SafeParseReturnType<Input, Output>;
type mod_SafeParseSuccess<Output> = SafeParseSuccess<Output>;
type mod_Scalars = Scalars;
type mod_SomeZodObject = SomeZodObject;
type mod_StringValidation = StringValidation;
type mod_SuperRefinement<T> = SuperRefinement<T>;
type mod_SyncParseReturnType<T = any> = SyncParseReturnType<T>;
type mod_TransformEffect<T> = TransformEffect<T>;
type mod_TypeOf<T extends ZodType<any, any, any>> = TypeOf<T>;
type mod_UnknownKeysParam = UnknownKeysParam;
type mod_Values<T extends EnumValues> = Values<T>;
type mod_Writeable<T> = Writeable<T>;
type mod_ZodAny = ZodAny;
declare const mod_ZodAny: typeof ZodAny;
type mod_ZodAnyDef = ZodAnyDef;
type mod_ZodArray<T extends ZodTypeAny, Cardinality extends ArrayCardinality = "many"> = ZodArray<T, Cardinality>;
declare const mod_ZodArray: typeof ZodArray;
type mod_ZodArrayDef<T extends ZodTypeAny = ZodTypeAny> = ZodArrayDef<T>;
type mod_ZodBigInt = ZodBigInt;
declare const mod_ZodBigInt: typeof ZodBigInt;
type mod_ZodBigIntDef = ZodBigIntDef;
type mod_ZodBoolean = ZodBoolean;
declare const mod_ZodBoolean: typeof ZodBoolean;
type mod_ZodBooleanDef = ZodBooleanDef;
type mod_ZodBranded<T extends ZodTypeAny, B extends string | number | symbol> = ZodBranded<T, B>;
declare const mod_ZodBranded: typeof ZodBranded;
type mod_ZodBrandedDef<T extends ZodTypeAny> = ZodBrandedDef<T>;
type mod_ZodCatch<T extends ZodTypeAny> = ZodCatch<T>;
declare const mod_ZodCatch: typeof ZodCatch;
type mod_ZodCatchDef<T extends ZodTypeAny = ZodTypeAny, C extends T["_input"] = T["_input"]> = ZodCatchDef<T, C>;
type mod_ZodCustomIssue = ZodCustomIssue;
type mod_ZodDate = ZodDate;
declare const mod_ZodDate: typeof ZodDate;
type mod_ZodDateCheck = ZodDateCheck;
type mod_ZodDateDef = ZodDateDef;
type mod_ZodDefault<T extends ZodTypeAny> = ZodDefault<T>;
declare const mod_ZodDefault: typeof ZodDefault;
type mod_ZodDefaultDef<T extends ZodTypeAny = ZodTypeAny> = ZodDefaultDef<T>;
type mod_ZodDiscriminatedUnion<Discriminator extends string, Options extends ZodDiscriminatedUnionOption<Discriminator>[]> = ZodDiscriminatedUnion<Discriminator, Options>;
declare const mod_ZodDiscriminatedUnion: typeof ZodDiscriminatedUnion;
type mod_ZodDiscriminatedUnionDef<Discriminator extends string, Options extends ZodDiscriminatedUnionOption<string>[] = ZodDiscriminatedUnionOption<string>[]> = ZodDiscriminatedUnionDef<Discriminator, Options>;
type mod_ZodDiscriminatedUnionOption<Discriminator extends string> = ZodDiscriminatedUnionOption<Discriminator>;
type mod_ZodEffects<T extends ZodTypeAny, Output = output<T>, Input = input<T>> = ZodEffects<T, Output, Input>;
declare const mod_ZodEffects: typeof ZodEffects;
type mod_ZodEffectsDef<T extends ZodTypeAny = ZodTypeAny> = ZodEffectsDef<T>;
type mod_ZodEnum<T extends [string, ...string[]]> = ZodEnum<T>;
declare const mod_ZodEnum: typeof ZodEnum;
type mod_ZodEnumDef<T extends EnumValues = EnumValues> = ZodEnumDef<T>;
type mod_ZodError<T = any> = ZodError<T>;
declare const mod_ZodError: typeof ZodError;
type mod_ZodErrorMap = ZodErrorMap;
type mod_ZodFirstPartySchemaTypes = ZodFirstPartySchemaTypes;
type mod_ZodFirstPartyTypeKind = ZodFirstPartyTypeKind;
declare const mod_ZodFirstPartyTypeKind: typeof ZodFirstPartyTypeKind;
type mod_ZodFormattedError<T, U = string> = ZodFormattedError<T, U>;
type mod_ZodFunction<Args extends ZodTuple<any, any>, Returns extends ZodTypeAny> = ZodFunction<Args, Returns>;
declare const mod_ZodFunction: typeof ZodFunction;
type mod_ZodFunctionDef<Args extends ZodTuple<any, any> = ZodTuple<any, any>, Returns extends ZodTypeAny = ZodTypeAny> = ZodFunctionDef<Args, Returns>;
type mod_ZodIntersection<T extends ZodTypeAny, U extends ZodTypeAny> = ZodIntersection<T, U>;
declare const mod_ZodIntersection: typeof ZodIntersection;
type mod_ZodIntersectionDef<T extends ZodTypeAny = ZodTypeAny, U extends ZodTypeAny = ZodTypeAny> = ZodIntersectionDef<T, U>;
type mod_ZodInvalidArgumentsIssue = ZodInvalidArgumentsIssue;
type mod_ZodInvalidDateIssue = ZodInvalidDateIssue;
type mod_ZodInvalidEnumValueIssue = ZodInvalidEnumValueIssue;
type mod_ZodInvalidIntersectionTypesIssue = ZodInvalidIntersectionTypesIssue;
type mod_ZodInvalidLiteralIssue = ZodInvalidLiteralIssue;
type mod_ZodInvalidReturnTypeIssue = ZodInvalidReturnTypeIssue;
type mod_ZodInvalidStringIssue = ZodInvalidStringIssue;
type mod_ZodInvalidTypeIssue = ZodInvalidTypeIssue;
type mod_ZodInvalidUnionDiscriminatorIssue = ZodInvalidUnionDiscriminatorIssue;
type mod_ZodInvalidUnionIssue = ZodInvalidUnionIssue;
type mod_ZodIssue = ZodIssue;
type mod_ZodIssueBase = ZodIssueBase;
type mod_ZodIssueCode = ZodIssueCode;
type mod_ZodIssueOptionalMessage = ZodIssueOptionalMessage;
type mod_ZodLazy<T extends ZodTypeAny> = ZodLazy<T>;
declare const mod_ZodLazy: typeof ZodLazy;
type mod_ZodLazyDef<T extends ZodTypeAny = ZodTypeAny> = ZodLazyDef<T>;
type mod_ZodLiteral<T> = ZodLiteral<T>;
declare const mod_ZodLiteral: typeof ZodLiteral;
type mod_ZodLiteralDef<T = any> = ZodLiteralDef<T>;
type mod_ZodMap<Key extends ZodTypeAny = ZodTypeAny, Value extends ZodTypeAny = ZodTypeAny> = ZodMap<Key, Value>;
declare const mod_ZodMap: typeof ZodMap;
type mod_ZodMapDef<Key extends ZodTypeAny = ZodTypeAny, Value extends ZodTypeAny = ZodTypeAny> = ZodMapDef<Key, Value>;
type mod_ZodNaN = ZodNaN;
declare const mod_ZodNaN: typeof ZodNaN;
type mod_ZodNaNDef = ZodNaNDef;
type mod_ZodNativeEnum<T extends EnumLike> = ZodNativeEnum<T>;
declare const mod_ZodNativeEnum: typeof ZodNativeEnum;
type mod_ZodNativeEnumDef<T extends EnumLike = EnumLike> = ZodNativeEnumDef<T>;
type mod_ZodNever = ZodNever;
declare const mod_ZodNever: typeof ZodNever;
type mod_ZodNeverDef = ZodNeverDef;
type mod_ZodNonEmptyArray<T extends ZodTypeAny> = ZodNonEmptyArray<T>;
type mod_ZodNotFiniteIssue = ZodNotFiniteIssue;
type mod_ZodNotMultipleOfIssue = ZodNotMultipleOfIssue;
type mod_ZodNull = ZodNull;
declare const mod_ZodNull: typeof ZodNull;
type mod_ZodNullDef = ZodNullDef;
type mod_ZodNullable<T extends ZodTypeAny> = ZodNullable<T>;
declare const mod_ZodNullable: typeof ZodNullable;
type mod_ZodNullableDef<T extends ZodTypeAny = ZodTypeAny> = ZodNullableDef<T>;
type mod_ZodNullableType<T extends ZodTypeAny> = ZodNullableType<T>;
type mod_ZodNumber = ZodNumber;
declare const mod_ZodNumber: typeof ZodNumber;
type mod_ZodNumberCheck = ZodNumberCheck;
type mod_ZodNumberDef = ZodNumberDef;
type mod_ZodObject<T extends ZodRawShape, UnknownKeys extends UnknownKeysParam = UnknownKeysParam, Catchall extends ZodTypeAny = ZodTypeAny, Output = objectOutputType<T, Catchall>, Input = objectInputType<T, Catchall>> = ZodObject<T, UnknownKeys, Catchall, Output, Input>;
declare const mod_ZodObject: typeof ZodObject;
type mod_ZodObjectDef<T extends ZodRawShape = ZodRawShape, UnknownKeys extends UnknownKeysParam = UnknownKeysParam, Catchall extends ZodTypeAny = ZodTypeAny> = ZodObjectDef<T, UnknownKeys, Catchall>;
type mod_ZodOptional<T extends ZodTypeAny> = ZodOptional<T>;
declare const mod_ZodOptional: typeof ZodOptional;
type mod_ZodOptionalDef<T extends ZodTypeAny = ZodTypeAny> = ZodOptionalDef<T>;
type mod_ZodOptionalType<T extends ZodTypeAny> = ZodOptionalType<T>;
type mod_ZodParsedType = ZodParsedType;
type mod_ZodPipeline<A extends ZodTypeAny, B extends ZodTypeAny> = ZodPipeline<A, B>;
declare const mod_ZodPipeline: typeof ZodPipeline;
type mod_ZodPipelineDef<A extends ZodTypeAny, B extends ZodTypeAny> = ZodPipelineDef<A, B>;
type mod_ZodPromise<T extends ZodTypeAny> = ZodPromise<T>;
declare const mod_ZodPromise: typeof ZodPromise;
type mod_ZodPromiseDef<T extends ZodTypeAny = ZodTypeAny> = ZodPromiseDef<T>;
type mod_ZodRawShape = ZodRawShape;
type mod_ZodRecord<Key extends KeySchema = ZodString, Value extends ZodTypeAny = ZodTypeAny> = ZodRecord<Key, Value>;
declare const mod_ZodRecord: typeof ZodRecord;
type mod_ZodRecordDef<Key extends KeySchema = ZodString, Value extends ZodTypeAny = ZodTypeAny> = ZodRecordDef<Key, Value>;
type mod_ZodSet<Value extends ZodTypeAny = ZodTypeAny> = ZodSet<Value>;
declare const mod_ZodSet: typeof ZodSet;
type mod_ZodSetDef<Value extends ZodTypeAny = ZodTypeAny> = ZodSetDef<Value>;
type mod_ZodString = ZodString;
declare const mod_ZodString: typeof ZodString;
type mod_ZodStringCheck = ZodStringCheck;
type mod_ZodStringDef = ZodStringDef;
type mod_ZodSymbol = ZodSymbol;
declare const mod_ZodSymbol: typeof ZodSymbol;
type mod_ZodSymbolDef = ZodSymbolDef;
type mod_ZodTooBigIssue = ZodTooBigIssue;
type mod_ZodTooSmallIssue = ZodTooSmallIssue;
type mod_ZodTuple<T extends [ZodTypeAny, ...ZodTypeAny[]] | [] = [ZodTypeAny, ...ZodTypeAny[]], Rest extends ZodTypeAny | null = null> = ZodTuple<T, Rest>;
declare const mod_ZodTuple: typeof ZodTuple;
type mod_ZodTupleDef<T extends ZodTupleItems | [] = ZodTupleItems, Rest extends ZodTypeAny | null = null> = ZodTupleDef<T, Rest>;
type mod_ZodTupleItems = ZodTupleItems;
type mod_ZodType<Output = any, Def extends ZodTypeDef = ZodTypeDef, Input = Output> = ZodType<Output, Def, Input>;
declare const mod_ZodType: typeof ZodType;
type mod_ZodTypeAny = ZodTypeAny;
type mod_ZodTypeDef = ZodTypeDef;
type mod_ZodUndefined = ZodUndefined;
declare const mod_ZodUndefined: typeof ZodUndefined;
type mod_ZodUndefinedDef = ZodUndefinedDef;
type mod_ZodUnion<T extends ZodUnionOptions> = ZodUnion<T>;
declare const mod_ZodUnion: typeof ZodUnion;
type mod_ZodUnionDef<T extends ZodUnionOptions = Readonly<[
    ZodTypeAny,
    ZodTypeAny,
    ...ZodTypeAny[]
]>> = ZodUnionDef<T>;
type mod_ZodUnionOptions = ZodUnionOptions;
type mod_ZodUnknown = ZodUnknown;
declare const mod_ZodUnknown: typeof ZodUnknown;
type mod_ZodUnknownDef = ZodUnknownDef;
type mod_ZodUnrecognizedKeysIssue = ZodUnrecognizedKeysIssue;
type mod_ZodVoid = ZodVoid;
declare const mod_ZodVoid: typeof ZodVoid;
type mod_ZodVoidDef = ZodVoidDef;
declare const mod_addIssueToContext: typeof addIssueToContext;
type mod_arrayOutputType<T extends ZodTypeAny, Cardinality extends ArrayCardinality = "many"> = arrayOutputType<T, Cardinality>;
type mod_baseObjectInputType<Shape extends ZodRawShape> = baseObjectInputType<Shape>;
type mod_baseObjectOutputType<Shape extends ZodRawShape> = baseObjectOutputType<Shape>;
declare const mod_coerce: typeof coerce;
declare const mod_custom: typeof custom;
type mod_deoptional<T extends ZodTypeAny> = deoptional<T>;
type mod_extendShape<A, B> = extendShape<A, B>;
declare const mod_getErrorMap: typeof getErrorMap;
declare const mod_getParsedType: typeof getParsedType;
type mod_inferFlattenedErrors<T extends ZodType<any, any, any>, U = string> = inferFlattenedErrors<T, U>;
type mod_inferFormattedError<T extends ZodType<any, any, any>, U = string> = inferFormattedError<T, U>;
type mod_input<T extends ZodType<any, any, any>> = input<T>;
declare const mod_isAborted: typeof isAborted;
declare const mod_isAsync: typeof isAsync;
declare const mod_isDirty: typeof isDirty;
declare const mod_isValid: typeof isValid;
declare const mod_late: typeof late;
declare const mod_makeIssue: typeof makeIssue;
type mod_mergeTypes<A, B> = mergeTypes<A, B>;
type mod_noUnrecognized<Obj extends object, Shape extends object> = noUnrecognized<Obj, Shape>;
type mod_objectInputType<Shape extends ZodRawShape, Catchall extends ZodTypeAny> = objectInputType<Shape, Catchall>;
type mod_objectKeyMask<Obj> = objectKeyMask<Obj>;
type mod_objectOutputType<Shape extends ZodRawShape, Catchall extends ZodTypeAny> = objectOutputType<Shape, Catchall>;
import mod_objectUtil = objectUtil;
declare const mod_oboolean: typeof oboolean;
declare const mod_onumber: typeof onumber;
declare const mod_ostring: typeof ostring;
type mod_output<T extends ZodType<any, any, any>> = output<T>;
type mod_processType<T extends object> = processType<T>;
declare const mod_quotelessJson: typeof quotelessJson;
declare const mod_setErrorMap: typeof setErrorMap;
type mod_typeToFlattenedError<T, U = string> = typeToFlattenedError<T, U>;
type mod_typecast<A, T> = typecast<A, T>;
import mod_util = util;
declare namespace mod {
  export { mod_DIRTY as DIRTY, mod_EMPTY_PATH as EMPTY_PATH, mod_INVALID as INVALID, mod_NEVER as NEVER, mod_OK as OK, mod_ParseStatus as ParseStatus, ZodType as Schema, mod_ZodAny as ZodAny, mod_ZodArray as ZodArray, mod_ZodBigInt as ZodBigInt, mod_ZodBoolean as ZodBoolean, mod_ZodBranded as ZodBranded, mod_ZodCatch as ZodCatch, mod_ZodDate as ZodDate, mod_ZodDefault as ZodDefault, mod_ZodDiscriminatedUnion as ZodDiscriminatedUnion, mod_ZodEffects as ZodEffects, mod_ZodEnum as ZodEnum, mod_ZodError as ZodError, mod_ZodFirstPartyTypeKind as ZodFirstPartyTypeKind, mod_ZodFunction as ZodFunction, mod_ZodIntersection as ZodIntersection, mod_ZodLazy as ZodLazy, mod_ZodLiteral as ZodLiteral, mod_ZodMap as ZodMap, mod_ZodNaN as ZodNaN, mod_ZodNativeEnum as ZodNativeEnum, mod_ZodNever as ZodNever, mod_ZodNull as ZodNull, mod_ZodNullable as ZodNullable, mod_ZodNumber as ZodNumber, mod_ZodObject as ZodObject, mod_ZodOptional as ZodOptional, mod_ZodPipeline as ZodPipeline, mod_ZodPromise as ZodPromise, mod_ZodRecord as ZodRecord, ZodType as ZodSchema, mod_ZodSet as ZodSet, mod_ZodString as ZodString, mod_ZodSymbol as ZodSymbol, ZodEffects as ZodTransformer, mod_ZodTuple as ZodTuple, mod_ZodType as ZodType, mod_ZodUndefined as ZodUndefined, mod_ZodUnion as ZodUnion, mod_ZodUnknown as ZodUnknown, mod_ZodVoid as ZodVoid, mod_addIssueToContext as addIssueToContext, anyType as any, arrayType as array, bigIntType as bigint, booleanType as boolean, mod_coerce as coerce, mod_custom as custom, dateType as date, errorMap as defaultErrorMap, discriminatedUnionType as discriminatedUnion, effectsType as effect, enumType as enum, functionType as function, mod_getErrorMap as getErrorMap, mod_getParsedType as getParsedType, instanceOfType as instanceof, intersectionType as intersection, mod_isAborted as isAborted, mod_isAsync as isAsync, mod_isDirty as isDirty, mod_isValid as isValid, mod_late as late, lazyType as lazy, literalType as literal, mod_makeIssue as makeIssue, mapType as map, nanType as nan, nativeEnumType as nativeEnum, neverType as never, nullType as null, nullableType as nullable, numberType as number, objectType as object, mod_objectUtil as objectUtil, mod_oboolean as oboolean, mod_onumber as onumber, optionalType as optional, mod_ostring as ostring, pipelineType as pipeline, preprocessType as preprocess, promiseType as promise, mod_quotelessJson as quotelessJson, recordType as record, setType as set, mod_setErrorMap as setErrorMap, strictObjectType as strictObject, stringType as string, symbolType as symbol, effectsType as transformer, tupleType as tuple, undefinedType as undefined, unionType as union, unknownType as unknown, mod_util as util, voidType as void };
  export type { mod_AnyZodObject as AnyZodObject, mod_AnyZodTuple as AnyZodTuple, mod_ArrayCardinality as ArrayCardinality, mod_ArrayKeys as ArrayKeys, mod_AssertArray as AssertArray, mod_AsyncParseReturnType as AsyncParseReturnType, mod_BRAND as BRAND, mod_CustomErrorParams as CustomErrorParams, mod_DenormalizedError as DenormalizedError, mod_Effect as Effect, mod_EnumLike as EnumLike, mod_EnumValues as EnumValues, mod_ErrorMapCtx as ErrorMapCtx, mod_FilterEnum as FilterEnum, mod_Indices as Indices, mod_InnerTypeOfFunction as InnerTypeOfFunction, mod_InputTypeOfTuple as InputTypeOfTuple, mod_InputTypeOfTupleWithRest as InputTypeOfTupleWithRest, mod_IssueData as IssueData, mod_KeySchema as KeySchema, mod_ObjectPair as ObjectPair, mod_OuterTypeOfFunction as OuterTypeOfFunction, mod_OutputTypeOfTuple as OutputTypeOfTuple, mod_OutputTypeOfTupleWithRest as OutputTypeOfTupleWithRest, mod_ParseContext as ParseContext, mod_ParseInput as ParseInput, mod_ParseParams as ParseParams, mod_ParsePath as ParsePath, mod_ParsePathComponent as ParsePathComponent, mod_ParseResult as ParseResult, mod_ParseReturnType as ParseReturnType, mod_PreprocessEffect as PreprocessEffect, mod_Primitive as Primitive, mod_ProcessedCreateParams as ProcessedCreateParams, mod_RawCreateParams as RawCreateParams, mod_RecordType as RecordType, mod_Refinement as Refinement, mod_RefinementCtx as RefinementCtx, mod_RefinementEffect as RefinementEffect, mod_SafeParseError as SafeParseError, mod_SafeParseReturnType as SafeParseReturnType, mod_SafeParseSuccess as SafeParseSuccess, mod_Scalars as Scalars, mod_SomeZodObject as SomeZodObject, mod_StringValidation as StringValidation, mod_SuperRefinement as SuperRefinement, mod_SyncParseReturnType as SyncParseReturnType, mod_TransformEffect as TransformEffect, mod_TypeOf as TypeOf, mod_UnknownKeysParam as UnknownKeysParam, mod_Values as Values, mod_Writeable as Writeable, mod_ZodAnyDef as ZodAnyDef, mod_ZodArrayDef as ZodArrayDef, mod_ZodBigIntDef as ZodBigIntDef, mod_ZodBooleanDef as ZodBooleanDef, mod_ZodBrandedDef as ZodBrandedDef, mod_ZodCatchDef as ZodCatchDef, mod_ZodCustomIssue as ZodCustomIssue, mod_ZodDateCheck as ZodDateCheck, mod_ZodDateDef as ZodDateDef, mod_ZodDefaultDef as ZodDefaultDef, mod_ZodDiscriminatedUnionDef as ZodDiscriminatedUnionDef, mod_ZodDiscriminatedUnionOption as ZodDiscriminatedUnionOption, mod_ZodEffectsDef as ZodEffectsDef, mod_ZodEnumDef as ZodEnumDef, mod_ZodErrorMap as ZodErrorMap, mod_ZodFirstPartySchemaTypes as ZodFirstPartySchemaTypes, mod_ZodFormattedError as ZodFormattedError, mod_ZodFunctionDef as ZodFunctionDef, mod_ZodIntersectionDef as ZodIntersectionDef, mod_ZodInvalidArgumentsIssue as ZodInvalidArgumentsIssue, mod_ZodInvalidDateIssue as ZodInvalidDateIssue, mod_ZodInvalidEnumValueIssue as ZodInvalidEnumValueIssue, mod_ZodInvalidIntersectionTypesIssue as ZodInvalidIntersectionTypesIssue, mod_ZodInvalidLiteralIssue as ZodInvalidLiteralIssue, mod_ZodInvalidReturnTypeIssue as ZodInvalidReturnTypeIssue, mod_ZodInvalidStringIssue as ZodInvalidStringIssue, mod_ZodInvalidTypeIssue as ZodInvalidTypeIssue, mod_ZodInvalidUnionDiscriminatorIssue as ZodInvalidUnionDiscriminatorIssue, mod_ZodInvalidUnionIssue as ZodInvalidUnionIssue, mod_ZodIssue as ZodIssue, mod_ZodIssueBase as ZodIssueBase, mod_ZodIssueCode as ZodIssueCode, mod_ZodIssueOptionalMessage as ZodIssueOptionalMessage, mod_ZodLazyDef as ZodLazyDef, mod_ZodLiteralDef as ZodLiteralDef, mod_ZodMapDef as ZodMapDef, mod_ZodNaNDef as ZodNaNDef, mod_ZodNativeEnumDef as ZodNativeEnumDef, mod_ZodNeverDef as ZodNeverDef, mod_ZodNonEmptyArray as ZodNonEmptyArray, mod_ZodNotFiniteIssue as ZodNotFiniteIssue, mod_ZodNotMultipleOfIssue as ZodNotMultipleOfIssue, mod_ZodNullDef as ZodNullDef, mod_ZodNullableDef as ZodNullableDef, mod_ZodNullableType as ZodNullableType, mod_ZodNumberCheck as ZodNumberCheck, mod_ZodNumberDef as ZodNumberDef, mod_ZodObjectDef as ZodObjectDef, mod_ZodOptionalDef as ZodOptionalDef, mod_ZodOptionalType as ZodOptionalType, mod_ZodParsedType as ZodParsedType, mod_ZodPipelineDef as ZodPipelineDef, mod_ZodPromiseDef as ZodPromiseDef, mod_ZodRawShape as ZodRawShape, mod_ZodRecordDef as ZodRecordDef, mod_ZodSetDef as ZodSetDef, mod_ZodStringCheck as ZodStringCheck, mod_ZodStringDef as ZodStringDef, mod_ZodSymbolDef as ZodSymbolDef, mod_ZodTooBigIssue as ZodTooBigIssue, mod_ZodTooSmallIssue as ZodTooSmallIssue, mod_ZodTupleDef as ZodTupleDef, mod_ZodTupleItems as ZodTupleItems, mod_ZodTypeAny as ZodTypeAny, mod_ZodTypeDef as ZodTypeDef, mod_ZodUndefinedDef as ZodUndefinedDef, mod_ZodUnionDef as ZodUnionDef, mod_ZodUnionOptions as ZodUnionOptions, mod_ZodUnknownDef as ZodUnknownDef, mod_ZodUnrecognizedKeysIssue as ZodUnrecognizedKeysIssue, mod_ZodVoidDef as ZodVoidDef, mod_arrayOutputType as arrayOutputType, mod_baseObjectInputType as baseObjectInputType, mod_baseObjectOutputType as baseObjectOutputType, mod_deoptional as deoptional, mod_extendShape as extendShape, TypeOf as infer, mod_inferFlattenedErrors as inferFlattenedErrors, mod_inferFormattedError as inferFormattedError, mod_input as input, mod_mergeTypes as mergeTypes, mod_noUnrecognized as noUnrecognized, mod_objectInputType as objectInputType, mod_objectKeyMask as objectKeyMask, mod_objectOutputType as objectOutputType, mod_output as output, mod_processType as processType, mod_typeToFlattenedError as typeToFlattenedError, mod_typecast as typecast };
}

export { BRAND, DIRTY, EMPTY_PATH, INVALID, NEVER, OK, ParseStatus, ZodType as Schema, ZodAny, ZodArray, ZodBigInt, ZodBoolean, ZodBranded, ZodCatch, ZodDate, ZodDefault, ZodDiscriminatedUnion, ZodEffects, ZodEnum, ZodError, ZodFirstPartyTypeKind, ZodFunction, ZodIntersection, ZodIssueCode, ZodLazy, ZodLiteral, ZodMap, ZodNaN, ZodNativeEnum, ZodNever, ZodNull, ZodNullable, ZodNumber, ZodObject, ZodOptional, ZodParsedType, ZodPipeline, ZodPromise, ZodRecord, ZodType as ZodSchema, ZodSet, ZodString, ZodSymbol, ZodEffects as ZodTransformer, ZodTuple, ZodType, ZodUndefined, ZodUnion, ZodUnknown, ZodVoid, addIssueToContext, anyType as any, arrayType as array, bigIntType as bigint, booleanType as boolean, coerce, custom, dateType as date, errorMap as defaultErrorMap, discriminatedUnionType as discriminatedUnion, effectsType as effect, enumType as enum, functionType as function, getErrorMap, getParsedType, instanceOfType as instanceof, intersectionType as intersection, isAborted, isAsync, isDirty, isValid, late, lazyType as lazy, literalType as literal, makeIssue, mapType as map, nanType as nan, nativeEnumType as nativeEnum, neverType as never, nullType as null, nullableType as nullable, numberType as number, objectType as object, objectUtil, oboolean, onumber, optionalType as optional, ostring, pipelineType as pipeline, preprocessType as preprocess, promiseType as promise, quotelessJson, recordType as record, setType as set, setErrorMap, strictObjectType as strictObject, stringType as string, symbolType as symbol, effectsType as transformer, tupleType as tuple, undefinedType as undefined, unionType as union, unknownType as unknown, util, voidType as void, mod as z };
export type { AnyZodObject, AnyZodTuple, ArrayCardinality, ArrayKeys, AssertArray, AsyncParseReturnType, CustomErrorParams, DenormalizedError, Effect, EnumLike, EnumValues, ErrorMapCtx, FilterEnum, Indices, InnerTypeOfFunction, InputTypeOfTuple, InputTypeOfTupleWithRest, IssueData, KeySchema, ObjectPair, OuterTypeOfFunction, OutputTypeOfTuple, OutputTypeOfTupleWithRest, ParseContext, ParseInput, ParseParams, ParsePath, ParsePathComponent, ParseResult, ParseReturnType, PreprocessEffect, Primitive, ProcessedCreateParams, RawCreateParams, RecordType, Refinement, RefinementCtx, RefinementEffect, SafeParseError, SafeParseReturnType, SafeParseSuccess, Scalars, SomeZodObject, StringValidation, SuperRefinement, SyncParseReturnType, TransformEffect, TypeOf, UnknownKeysParam, Values, Writeable, ZodAnyDef, ZodArrayDef, ZodBigIntDef, ZodBooleanDef, ZodBrandedDef, ZodCatchDef, ZodCustomIssue, ZodDateCheck, ZodDateDef, ZodDefaultDef, ZodDiscriminatedUnionDef, ZodDiscriminatedUnionOption, ZodEffectsDef, ZodEnumDef, ZodErrorMap, ZodFirstPartySchemaTypes, ZodFormattedError, ZodFunctionDef, ZodIntersectionDef, ZodInvalidArgumentsIssue, ZodInvalidDateIssue, ZodInvalidEnumValueIssue, ZodInvalidIntersectionTypesIssue, ZodInvalidLiteralIssue, ZodInvalidReturnTypeIssue, ZodInvalidStringIssue, ZodInvalidTypeIssue, ZodInvalidUnionDiscriminatorIssue, ZodInvalidUnionIssue, ZodIssue, ZodIssueBase, ZodIssueOptionalMessage, ZodLazyDef, ZodLiteralDef, ZodMapDef, ZodNaNDef, ZodNativeEnumDef, ZodNeverDef, ZodNonEmptyArray, ZodNotFiniteIssue, ZodNotMultipleOfIssue, ZodNullDef, ZodNullableDef, ZodNullableType, ZodNumberCheck, ZodNumberDef, ZodObjectDef, ZodOptionalDef, ZodOptionalType, ZodPipelineDef, ZodPromiseDef, ZodRawShape, ZodRecordDef, ZodSetDef, ZodStringCheck, ZodStringDef, ZodSymbolDef, ZodTooBigIssue, ZodTooSmallIssue, ZodTupleDef, ZodTupleItems, ZodTypeAny, ZodTypeDef, ZodUndefinedDef, ZodUnionDef, ZodUnionOptions, ZodUnknownDef, ZodUnrecognizedKeysIssue, ZodVoidDef, arrayOutputType, baseObjectInputType, baseObjectOutputType, deoptional, extendShape, TypeOf as infer, inferFlattenedErrors, inferFormattedError, input, mergeTypes, noUnrecognized, objectInputType, objectKeyMask, objectOutputType, output, processType, typeToFlattenedError, typecast };
