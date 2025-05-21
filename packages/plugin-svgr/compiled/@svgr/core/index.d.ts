import { Options as Options$1 } from '@svgr/babel-preset';
import { TransformOptions } from '@babel/core';

// https://github.com/prettier/prettier/blob/next/src/document/public.js
declare namespace builders {
  type DocCommand =
    | Align
    | BreakParent
    | Cursor
    | Fill
    | Group
    | IfBreak
    | Indent
    | IndentIfBreak
    | Label
    | Line
    | LineSuffix
    | LineSuffixBoundary
    | Trim;
  type Doc = string | Doc[] | DocCommand;

  interface Align {
    type: "align";
    contents: Doc;
    n: number | string | { type: "root" };
  }

  interface BreakParent {
    type: "break-parent";
  }

  interface Cursor {
    type: "cursor";
    placeholder: symbol;
  }

  interface Fill {
    type: "fill";
    parts: Doc[];
  }

  interface Group {
    type: "group";
    id?: symbol;
    contents: Doc;
    break: boolean;
    expandedStates: Doc[];
  }

  interface HardlineWithoutBreakParent extends Line {
    hard: true;
  }

  interface IfBreak {
    type: "if-break";
    breakContents: Doc;
    flatContents: Doc;
  }

  interface Indent {
    type: "indent";
    contents: Doc;
  }

  interface IndentIfBreak {
    type: "indent-if-break";
  }

  interface Label {
    type: "label";
    label: any;
    contents: Doc;
  }

  interface Line {
    type: "line";
    soft?: boolean | undefined;
    hard?: boolean | undefined;
    literal?: boolean | undefined;
  }

  interface LineSuffix {
    type: "line-suffix";
    contents: Doc;
  }

  interface LineSuffixBoundary {
    type: "line-suffix-boundary";
  }

  interface LiterallineWithoutBreakParent extends Line {
    hard: true;
    literal: true;
  }

  type LiteralLine = [LiterallineWithoutBreakParent, BreakParent];

  interface Softline extends Line {
    soft: true;
  }

  type Hardline = [HardlineWithoutBreakParent, BreakParent];

  interface Trim {
    type: "trim";
  }

  interface GroupOptions {
    shouldBreak?: boolean | undefined;
    id?: symbol | undefined;
  }

  function addAlignmentToDoc(doc: Doc, size: number, tabWidth: number): Doc;

  /** @see [align](https://github.com/prettier/prettier/blob/main/commands.md#align) */
  function align(widthOrString: Align["n"], doc: Doc): Align;

  /** @see [breakParent](https://github.com/prettier/prettier/blob/main/commands.md#breakparent) */
  const breakParent: BreakParent;

  /** @see [conditionalGroup](https://github.com/prettier/prettier/blob/main/commands.md#conditionalgroup) */
  function conditionalGroup(alternatives: Doc[], options?: GroupOptions): Group;

  /** @see [dedent](https://github.com/prettier/prettier/blob/main/commands.md#dedent) */
  function dedent(doc: Doc): Align;

  /** @see [dedentToRoot](https://github.com/prettier/prettier/blob/main/commands.md#dedenttoroot) */
  function dedentToRoot(doc: Doc): Align;

  /** @see [fill](https://github.com/prettier/prettier/blob/main/commands.md#fill) */
  function fill(docs: Doc[]): Fill;

  /** @see [group](https://github.com/prettier/prettier/blob/main/commands.md#group) */
  function group(doc: Doc, opts?: GroupOptions): Group;

  /** @see [hardline](https://github.com/prettier/prettier/blob/main/commands.md#hardline) */
  const hardline: Hardline;

  /** @see [hardlineWithoutBreakParent](https://github.com/prettier/prettier/blob/main/commands.md#hardlinewithoutbreakparent-and-literallinewithoutbreakparent) */
  const hardlineWithoutBreakParent: HardlineWithoutBreakParent;

  /** @see [ifBreak](https://github.com/prettier/prettier/blob/main/commands.md#ifbreak) */
  function ifBreak(
    ifBreak: Doc,
    noBreak?: Doc,
    options?: { groupId?: symbol | undefined },
  ): IfBreak;

  /** @see [indent](https://github.com/prettier/prettier/blob/main/commands.md#indent) */
  function indent(doc: Doc): Indent;

  /** @see [indentIfBreak](https://github.com/prettier/prettier/blob/main/commands.md#indentifbreak) */
  function indentIfBreak(
    doc: Doc,
    opts: { groupId: symbol; negate?: boolean | undefined },
  ): IndentIfBreak;

  /** @see [join](https://github.com/prettier/prettier/blob/main/commands.md#join) */
  function join(sep: Doc, docs: Doc[]): Doc[];

  /** @see [label](https://github.com/prettier/prettier/blob/main/commands.md#label) */
  function label(label: any | undefined, contents: Doc): Doc;

  /** @see [line](https://github.com/prettier/prettier/blob/main/commands.md#line) */
  const line: Line;

  /** @see [lineSuffix](https://github.com/prettier/prettier/blob/main/commands.md#linesuffix) */
  function lineSuffix(suffix: Doc): LineSuffix;

  /** @see [lineSuffixBoundary](https://github.com/prettier/prettier/blob/main/commands.md#linesuffixboundary) */
  const lineSuffixBoundary: LineSuffixBoundary;

  /** @see [literalline](https://github.com/prettier/prettier/blob/main/commands.md#literalline) */
  const literalline: LiteralLine;

  /** @see [literallineWithoutBreakParent](https://github.com/prettier/prettier/blob/main/commands.md#hardlinewithoutbreakparent-and-literallinewithoutbreakparent) */
  const literallineWithoutBreakParent: LiterallineWithoutBreakParent;

  /** @see [markAsRoot](https://github.com/prettier/prettier/blob/main/commands.md#markasroot) */
  function markAsRoot(doc: Doc): Align;

  /** @see [softline](https://github.com/prettier/prettier/blob/main/commands.md#softline) */
  const softline: Softline;

  /** @see [trim](https://github.com/prettier/prettier/blob/main/commands.md#trim) */
  const trim: Trim;

  /** @see [cursor](https://github.com/prettier/prettier/blob/main/commands.md#cursor) */
  const cursor: Cursor;
}

declare namespace printer {
  function printDocToString(
    doc: builders.Doc,
    options: Options,
  ): {
    formatted: string;
    cursorNodeStart?: number | undefined;
    cursorNodeText?: string | undefined;
  };
  interface Options {
    /**
     * Specify the line length that the printer will wrap on.
     * @default 80
     */
    printWidth: number;
    /**
     * Specify the number of spaces per indentation-level.
     * @default 2
     */
    tabWidth: number;
    /**
     * Indent lines with tabs instead of spaces
     * @default false
     */
    useTabs?: boolean;
    parentParser?: string | undefined;
    __embeddedInHtml?: boolean | undefined;
  }
}

declare namespace utils {
  function willBreak(doc: builders.Doc): boolean;
  function traverseDoc(
    doc: builders.Doc,
    onEnter?: (doc: builders.Doc) => void | boolean,
    onExit?: (doc: builders.Doc) => void,
    shouldTraverseConditionalGroups?: boolean,
  ): void;
  function findInDoc<T = builders.Doc>(
    doc: builders.Doc,
    callback: (doc: builders.Doc) => T,
    defaultValue: T,
  ): T;
  function mapDoc<T = builders.Doc>(
    doc: builders.Doc,
    callback: (doc: builders.Doc) => T,
  ): T;
  function removeLines(doc: builders.Doc): builders.Doc;
  function stripTrailingHardline(doc: builders.Doc): builders.Doc;
  function replaceEndOfLine(
    doc: builders.Doc,
    replacement?: builders.Doc,
  ): builders.Doc;
  function canBreak(doc: builders.Doc): boolean;
}

// Copied from `@types/prettier`
// https://github.com/DefinitelyTyped/DefinitelyTyped/blob/5bb07fc4b087cb7ee91084afa6fe750551a7bbb1/types/prettier/index.d.ts



declare namespace doc {
  export { builders, printer, utils };
}

// This utility is here to handle the case where you have an explicit union
// between string literals and the generic string type. It would normally
// resolve out to just the string type, but this generic LiteralUnion maintains
// the intellisense of the original union.
//
// It comes from this issue: microsoft/TypeScript#29729:
//   https://github.com/microsoft/TypeScript/issues/29729#issuecomment-700527227
type LiteralUnion<T extends U, U = string> =
  | T
  | (Pick<U, never> & { _?: never | undefined });

type AST = any;
type Doc = doc.builders.Doc;

// The type of elements that make up the given array T.
type ArrayElement<T> = T extends Array<infer E> ? E : never;

// A union of the properties of the given object that are arrays.
type ArrayProperties<T> = {
  [K in keyof T]: NonNullable<T[K]> extends readonly any[] ? K : never;
}[keyof T];

// A union of the properties of the given array T that can be used to index it.
// If the array is a tuple, then that's going to be the explicit indices of the
// array, otherwise it's going to just be number.
type IndexProperties<T extends { length: number }> = IsTuple<T> extends true
  ? Exclude<Partial<T>["length"], T["length"]>
  : number;

// Effectively performing T[P], except that it's telling TypeScript that it's
// safe to do this for tuples, arrays, or objects.
type IndexValue<T, P> = T extends any[]
  ? P extends number
    ? T[P]
    : never
  : P extends keyof T
  ? T[P]
  : never;

// Determines if an object T is an array like string[] (in which case this
// evaluates to false) or a tuple like [string] (in which case this evaluates to
// true).
// eslint-disable-next-line @typescript-eslint/no-unused-vars
type IsTuple<T> = T extends []
  ? true
  : T extends [infer First, ...infer Remain]
  ? IsTuple<Remain>
  : false;

type CallProperties<T> = T extends any[] ? IndexProperties<T> : keyof T;
type IterProperties<T> = T extends any[]
  ? IndexProperties<T>
  : ArrayProperties<T>;

type CallCallback<T, U> = (path: AstPath<T>, index: number, value: any) => U;
type EachCallback<T> = (
  path: AstPath<ArrayElement<T>>,
  index: number,
  value: any,
) => void;
type MapCallback<T, U> = (
  path: AstPath<ArrayElement<T>>,
  index: number,
  value: any,
) => U;

// https://github.com/prettier/prettier/blob/next/src/common/ast-path.js
declare class AstPath<T = any> {
  constructor(value: T);

  get key(): string | null;
  get index(): number | null;
  get node(): T;
  get parent(): T | null;
  get grandparent(): T | null;
  get isInArray(): boolean;
  get siblings(): T[] | null;
  get next(): T | null;
  get previous(): T | null;
  get isFirst(): boolean;
  get isLast(): boolean;
  get isRoot(): boolean;
  get root(): T;
  get ancestors(): T[];

  stack: T[];

  callParent<U>(callback: (path: this) => U, count?: number): U;

  /**
   * @deprecated Please use `AstPath#key` or `AstPath#index`
   */
  getName(): PropertyKey | null;

  /**
   * @deprecated Please use `AstPath#node` or  `AstPath#siblings`
   */
  getValue(): T;

  getNode(count?: number): T | null;

  getParentNode(count?: number): T | null;

  match(
    ...predicates: Array<
      (node: any, name: string | null, number: number | null) => boolean
    >
  ): boolean;

  // For each of the tree walk functions (call, each, and map) this provides 5
  // strict type signatures, along with a fallback at the end if you end up
  // calling more than 5 properties deep. This helps a lot with typing because
  // for the majority of cases you're calling fewer than 5 properties, so the
  // tree walk functions have a clearer understanding of what you're doing.
  //
  // Note that resolving these types is somewhat complicated, and it wasn't
  // even supported until TypeScript 4.2 (before it would just say that the
  // type instantiation was excessively deep and possibly infinite).

  call<U>(callback: CallCallback<T, U>): U;
  call<U, P1 extends CallProperties<T>>(
    callback: CallCallback<IndexValue<T, P1>, U>,
    prop1: P1,
  ): U;
  call<U, P1 extends keyof T, P2 extends CallProperties<T[P1]>>(
    callback: CallCallback<IndexValue<IndexValue<T, P1>, P2>, U>,
    prop1: P1,
    prop2: P2,
  ): U;
  call<
    U,
    P1 extends keyof T,
    P2 extends CallProperties<T[P1]>,
    P3 extends CallProperties<IndexValue<T[P1], P2>>,
  >(
    callback: CallCallback<
      IndexValue<IndexValue<IndexValue<T, P1>, P2>, P3>,
      U
    >,
    prop1: P1,
    prop2: P2,
    prop3: P3,
  ): U;
  call<
    U,
    P1 extends keyof T,
    P2 extends CallProperties<T[P1]>,
    P3 extends CallProperties<IndexValue<T[P1], P2>>,
    P4 extends CallProperties<IndexValue<IndexValue<T[P1], P2>, P3>>,
  >(
    callback: CallCallback<
      IndexValue<IndexValue<IndexValue<IndexValue<T, P1>, P2>, P3>, P4>,
      U
    >,
    prop1: P1,
    prop2: P2,
    prop3: P3,
    prop4: P4,
  ): U;
  call<U, P extends PropertyKey>(
    callback: CallCallback<any, U>,
    prop1: P,
    prop2: P,
    prop3: P,
    prop4: P,
    ...props: P[]
  ): U;

  each(callback: EachCallback<T>): void;
  each<P1 extends IterProperties<T>>(
    callback: EachCallback<IndexValue<T, P1>>,
    prop1: P1,
  ): void;
  each<P1 extends keyof T, P2 extends IterProperties<T[P1]>>(
    callback: EachCallback<IndexValue<IndexValue<T, P1>, P2>>,
    prop1: P1,
    prop2: P2,
  ): void;
  each<
    P1 extends keyof T,
    P2 extends IterProperties<T[P1]>,
    P3 extends IterProperties<IndexValue<T[P1], P2>>,
  >(
    callback: EachCallback<IndexValue<IndexValue<IndexValue<T, P1>, P2>, P3>>,
    prop1: P1,
    prop2: P2,
    prop3: P3,
  ): void;
  each<
    P1 extends keyof T,
    P2 extends IterProperties<T[P1]>,
    P3 extends IterProperties<IndexValue<T[P1], P2>>,
    P4 extends IterProperties<IndexValue<IndexValue<T[P1], P2>, P3>>,
  >(
    callback: EachCallback<
      IndexValue<IndexValue<IndexValue<IndexValue<T, P1>, P2>, P3>, P4>
    >,
    prop1: P1,
    prop2: P2,
    prop3: P3,
    prop4: P4,
  ): void;
  each(
    callback: EachCallback<any[]>,
    prop1: PropertyKey,
    prop2: PropertyKey,
    prop3: PropertyKey,
    prop4: PropertyKey,
    ...props: PropertyKey[]
  ): void;

  map<U>(callback: MapCallback<T, U>): U[];
  map<U, P1 extends IterProperties<T>>(
    callback: MapCallback<IndexValue<T, P1>, U>,
    prop1: P1,
  ): U[];
  map<U, P1 extends keyof T, P2 extends IterProperties<T[P1]>>(
    callback: MapCallback<IndexValue<IndexValue<T, P1>, P2>, U>,
    prop1: P1,
    prop2: P2,
  ): U[];
  map<
    U,
    P1 extends keyof T,
    P2 extends IterProperties<T[P1]>,
    P3 extends IterProperties<IndexValue<T[P1], P2>>,
  >(
    callback: MapCallback<IndexValue<IndexValue<IndexValue<T, P1>, P2>, P3>, U>,
    prop1: P1,
    prop2: P2,
    prop3: P3,
  ): U[];
  map<
    U,
    P1 extends keyof T,
    P2 extends IterProperties<T[P1]>,
    P3 extends IterProperties<IndexValue<T[P1], P2>>,
    P4 extends IterProperties<IndexValue<IndexValue<T[P1], P2>, P3>>,
  >(
    callback: MapCallback<
      IndexValue<IndexValue<IndexValue<IndexValue<T, P1>, P2>, P3>, P4>,
      U
    >,
    prop1: P1,
    prop2: P2,
    prop3: P3,
    prop4: P4,
  ): U[];
  map<U>(
    callback: MapCallback<any[], U>,
    prop1: PropertyKey,
    prop2: PropertyKey,
    prop3: PropertyKey,
    prop4: PropertyKey,
    ...props: PropertyKey[]
  ): U[];
}
type BuiltInParserName =
  | "acorn"
  | "angular"
  | "babel-flow"
  | "babel-ts"
  | "babel"
  | "css"
  | "espree"
  | "flow"
  | "glimmer"
  | "graphql"
  | "html"
  | "json-stringify"
  | "json"
  | "json5"
  | "less"
  | "lwc"
  | "markdown"
  | "mdx"
  | "meriyah"
  | "scss"
  | "typescript"
  | "vue"
  | "yaml";

type CustomParser = (
  text: string,
  options: Options,
) => AST | Promise<AST>;

interface Options extends Partial<RequiredOptions> {}

interface RequiredOptions extends doc.printer.Options {
  /**
   * Print semicolons at the ends of statements.
   * @default true
   */
  semi: boolean;
  /**
   * Use single quotes instead of double quotes.
   * @default false
   */
  singleQuote: boolean;
  /**
   * Use single quotes in JSX.
   * @default false
   */
  jsxSingleQuote: boolean;
  /**
   * Print trailing commas wherever possible.
   * @default "all"
   */
  trailingComma: "none" | "es5" | "all";
  /**
   * Print spaces between brackets in object literals.
   * @default true
   */
  bracketSpacing: boolean;
  /**
   * Put the `>` of a multi-line HTML (HTML, JSX, Vue, Angular) element at the end of the last line instead of being
   * alone on the next line (does not apply to self closing elements).
   * @default false
   */
  bracketSameLine: boolean;
  /**
   * Put the `>` of a multi-line JSX element at the end of the last line instead of being alone on the next line.
   * @default false
   * @deprecated use bracketSameLine instead
   */
  jsxBracketSameLine: boolean;
  /**
   * Format only a segment of a file.
   * @default 0
   */
  rangeStart: number;
  /**
   * Format only a segment of a file.
   * @default Number.POSITIVE_INFINITY
   */
  rangeEnd: number;
  /**
   * Specify which parser to use.
   */
  parser: LiteralUnion<BuiltInParserName> | CustomParser;
  /**
   * Specify the input filepath. This will be used to do parser inference.
   */
  filepath: string;
  /**
   * Prettier can restrict itself to only format files that contain a special comment, called a pragma, at the top of the file.
   * This is very useful when gradually transitioning large, unformatted codebases to prettier.
   * @default false
   */
  requirePragma: boolean;
  /**
   * Prettier can insert a special @format marker at the top of files specifying that
   * the file has been formatted with prettier. This works well when used in tandem with
   * the --require-pragma option. If there is already a docblock at the top of
   * the file then this option will add a newline to it with the @format marker.
   * @default false
   */
  insertPragma: boolean;
  /**
   * By default, Prettier will wrap markdown text as-is since some services use a linebreak-sensitive renderer.
   * In some cases you may want to rely on editor/viewer soft wrapping instead, so this option allows you to opt out.
   * @default "preserve"
   */
  proseWrap: "always" | "never" | "preserve";
  /**
   * Include parentheses around a sole arrow function parameter.
   * @default "always"
   */
  arrowParens: "avoid" | "always";
  /**
   * Provide ability to support new languages to prettier.
   */
  plugins: Array<string | Plugin$2>;
  /**
   * How to handle whitespaces in HTML.
   * @default "css"
   */
  htmlWhitespaceSensitivity: "css" | "strict" | "ignore";
  /**
   * Which end of line characters to apply.
   * @default "lf"
   */
  endOfLine: "auto" | "lf" | "crlf" | "cr";
  /**
   * Change when properties in objects are quoted.
   * @default "as-needed"
   */
  quoteProps: "as-needed" | "consistent" | "preserve";
  /**
   * Whether or not to indent the code inside <script> and <style> tags in Vue files.
   * @default false
   */
  vueIndentScriptAndStyle: boolean;
  /**
   * Control whether Prettier formats quoted code embedded in the file.
   * @default "auto"
   */
  embeddedLanguageFormatting: "auto" | "off";
  /**
   * Enforce single attribute per line in HTML, Vue and JSX.
   * @default false
   */
  singleAttributePerLine: boolean;
}

interface ParserOptions<T = any> extends RequiredOptions {
  locStart: (node: T) => number;
  locEnd: (node: T) => number;
  originalText: string;
}

interface Plugin$2<T = any> {
  languages?: SupportLanguage[] | undefined;
  parsers?: { [parserName: string]: Parser<T> } | undefined;
  printers?: { [astFormat: string]: Printer<T> } | undefined;
  options?: SupportOptions | undefined;
  defaultOptions?: Partial<RequiredOptions> | undefined;
}

interface Parser<T = any> {
  parse: (text: string, options: ParserOptions<T>) => T | Promise<T>;
  astFormat: string;
  hasPragma?: ((text: string) => boolean) | undefined;
  locStart: (node: T) => number;
  locEnd: (node: T) => number;
  preprocess?:
    | ((text: string, options: ParserOptions<T>) => string)
    | undefined;
}

interface Printer<T = any> {
  print(
    path: AstPath<T>,
    options: ParserOptions<T>,
    print: (path: AstPath<T>) => Doc,
    args?: unknown,
  ): Doc;
  embed?:
    | ((
        path: AstPath,
        options: Options,
      ) =>
        | ((
            textToDoc: (text: string, options: Options) => Promise<Doc>,
            print: (
              selector?: string | number | Array<string | number> | AstPath,
            ) => Doc,
            path: AstPath,
            options: Options,
          ) => Promise<Doc | undefined> | Doc | undefined)
        | Doc
        | null)
    | undefined;
  preprocess?:
    | ((ast: T, options: ParserOptions<T>) => T | Promise<T>)
    | undefined;
  insertPragma?: (text: string) => string;
  /**
   * @returns `null` if you want to remove this node
   * @returns `void` if you want to use modified newNode
   * @returns anything if you want to replace the node with it
   */
  massageAstNode?: ((node: any, newNode: any, parent: any) => any) | undefined;
  hasPrettierIgnore?: ((path: AstPath<T>) => boolean) | undefined;
  canAttachComment?: ((node: T) => boolean) | undefined;
  isBlockComment?: ((node: T) => boolean) | undefined;
  willPrintOwnComments?: ((path: AstPath<T>) => boolean) | undefined;
  printComment?:
    | ((commentPath: AstPath<T>, options: ParserOptions<T>) => Doc)
    | undefined;
  /**
   * By default, Prettier searches all object properties (except for a few predefined ones) of each node recursively.
   * This function can be provided to override that behavior.
   * @param node The node whose children should be returned.
   * @param options Current options.
   * @returns `[]` if the node has no children or `undefined` to fall back on the default behavior.
   */
  getCommentChildNodes?:
    | ((node: T, options: ParserOptions<T>) => T[] | undefined)
    | undefined;
  handleComments?:
    | {
        ownLine?:
          | ((
              commentNode: any,
              text: string,
              options: ParserOptions<T>,
              ast: T,
              isLastComment: boolean,
            ) => boolean)
          | undefined;
        endOfLine?:
          | ((
              commentNode: any,
              text: string,
              options: ParserOptions<T>,
              ast: T,
              isLastComment: boolean,
            ) => boolean)
          | undefined;
        remaining?:
          | ((
              commentNode: any,
              text: string,
              options: ParserOptions<T>,
              ast: T,
              isLastComment: boolean,
            ) => boolean)
          | undefined;
      }
    | undefined;
  getVisitorKeys?:
    | ((node: T, nonTraversableKeys: Set<string>) => string[])
    | undefined;
}

interface SupportLanguage {
  name: string;
  since?: string | undefined;
  parsers: BuiltInParserName[] | string[];
  group?: string | undefined;
  tmScope?: string | undefined;
  aceMode?: string | undefined;
  codemirrorMode?: string | undefined;
  codemirrorMimeType?: string | undefined;
  aliases?: string[] | undefined;
  extensions?: string[] | undefined;
  filenames?: string[] | undefined;
  linguistLanguageId?: number | undefined;
  vscodeLanguageIds?: string[] | undefined;
  interpreters?: string[] | undefined;
}

interface SupportOptionRange {
  start: number;
  end: number;
  step: number;
}

type SupportOptionType =
  | "int"
  | "string"
  | "boolean"
  | "choice"
  | "path";

interface BaseSupportOption<Type extends SupportOptionType> {
  readonly name?: string | undefined;
  /**
   * Usually you can use {@link CoreCategoryType}
   */
  category: string;
  /**
   * The type of the option.
   *
   * When passing a type other than the ones listed below, the option is
   * treated as taking any string as argument, and `--option <${type}>` will
   * be displayed in --help.
   */
  type: Type;
  /**
   * Indicate that the option is deprecated.
   *
   * Use a string to add an extra message to --help for the option,
   * for example to suggest a replacement option.
   */
  deprecated?: true | string | undefined;
  /**
   * Description to be displayed in --help. If omitted, the option won't be
   * shown at all in --help.
   */
  description?: string | undefined;
}

interface IntSupportOption extends BaseSupportOption<"int"> {
  default?: number | undefined;
  array?: false | undefined;
  range?: SupportOptionRange | undefined;
}

interface IntArraySupportOption extends BaseSupportOption<"int"> {
  default?: Array<{ value: number[] }> | undefined;
  array: true;
}

interface StringSupportOption extends BaseSupportOption<"string"> {
  default?: string | undefined;
  array?: false | undefined;
}

interface StringArraySupportOption extends BaseSupportOption<"string"> {
  default?: Array<{ value: string[] }> | undefined;
  array: true;
}

interface BooleanSupportOption extends BaseSupportOption<"boolean"> {
  default?: boolean | undefined;
  array?: false | undefined;
  description: string;
  oppositeDescription?: string | undefined;
}

interface BooleanArraySupportOption
  extends BaseSupportOption<"boolean"> {
  default?: Array<{ value: boolean[] }> | undefined;
  array: true;
}

interface ChoiceSupportOption<Value = any>
  extends BaseSupportOption<"choice"> {
  default?: Value | Array<{ value: Value }> | undefined;
  description: string;
  choices: Array<{
    since?: string | undefined;
    value: Value;
    description: string;
  }>;
}

interface PathSupportOption extends BaseSupportOption<"path"> {
  default?: string | undefined;
  array?: false | undefined;
}

interface PathArraySupportOption extends BaseSupportOption<"path"> {
  default?: Array<{ value: string[] }> | undefined;
  array: true;
}

type SupportOption =
  | IntSupportOption
  | IntArraySupportOption
  | StringSupportOption
  | StringArraySupportOption
  | BooleanSupportOption
  | BooleanArraySupportOption
  | ChoiceSupportOption
  | PathSupportOption
  | PathArraySupportOption;

interface SupportOptions extends Record<string, SupportOption> {}

type XastDoctype = {
  type: 'doctype';
  name: string;
  data: {
    doctype: string;
  };
};

type XastInstruction = {
  type: 'instruction';
  name: string;
  value: string;
};

type XastComment = {
  type: 'comment';
  value: string;
};

type XastCdata = {
  type: 'cdata';
  value: string;
};

type XastText = {
  type: 'text';
  value: string;
};

type XastElement = {
  type: 'element';
  name: string;
  attributes: Record<string, string>;
  children: XastChild[];
};

type XastChild =
  | XastDoctype
  | XastInstruction
  | XastComment
  | XastCdata
  | XastText
  | XastElement;

type XastRoot = {
  type: 'root';
  children: XastChild[];
};

type XastParent = XastRoot | XastElement;

type StringifyOptions = {
  doctypeStart?: string;
  doctypeEnd?: string;
  procInstStart?: string;
  procInstEnd?: string;
  tagOpenStart?: string;
  tagOpenEnd?: string;
  tagCloseStart?: string;
  tagCloseEnd?: string;
  tagShortStart?: string;
  tagShortEnd?: string;
  attrStart?: string;
  attrEnd?: string;
  commentStart?: string;
  commentEnd?: string;
  cdataStart?: string;
  cdataEnd?: string;
  textStart?: string;
  textEnd?: string;
  indent?: number | string;
  regEntities?: RegExp;
  regValEntities?: RegExp;
  encodeEntity?: (char: string) => string;
  pretty?: boolean;
  useShortTags?: boolean;
  eol?: 'lf' | 'crlf';
  finalNewline?: boolean;
};

type VisitorNode<Node> = {
  enter?: (node: Node, parentNode: XastParent) => void | symbol;
  exit?: (node: Node, parentNode: XastParent) => void;
};

type VisitorRoot = {
  enter?: (node: XastRoot, parentNode: null) => void;
  exit?: (node: XastRoot, parentNode: null) => void;
};

type Visitor = {
  doctype?: VisitorNode<XastDoctype>;
  instruction?: VisitorNode<XastInstruction>;
  comment?: VisitorNode<XastComment>;
  cdata?: VisitorNode<XastCdata>;
  text?: VisitorNode<XastText>;
  element?: VisitorNode<XastElement>;
  root?: VisitorRoot;
};

type PluginInfo = {
  path?: string;
  multipassCount: number;
};

type Plugin$1<Params> = (
  root: XastRoot,
  params: Params,
  info: PluginInfo,
) => null | Visitor;

type DataUri = 'base64' | 'enc' | 'unenc';

type DefaultPlugins = {
  cleanupAttrs: {
    newlines?: boolean;
    trim?: boolean;
    spaces?: boolean;
  };
  cleanupEnableBackground: void;
  cleanupIds: {
    remove?: boolean;
    minify?: boolean;
    preserve?: string[];
    preservePrefixes?: string[];
    force?: boolean;
  };
  cleanupNumericValues: {
    floatPrecision?: number;
    leadingZero?: boolean;
    defaultPx?: boolean;
    convertToPx?: boolean;
  };
  collapseGroups: void;
  convertColors: {
    currentColor?: boolean | string | RegExp;
    names2hex?: boolean;
    rgb2hex?: boolean;
    shorthex?: boolean;
    shortname?: boolean;
  };
  convertEllipseToCircle: void;
  convertPathData: {
    applyTransforms?: boolean;
    applyTransformsStroked?: boolean;
    makeArcs?: {
      threshold: number;
      tolerance: number;
    };
    straightCurves?: boolean;
    convertToQ?: boolean;
    lineShorthands?: boolean;
    convertToZ?: boolean;
    curveSmoothShorthands?: boolean;
    floatPrecision?: number | false;
    transformPrecision?: number;
    smartArcRounding?: boolean;
    removeUseless?: boolean;
    collapseRepeated?: boolean;
    utilizeAbsolute?: boolean;
    leadingZero?: boolean;
    negativeExtraSpace?: boolean;
    noSpaceAfterFlags?: boolean;
    forceAbsolutePath?: boolean;
  };
  convertShapeToPath: {
    convertArcs?: boolean;
    floatPrecision?: number;
  };
  convertTransform: {
    convertToShorts?: boolean;
    degPrecision?: number;
    floatPrecision?: number;
    transformPrecision?: number;
    matrixToTransform?: boolean;
    shortTranslate?: boolean;
    shortScale?: boolean;
    shortRotate?: boolean;
    removeUseless?: boolean;
    collapseIntoOne?: boolean;
    leadingZero?: boolean;
    negativeExtraSpace?: boolean;
  };
  mergeStyles: void;
  inlineStyles: {
    /**
     * Inlines selectors that match once only.
     *
     * @default true
     */
    onlyMatchedOnce?: boolean;
    /**
     * Clean up matched selectors. Unused selects are left as-is.
     *
     * @default true
     */
    removeMatchedSelectors?: boolean;
    /**
     * Media queries to use. An empty string indicates all selectors outside of
     * media queries.
     */
    useMqs?: string[];
    /**
     * Pseudo-classes and elements to use. An empty string indicates all
     * all non-pseudo-classes and elements.
     */
    usePseudos?: string[];
  };
  mergePaths: {
    force?: boolean;
    floatPrecision?: number;
    noSpaceAfterFlags?: boolean;
  };

  minifyStyles: {
    /**
     * Disable or enable a structure optimisations.
     * @default true
     */
    restructure?: boolean;
    /**
     * Enables merging of @media rules with the same media query split by other rules.
     * The optimisation is unsafe in general, but should work fine in most cases. Use it on your own risk.
     * @default false
     */
    forceMediaMerge?: boolean;
    /**
     * Specify what comments to leave:
     * - 'exclamation' or true – leave all exclamation comments
     * - 'first-exclamation' – remove every comment except first one
     * - false – remove all comments
     * @default true
     */
    comments?: string | boolean;
    /**
     * Advanced optimizations
     */
    usage?:
      | boolean
      | {
          force?: boolean;
          ids?: boolean;
          classes?: boolean;
          tags?: boolean;
        };
  };

  moveElemsAttrsToGroup: void;
  moveGroupAttrsToElems: void;
  removeComments: {
    preservePatterns: Array<RegExp | string> | false;
  };
  removeDesc: {
    removeAny?: boolean;
  };
  removeDoctype: void;
  removeEditorsNSData: {
    additionalNamespaces?: string[];
  };
  removeEmptyAttrs: void;
  removeEmptyContainers: void;
  removeEmptyText: {
    text?: boolean;
    tspan?: boolean;
    tref?: boolean;
  };
  removeHiddenElems: {
    isHidden?: boolean;
    displayNone?: boolean;
    opacity0?: boolean;
    circleR0?: boolean;
    ellipseRX0?: boolean;
    ellipseRY0?: boolean;
    rectWidth0?: boolean;
    rectHeight0?: boolean;
    patternWidth0?: boolean;
    patternHeight0?: boolean;
    imageWidth0?: boolean;
    imageHeight0?: boolean;
    pathEmptyD?: boolean;
    polylineEmptyPoints?: boolean;
    polygonEmptyPoints?: boolean;
  };
  removeMetadata: void;
  removeNonInheritableGroupAttrs: void;
  removeTitle: void;
  removeUnknownsAndDefaults: {
    unknownContent?: boolean;
    unknownAttrs?: boolean;
    defaultAttrs?: boolean;
    /**
     * If to remove XML declarations that are assigned their default value. XML
     * declarations are the properties in the `<?xml … ?>` block at the top of
     * the document.
     */
    defaultMarkupDeclarations?: boolean;
    uselessOverrides?: boolean;
    keepDataAttrs?: boolean;
    keepAriaAttrs?: boolean;
    keepRoleAttr?: boolean;
  };
  removeUnusedNS: void;
  removeUselessDefs: void;
  removeUselessStrokeAndFill: {
    stroke?: boolean;
    fill?: boolean;
    removeNone?: boolean;
  };
  removeViewBox: void;
  removeXMLProcInst: void;
  sortAttrs: {
    order?: string[];
    xmlnsOrder?: 'front' | 'alphabetical';
  };
  sortDefsChildren: void;
};

type PresetDefaultOverrides = {
  [Name in keyof DefaultPlugins]?: DefaultPlugins[Name] | false;
};

type BuiltinsWithOptionalParams = DefaultPlugins & {
  'preset-default': {
    floatPrecision?: number;
    /**
     * All default plugins can be customized or disabled here
     * for example
     * {
     *   sortAttrs: { xmlnsOrder: "alphabetical" },
     *   cleanupAttrs: false,
     * }
     */
    overrides?: PresetDefaultOverrides;
  };
  cleanupListOfValues: {
    floatPrecision?: number;
    leadingZero?: boolean;
    defaultPx?: boolean;
    convertToPx?: boolean;
  };
  convertOneStopGradients: void;
  convertStyleToAttrs: {
    keepImportant?: boolean;
  };
  prefixIds: {
    prefix?:
      | boolean
      | string
      | ((node: XastElement, info: PluginInfo) => string);
    delim?: string;
    prefixIds?: boolean;
    prefixClassNames?: boolean;
  };
  removeDimensions: void;
  removeOffCanvasPaths: void;
  removeRasterImages: void;
  removeScriptElement: void;
  removeStyleElement: void;
  removeXlink: {
    /**
     * By default this plugin ignores legacy elements that were deprecated or
     * removed in SVG 2. Set to true to force performing operations on those
     * too.
     *
     * @default false
     */
    includeLegacy: boolean;
  };
  removeXMLNS: void;
  reusePaths: void;
};

type BuiltinsWithRequiredParams = {
  addAttributesToSVGElement: {
    attribute?: string | Record<string, null | string>;
    attributes?: Array<string | Record<string, null | string>>;
  };
  addClassesToSVGElement: {
    className?: string;
    classNames?: string[];
  };
  removeAttributesBySelector: any;
  removeAttrs: {
    elemSeparator?: string;
    preserveCurrentColor?: boolean;
    attrs: string | string[];
  };
  removeElementsByAttr: {
    id?: string | string[];
    class?: string | string[];
  };
};

type CustomPlugin = {
  name: string;
  fn: Plugin$1<void>;
};

type PluginConfig =
  | keyof BuiltinsWithOptionalParams
  | {
      [Name in keyof BuiltinsWithOptionalParams]: {
        name: Name;
        params?: BuiltinsWithOptionalParams[Name];
      };
    }[keyof BuiltinsWithOptionalParams]
  | {
      [Name in keyof BuiltinsWithRequiredParams]: {
        name: Name;
        params: BuiltinsWithRequiredParams[Name];
      };
    }[keyof BuiltinsWithRequiredParams]
  | CustomPlugin;

type Config$1 = {
  /** Can be used by plugins, for example prefixids */
  path?: string;
  /** Pass over SVGs multiple times to ensure all optimizations are applied. */
  multipass?: boolean;
  /** Precision of floating point numbers. Will be passed to each plugin that supports this param. */
  floatPrecision?: number;
  /**
   * Plugins configuration
   * ['preset-default'] is default
   * Can also specify any builtin plugin
   * ['sortAttrs', { name: 'prefixIds', params: { prefix: 'my-prefix' } }]
   * Or custom
   * [{ name: 'myPlugin', fn: () => ({}) }]
   */
  plugins?: PluginConfig[];
  /** Options for rendering optimized SVG from AST. */
  js2svg?: StringifyOptions;
  /** Output as Data URI string. */
  datauri?: DataUri;
};

interface State {
    filePath?: string;
    componentName: string;
    caller?: {
        name?: string;
        previousExport?: string | null;
        defaultPlugins?: ConfigPlugin[];
    };
}

interface Plugin {
    (code: string, config: Config, state: State): string;
}
type ConfigPlugin = string | Plugin;

interface Config {
    ref?: boolean;
    titleProp?: boolean;
    descProp?: boolean;
    expandProps?: boolean | 'start' | 'end';
    dimensions?: boolean;
    icon?: boolean | string | number;
    native?: boolean;
    svgProps?: {
        [key: string]: string;
    };
    replaceAttrValues?: {
        [key: string]: string;
    };
    runtimeConfig?: boolean;
    typescript?: boolean;
    prettier?: boolean;
    prettierConfig?: Options;
    svgo?: boolean;
    svgoConfig?: Config$1;
    configFile?: string;
    template?: Options$1['template'];
    memo?: boolean;
    exportType?: 'named' | 'default';
    namedExport?: string;
    jsxRuntime?: 'classic' | 'classic-preact' | 'automatic';
    jsxRuntimeImport?: {
        source: string;
        namespace?: string;
        specifiers?: string[];
        defaultSpecifier?: string;
    };
    index?: boolean;
    plugins?: ConfigPlugin[];
    jsx?: {
        babelConfig?: TransformOptions;
    };
}
declare const DEFAULT_CONFIG: Config;
declare const resolveConfig: {
    (searchFrom?: string, configFile?: string): Promise<Config | null>;
    sync(searchFrom?: string, configFile?: string): Config | null;
};
declare const resolveConfigFile: {
    (filePath: string): Promise<string | null>;
    sync(filePath: string): string | null;
};
declare const loadConfig: {
    ({ configFile, ...baseConfig }: Config, state?: Pick<State, 'filePath'>): Promise<Config>;
    sync({ configFile, ...baseConfig }: Config, state?: Pick<State, 'filePath'>): Config;
};

declare const transform: {
    (code: string, config?: Config, state?: Partial<State>): Promise<string>;
    sync(code: string, config?: Config, state?: Partial<State>): string;
};

export { DEFAULT_CONFIG, loadConfig, resolveConfig, resolveConfigFile, transform };
export type { Config, ConfigPlugin, Plugin, State };
