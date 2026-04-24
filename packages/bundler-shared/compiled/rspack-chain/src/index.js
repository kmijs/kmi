"use strict";
var __create = Object.create;
var __defProp = Object.defineProperty;
var __getOwnPropDesc = Object.getOwnPropertyDescriptor;
var __getOwnPropNames = Object.getOwnPropertyNames;
var __getProtoOf = Object.getPrototypeOf;
var __hasOwnProp = Object.prototype.hasOwnProperty;
var __commonJS = (cb, mod) => function __require() {
  return mod || (0, cb[__getOwnPropNames(cb)[0]])((mod = { exports: {} }).exports, mod), mod.exports;
};
var __export = (target, all) => {
  for (var name in all)
    __defProp(target, name, { get: all[name], enumerable: true });
};
var __copyProps = (to, from, except, desc) => {
  if (from && typeof from === "object" || typeof from === "function") {
    for (let key of __getOwnPropNames(from))
      if (!__hasOwnProp.call(to, key) && key !== except)
        __defProp(to, key, { get: () => from[key], enumerable: !(desc = __getOwnPropDesc(from, key)) || desc.enumerable });
  }
  return to;
};
var __toESM = (mod, isNodeMode, target) => (target = mod != null ? __create(__getProtoOf(mod)) : {}, __copyProps(
  // If the importer is in node compatibility mode or this is not an ESM
  // file that has been converted to a CommonJS file using a Babel-
  // compatible transform (i.e. "__esModule" has not been set), then set
  // "default" to the CommonJS "module.exports" for node compatibility.
  isNodeMode || !mod || !mod.__esModule ? __defProp(target, "default", { value: mod, enumerable: true }) : target,
  mod
));
var __toCommonJS = (mod) => __copyProps(__defProp({}, "__esModule", { value: true }), mod);

// ../../node_modules/.pnpm/deepmerge@4.3.1/node_modules/deepmerge/dist/cjs.js
var require_cjs = __commonJS({
  "../../node_modules/.pnpm/deepmerge@4.3.1/node_modules/deepmerge/dist/cjs.js"(exports, module2) {
    "use strict";
    var isMergeableObject = function isMergeableObject2(value) {
      return isNonNullObject(value) && !isSpecial(value);
    };
    function isNonNullObject(value) {
      return !!value && typeof value === "object";
    }
    function isSpecial(value) {
      var stringValue = Object.prototype.toString.call(value);
      return stringValue === "[object RegExp]" || stringValue === "[object Date]" || isReactElement(value);
    }
    var canUseSymbol = typeof Symbol === "function" && Symbol.for;
    var REACT_ELEMENT_TYPE = canUseSymbol ? Symbol.for("react.element") : 60103;
    function isReactElement(value) {
      return value.$$typeof === REACT_ELEMENT_TYPE;
    }
    function emptyTarget(val) {
      return Array.isArray(val) ? [] : {};
    }
    function cloneUnlessOtherwiseSpecified(value, options) {
      return options.clone !== false && options.isMergeableObject(value) ? deepmerge(emptyTarget(value), value, options) : value;
    }
    function defaultArrayMerge(target, source, options) {
      return target.concat(source).map(function(element) {
        return cloneUnlessOtherwiseSpecified(element, options);
      });
    }
    function getMergeFunction(key, options) {
      if (!options.customMerge) {
        return deepmerge;
      }
      var customMerge = options.customMerge(key);
      return typeof customMerge === "function" ? customMerge : deepmerge;
    }
    function getEnumerableOwnPropertySymbols(target) {
      return Object.getOwnPropertySymbols ? Object.getOwnPropertySymbols(target).filter(function(symbol) {
        return Object.propertyIsEnumerable.call(target, symbol);
      }) : [];
    }
    function getKeys(target) {
      return Object.keys(target).concat(getEnumerableOwnPropertySymbols(target));
    }
    function propertyIsOnObject(object, property) {
      try {
        return property in object;
      } catch (_) {
        return false;
      }
    }
    function propertyIsUnsafe(target, key) {
      return propertyIsOnObject(target, key) && !(Object.hasOwnProperty.call(target, key) && Object.propertyIsEnumerable.call(target, key));
    }
    function mergeObject(target, source, options) {
      var destination = {};
      if (options.isMergeableObject(target)) {
        getKeys(target).forEach(function(key) {
          destination[key] = cloneUnlessOtherwiseSpecified(target[key], options);
        });
      }
      getKeys(source).forEach(function(key) {
        if (propertyIsUnsafe(target, key)) {
          return;
        }
        if (propertyIsOnObject(target, key) && options.isMergeableObject(source[key])) {
          destination[key] = getMergeFunction(key, options)(target[key], source[key], options);
        } else {
          destination[key] = cloneUnlessOtherwiseSpecified(source[key], options);
        }
      });
      return destination;
    }
    function deepmerge(target, source, options) {
      options = options || {};
      options.arrayMerge = options.arrayMerge || defaultArrayMerge;
      options.isMergeableObject = options.isMergeableObject || isMergeableObject;
      options.cloneUnlessOtherwiseSpecified = cloneUnlessOtherwiseSpecified;
      var sourceIsArray = Array.isArray(source);
      var targetIsArray = Array.isArray(target);
      var sourceAndTargetTypesMatch = sourceIsArray === targetIsArray;
      if (!sourceAndTargetTypesMatch) {
        return cloneUnlessOtherwiseSpecified(source, options);
      } else if (sourceIsArray) {
        return options.arrayMerge(target, source, options);
      } else {
        return mergeObject(target, source, options);
      }
    }
    deepmerge.all = function deepmergeAll(array, options) {
      if (!Array.isArray(array)) {
        throw new Error("first argument should be an array");
      }
      return array.reduce(function(prev, next) {
        return deepmerge(prev, next, options);
      }, {});
    };
    var deepmerge_1 = deepmerge;
    module2.exports = deepmerge_1;
  }
});

// ../../node_modules/.pnpm/javascript-stringify@2.1.0/node_modules/javascript-stringify/dist/quote.js
var require_quote = __commonJS({
  "../../node_modules/.pnpm/javascript-stringify@2.1.0/node_modules/javascript-stringify/dist/quote.js"(exports) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    exports.stringifyPath = exports.quoteKey = exports.isValidVariableName = exports.IS_VALID_IDENTIFIER = exports.quoteString = void 0;
    var ESCAPABLE = /[\\\'\x00-\x1f\x7f-\x9f\u00ad\u0600-\u0604\u070f\u17b4\u17b5\u200c-\u200f\u2028-\u202f\u2060-\u206f\ufeff\ufff0-\uffff]/g;
    var META_CHARS = /* @__PURE__ */ new Map([
      ["\b", "\\b"],
      ["	", "\\t"],
      ["\n", "\\n"],
      ["\f", "\\f"],
      ["\r", "\\r"],
      ["'", "\\'"],
      ['"', '\\"'],
      ["\\", "\\\\"]
    ]);
    function escapeChar(char) {
      return META_CHARS.get(char) || `\\u${`0000${char.charCodeAt(0).toString(16)}`.slice(-4)}`;
    }
    function quoteString(str) {
      return `'${str.replace(ESCAPABLE, escapeChar)}'`;
    }
    exports.quoteString = quoteString;
    var RESERVED_WORDS = new Set("break else new var case finally return void catch for switch while continue function this with default if throw delete in try do instanceof typeof abstract enum int short boolean export interface static byte extends long super char final native synchronized class float package throws const goto private transient debugger implements protected volatile double import public let yield".split(" "));
    exports.IS_VALID_IDENTIFIER = /^[A-Za-z_$][A-Za-z0-9_$]*$/;
    function isValidVariableName(name) {
      return typeof name === "string" && !RESERVED_WORDS.has(name) && exports.IS_VALID_IDENTIFIER.test(name);
    }
    exports.isValidVariableName = isValidVariableName;
    function quoteKey(key, next) {
      return isValidVariableName(key) ? key : next(key);
    }
    exports.quoteKey = quoteKey;
    function stringifyPath(path, next) {
      let result = "";
      for (const key of path) {
        if (isValidVariableName(key)) {
          result += `.${key}`;
        } else {
          result += `[${next(key)}]`;
        }
      }
      return result;
    }
    exports.stringifyPath = stringifyPath;
  }
});

// ../../node_modules/.pnpm/javascript-stringify@2.1.0/node_modules/javascript-stringify/dist/function.js
var require_function = __commonJS({
  "../../node_modules/.pnpm/javascript-stringify@2.1.0/node_modules/javascript-stringify/dist/function.js"(exports) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    exports.FunctionParser = exports.dedentFunction = exports.functionToString = exports.USED_METHOD_KEY = void 0;
    var quote_1 = require_quote();
    var METHOD_NAMES_ARE_QUOTED = {
      " "() {
      }
    }[" "].toString().charAt(0) === '"';
    var FUNCTION_PREFIXES = {
      Function: "function ",
      GeneratorFunction: "function* ",
      AsyncFunction: "async function ",
      AsyncGeneratorFunction: "async function* "
    };
    var METHOD_PREFIXES = {
      Function: "",
      GeneratorFunction: "*",
      AsyncFunction: "async ",
      AsyncGeneratorFunction: "async *"
    };
    var TOKENS_PRECEDING_REGEXPS = new Set("case delete else in instanceof new return throw typeof void , ; : + - ! ~ & | ^ * / % < > ? =".split(" "));
    exports.USED_METHOD_KEY = /* @__PURE__ */ new WeakSet();
    var functionToString = (fn, space, next, key) => {
      const name = typeof key === "string" ? key : void 0;
      if (name !== void 0)
        exports.USED_METHOD_KEY.add(fn);
      return new FunctionParser(fn, space, next, name).stringify();
    };
    exports.functionToString = functionToString;
    function dedentFunction(fnString) {
      let found;
      for (const line of fnString.split("\n").slice(1)) {
        const m = /^[\s\t]+/.exec(line);
        if (!m)
          return fnString;
        const [str] = m;
        if (found === void 0)
          found = str;
        else if (str.length < found.length)
          found = str;
      }
      return found ? fnString.split(`
${found}`).join("\n") : fnString;
    }
    exports.dedentFunction = dedentFunction;
    var FunctionParser = class {
      constructor(fn, indent, next, key) {
        this.fn = fn;
        this.indent = indent;
        this.next = next;
        this.key = key;
        this.pos = 0;
        this.hadKeyword = false;
        this.fnString = Function.prototype.toString.call(fn);
        this.fnType = fn.constructor.name;
        this.keyQuote = key === void 0 ? "" : quote_1.quoteKey(key, next);
        this.keyPrefix = key === void 0 ? "" : `${this.keyQuote}:${indent ? " " : ""}`;
        this.isMethodCandidate = key === void 0 ? false : this.fn.name === "" || this.fn.name === key;
      }
      stringify() {
        const value = this.tryParse();
        if (!value) {
          return `${this.keyPrefix}void ${this.next(this.fnString)}`;
        }
        return dedentFunction(value);
      }
      getPrefix() {
        if (this.isMethodCandidate && !this.hadKeyword) {
          return METHOD_PREFIXES[this.fnType] + this.keyQuote;
        }
        return this.keyPrefix + FUNCTION_PREFIXES[this.fnType];
      }
      tryParse() {
        if (this.fnString[this.fnString.length - 1] !== "}") {
          return this.keyPrefix + this.fnString;
        }
        if (this.fn.name) {
          const result = this.tryStrippingName();
          if (result)
            return result;
        }
        const prevPos = this.pos;
        if (this.consumeSyntax() === "class")
          return this.fnString;
        this.pos = prevPos;
        if (this.tryParsePrefixTokens()) {
          const result = this.tryStrippingName();
          if (result)
            return result;
          let offset = this.pos;
          switch (this.consumeSyntax("WORD_LIKE")) {
            case "WORD_LIKE":
              if (this.isMethodCandidate && !this.hadKeyword) {
                offset = this.pos;
              }
            case "()":
              if (this.fnString.substr(this.pos, 2) === "=>") {
                return this.keyPrefix + this.fnString;
              }
              this.pos = offset;
            case '"':
            case "'":
            case "[]":
              return this.getPrefix() + this.fnString.substr(this.pos);
          }
        }
      }
      /**
       * Attempt to parse the function from the current position by first stripping
       * the function's name from the front. This is not a fool-proof method on all
       * JavaScript engines, but yields good results on Node.js 4 (and slightly
       * less good results on Node.js 6 and 8).
       */
      tryStrippingName() {
        if (METHOD_NAMES_ARE_QUOTED) {
          return;
        }
        let start = this.pos;
        const prefix = this.fnString.substr(this.pos, this.fn.name.length);
        if (prefix === this.fn.name) {
          this.pos += prefix.length;
          if (this.consumeSyntax() === "()" && this.consumeSyntax() === "{}" && this.pos === this.fnString.length) {
            if (this.isMethodCandidate || !quote_1.isValidVariableName(prefix)) {
              start += prefix.length;
            }
            return this.getPrefix() + this.fnString.substr(start);
          }
        }
        this.pos = start;
      }
      /**
       * Attempt to advance the parser past the keywords expected to be at the
       * start of this function's definition. This method sets `this.hadKeyword`
       * based on whether or not a `function` keyword is consumed.
       */
      tryParsePrefixTokens() {
        let posPrev = this.pos;
        this.hadKeyword = false;
        switch (this.fnType) {
          case "AsyncFunction":
            if (this.consumeSyntax() !== "async")
              return false;
            posPrev = this.pos;
          case "Function":
            if (this.consumeSyntax() === "function") {
              this.hadKeyword = true;
            } else {
              this.pos = posPrev;
            }
            return true;
          case "AsyncGeneratorFunction":
            if (this.consumeSyntax() !== "async")
              return false;
          case "GeneratorFunction":
            let token = this.consumeSyntax();
            if (token === "function") {
              token = this.consumeSyntax();
              this.hadKeyword = true;
            }
            return token === "*";
        }
      }
      /**
       * Advance the parser past one element of JavaScript syntax. This could be a
       * matched pair of delimiters, like braces or parentheses, or an atomic unit
       * like a keyword, variable, or operator. Return a normalized string
       * representation of the element parsed--for example, returns '{}' for a
       * matched pair of braces. Comments and whitespace are skipped.
       *
       * (This isn't a full parser, so the token scanning logic used here is as
       * simple as it can be. As a consequence, some things that are one token in
       * JavaScript, like decimal number literals or most multi-character operators
       * like '&&', are split into more than one token here. However, awareness of
       * some multi-character sequences like '=>' is necessary, so we match the few
       * of them that we care about.)
       */
      consumeSyntax(wordLikeToken) {
        const m = this.consumeMatch(/^(?:([A-Za-z_0-9$\xA0-\uFFFF]+)|=>|\+\+|\-\-|.)/);
        if (!m)
          return;
        const [token, match] = m;
        this.consumeWhitespace();
        if (match)
          return wordLikeToken || match;
        switch (token) {
          case "(":
            return this.consumeSyntaxUntil("(", ")");
          case "[":
            return this.consumeSyntaxUntil("[", "]");
          case "{":
            return this.consumeSyntaxUntil("{", "}");
          case "`":
            return this.consumeTemplate();
          case '"':
            return this.consumeRegExp(/^(?:[^\\"]|\\.)*"/, '"');
          case "'":
            return this.consumeRegExp(/^(?:[^\\']|\\.)*'/, "'");
        }
        return token;
      }
      consumeSyntaxUntil(startToken, endToken) {
        let isRegExpAllowed = true;
        for (; ; ) {
          const token = this.consumeSyntax();
          if (token === endToken)
            return startToken + endToken;
          if (!token || token === ")" || token === "]" || token === "}")
            return;
          if (token === "/" && isRegExpAllowed && this.consumeMatch(/^(?:\\.|[^\\\/\n[]|\[(?:\\.|[^\]])*\])+\/[a-z]*/)) {
            isRegExpAllowed = false;
            this.consumeWhitespace();
          } else {
            isRegExpAllowed = TOKENS_PRECEDING_REGEXPS.has(token);
          }
        }
      }
      consumeMatch(re) {
        const m = re.exec(this.fnString.substr(this.pos));
        if (m)
          this.pos += m[0].length;
        return m;
      }
      /**
       * Advance the parser past an arbitrary regular expression. Return `token`,
       * or the match object of the regexp.
       */
      consumeRegExp(re, token) {
        const m = re.exec(this.fnString.substr(this.pos));
        if (!m)
          return;
        this.pos += m[0].length;
        this.consumeWhitespace();
        return token;
      }
      /**
       * Advance the parser past a template string.
       */
      consumeTemplate() {
        for (; ; ) {
          this.consumeMatch(/^(?:[^`$\\]|\\.|\$(?!{))*/);
          if (this.fnString[this.pos] === "`") {
            this.pos++;
            this.consumeWhitespace();
            return "`";
          }
          if (this.fnString.substr(this.pos, 2) === "${") {
            this.pos += 2;
            this.consumeWhitespace();
            if (this.consumeSyntaxUntil("{", "}"))
              continue;
          }
          return;
        }
      }
      /**
       * Advance the parser past any whitespace or comments.
       */
      consumeWhitespace() {
        this.consumeMatch(/^(?:\s|\/\/.*|\/\*[^]*?\*\/)*/);
      }
    };
    exports.FunctionParser = FunctionParser;
  }
});

// ../../node_modules/.pnpm/javascript-stringify@2.1.0/node_modules/javascript-stringify/dist/array.js
var require_array = __commonJS({
  "../../node_modules/.pnpm/javascript-stringify@2.1.0/node_modules/javascript-stringify/dist/array.js"(exports) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    exports.arrayToString = void 0;
    var arrayToString = (array, space, next) => {
      const values = array.map(function(value, index) {
        const result = next(value, index);
        if (result === void 0)
          return String(result);
        return space + result.split("\n").join(`
${space}`);
      }).join(space ? ",\n" : ",");
      const eol = space && values ? "\n" : "";
      return `[${eol}${values}${eol}]`;
    };
    exports.arrayToString = arrayToString;
  }
});

// ../../node_modules/.pnpm/javascript-stringify@2.1.0/node_modules/javascript-stringify/dist/object.js
var require_object = __commonJS({
  "../../node_modules/.pnpm/javascript-stringify@2.1.0/node_modules/javascript-stringify/dist/object.js"(exports) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    exports.objectToString = void 0;
    var quote_1 = require_quote();
    var function_1 = require_function();
    var array_1 = require_array();
    var objectToString = (value, space, next, key) => {
      if (typeof Buffer === "function" && Buffer.isBuffer(value)) {
        return `Buffer.from(${next(value.toString("base64"))}, 'base64')`;
      }
      if (typeof global === "object" && value === global) {
        return globalToString(value, space, next, key);
      }
      const toString = OBJECT_TYPES[Object.prototype.toString.call(value)];
      return toString ? toString(value, space, next, key) : void 0;
    };
    exports.objectToString = objectToString;
    var rawObjectToString = (obj, indent, next, key) => {
      const eol = indent ? "\n" : "";
      const space = indent ? " " : "";
      const values = Object.keys(obj).reduce(function(values2, key2) {
        const fn = obj[key2];
        const result = next(fn, key2);
        if (result === void 0)
          return values2;
        const value = result.split("\n").join(`
${indent}`);
        if (function_1.USED_METHOD_KEY.has(fn)) {
          values2.push(`${indent}${value}`);
          return values2;
        }
        values2.push(`${indent}${quote_1.quoteKey(key2, next)}:${space}${value}`);
        return values2;
      }, []).join(`,${eol}`);
      if (values === "")
        return "{}";
      return `{${eol}${values}${eol}}`;
    };
    var globalToString = (value, space, next) => {
      return `Function(${next("return this")})()`;
    };
    var OBJECT_TYPES = {
      "[object Array]": array_1.arrayToString,
      "[object Object]": rawObjectToString,
      "[object Error]": (error, space, next) => {
        return `new Error(${next(error.message)})`;
      },
      "[object Date]": (date) => {
        return `new Date(${date.getTime()})`;
      },
      "[object String]": (str, space, next) => {
        return `new String(${next(str.toString())})`;
      },
      "[object Number]": (num) => {
        return `new Number(${num})`;
      },
      "[object Boolean]": (bool) => {
        return `new Boolean(${bool})`;
      },
      "[object Set]": (set, space, next) => {
        return `new Set(${next(Array.from(set))})`;
      },
      "[object Map]": (map, space, next) => {
        return `new Map(${next(Array.from(map))})`;
      },
      "[object RegExp]": String,
      "[object global]": globalToString,
      "[object Window]": globalToString
    };
  }
});

// ../../node_modules/.pnpm/javascript-stringify@2.1.0/node_modules/javascript-stringify/dist/stringify.js
var require_stringify = __commonJS({
  "../../node_modules/.pnpm/javascript-stringify@2.1.0/node_modules/javascript-stringify/dist/stringify.js"(exports) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    exports.toString = void 0;
    var quote_1 = require_quote();
    var object_1 = require_object();
    var function_1 = require_function();
    var PRIMITIVE_TYPES = {
      string: quote_1.quoteString,
      number: (value) => Object.is(value, -0) ? "-0" : String(value),
      boolean: String,
      symbol: (value, space, next) => {
        const key = Symbol.keyFor(value);
        if (key !== void 0)
          return `Symbol.for(${next(key)})`;
        return `Symbol(${next(value.description)})`;
      },
      bigint: (value, space, next) => {
        return `BigInt(${next(String(value))})`;
      },
      undefined: String,
      object: object_1.objectToString,
      function: function_1.functionToString
    };
    var toString = (value, space, next, key) => {
      if (value === null)
        return "null";
      return PRIMITIVE_TYPES[typeof value](value, space, next, key);
    };
    exports.toString = toString;
  }
});

// ../../node_modules/.pnpm/javascript-stringify@2.1.0/node_modules/javascript-stringify/dist/index.js
var require_dist = __commonJS({
  "../../node_modules/.pnpm/javascript-stringify@2.1.0/node_modules/javascript-stringify/dist/index.js"(exports) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    exports.stringify = void 0;
    var stringify_1 = require_stringify();
    var quote_1 = require_quote();
    var ROOT_SENTINEL = Symbol("root");
    function stringify2(value, replacer, indent, options = {}) {
      const space = typeof indent === "string" ? indent : " ".repeat(indent || 0);
      const path = [];
      const stack = /* @__PURE__ */ new Set();
      const tracking = /* @__PURE__ */ new Map();
      const unpack = /* @__PURE__ */ new Map();
      let valueCount = 0;
      const { maxDepth = 100, references = false, skipUndefinedProperties = false, maxValues = 1e5 } = options;
      const valueToString = replacerToString(replacer);
      const onNext = (value2, key) => {
        if (++valueCount > maxValues)
          return;
        if (skipUndefinedProperties && value2 === void 0)
          return;
        if (path.length > maxDepth)
          return;
        if (key === void 0)
          return valueToString(value2, space, onNext, key);
        path.push(key);
        const result2 = builder(value2, key === ROOT_SENTINEL ? void 0 : key);
        path.pop();
        return result2;
      };
      const builder = references ? (value2, key) => {
        if (value2 !== null && (typeof value2 === "object" || typeof value2 === "function" || typeof value2 === "symbol")) {
          if (tracking.has(value2)) {
            unpack.set(path.slice(1), tracking.get(value2));
            return valueToString(void 0, space, onNext, key);
          }
          tracking.set(value2, path.slice(1));
        }
        return valueToString(value2, space, onNext, key);
      } : (value2, key) => {
        if (stack.has(value2))
          return;
        stack.add(value2);
        const result2 = valueToString(value2, space, onNext, key);
        stack.delete(value2);
        return result2;
      };
      const result = onNext(value, ROOT_SENTINEL);
      if (unpack.size) {
        const sp = space ? " " : "";
        const eol = space ? "\n" : "";
        let wrapper = `var x${sp}=${sp}${result};${eol}`;
        for (const [key, value2] of unpack.entries()) {
          const keyPath = quote_1.stringifyPath(key, onNext);
          const valuePath = quote_1.stringifyPath(value2, onNext);
          wrapper += `x${keyPath}${sp}=${sp}x${valuePath};${eol}`;
        }
        return `(function${sp}()${sp}{${eol}${wrapper}return x;${eol}}())`;
      }
      return result;
    }
    exports.stringify = stringify2;
    function replacerToString(replacer) {
      if (!replacer)
        return stringify_1.toString;
      return (value, space, next, key) => {
        return replacer(value, space, (value2) => stringify_1.toString(value2, space, next, key), key);
      };
    }
  }
});

// compiled/rspack-chain/src/index.js
var src_exports = {};
__export(src_exports, {
  RspackChain: () => RspackChain
});
module.exports = __toCommonJS(src_exports);

// compiled/rspack-chain/src/createClass/createMap.js
var import_deepmerge = __toESM(require_cjs());
function createMap(superClass) {
  return class extends superClass {
    constructor(...args) {
      super(...args);
      this.store = /* @__PURE__ */ new Map();
    }
    extend(methods) {
      this.shorthands = methods;
      methods.forEach((method) => {
        this[method] = (value) => this.set(method, value);
      });
      return this;
    }
    clear() {
      this.store.clear();
      return this;
    }
    delete(key) {
      this.store.delete(key);
      return this;
    }
    order() {
      const entries = [...this.store].reduce((acc, [key, value]) => {
        acc[key] = value;
        return acc;
      }, {});
      const names = Object.keys(entries);
      const order = [...names];
      names.forEach((name) => {
        if (!entries[name]) {
          return;
        }
        const { __before, __after } = entries[name];
        if (__before && order.includes(__before)) {
          order.splice(order.indexOf(name), 1);
          order.splice(order.indexOf(__before), 0, name);
        } else if (__after && order.includes(__after)) {
          order.splice(order.indexOf(name), 1);
          order.splice(order.indexOf(__after) + 1, 0, name);
        }
      });
      return { entries, order };
    }
    entries() {
      const { entries, order } = this.order();
      if (order.length) {
        return entries;
      }
      return void 0;
    }
    values() {
      const { entries, order } = this.order();
      return order.map((name) => entries[name]);
    }
    get(key) {
      return this.store.get(key);
    }
    getOrCompute(key, fn) {
      if (!this.has(key)) {
        this.set(key, fn());
      }
      return this.get(key);
    }
    has(key) {
      return this.store.has(key);
    }
    set(key, value) {
      this.store.set(key, value);
      return this;
    }
    merge(obj, omit = []) {
      Object.keys(obj).forEach((key) => {
        if (omit.includes(key)) {
          return;
        }
        const value = obj[key];
        if (!Array.isArray(value) && typeof value !== "object" || value === null || !this.has(key)) {
          this.set(key, value);
        } else {
          this.set(key, (0, import_deepmerge.default)(this.get(key), value));
        }
      });
      return this;
    }
    clean(obj) {
      return Object.keys(obj).reduce((acc, key) => {
        const value = obj[key];
        if (value === void 0) {
          return acc;
        }
        if (Array.isArray(value) && !value.length) {
          return acc;
        }
        if (Object.prototype.toString.call(value) === "[object Object]" && !Object.keys(value).length) {
          return acc;
        }
        acc[key] = value;
        return acc;
      }, {});
    }
    when(condition, whenTruthy = Function.prototype, whenFalsy = Function.prototype) {
      if (condition) {
        whenTruthy(this);
      } else {
        whenFalsy(this);
      }
      return this;
    }
  };
}

// compiled/rspack-chain/src/createClass/createChainable.js
function createChainable(superClass) {
  return class extends superClass {
    constructor(parent) {
      super();
      this.parent = parent;
    }
    batch(handler) {
      handler(this);
      return this;
    }
    end() {
      return this.parent;
    }
  };
}

// compiled/rspack-chain/src/ChainedMap.js
var ChainedMap_default = createMap(createChainable(Object));

// compiled/rspack-chain/src/Callable.js
var Callable_default = class extends Function {
  constructor() {
    super();
    return new Proxy(this, {
      apply: (target, thisArg, args) => target.classCall(...args)
    });
  }
  classCall() {
    throw new Error("not implemented");
  }
};

// compiled/rspack-chain/src/createClass/createValue.js
function createValue(superClass) {
  return class extends superClass {
    constructor(...args) {
      super(...args);
      this.value = void 0;
      this.useMap = true;
    }
    set(...args) {
      this.useMap = true;
      this.value = void 0;
      return super.set(...args);
    }
    clear() {
      this.value = void 0;
      return super.clear();
    }
    classCall(value) {
      this.clear();
      this.useMap = false;
      this.value = value;
      return this.parent;
    }
    entries() {
      if (this.useMap) {
        return super.entries();
      }
      return this.value;
    }
    values() {
      if (this.useMap) {
        return super.values();
      }
      return this.value;
    }
  };
}

// compiled/rspack-chain/src/ChainedValueMap.js
var ChainedValueMap_default = createValue(createMap(createChainable(Callable_default)));

// compiled/rspack-chain/src/createClass/createSet.js
function createSet(superClass) {
  return class extends superClass {
    constructor(...args) {
      super(...args);
      this.store = /* @__PURE__ */ new Set();
    }
    add(value) {
      this.store.add(value);
      return this;
    }
    prepend(value) {
      this.store = /* @__PURE__ */ new Set([value, ...this.store]);
      return this;
    }
    clear() {
      this.store.clear();
      return this;
    }
    delete(value) {
      this.store.delete(value);
      return this;
    }
    values() {
      return [...this.store];
    }
    has(value) {
      return this.store.has(value);
    }
    merge(arr) {
      if (arr !== void 0) {
        this.store = /* @__PURE__ */ new Set([...this.store, ...arr]);
      }
      return this;
    }
    when(condition, whenTruthy = Function.prototype, whenFalsy = Function.prototype) {
      if (condition) {
        whenTruthy(this);
      } else {
        whenFalsy(this);
      }
      return this;
    }
  };
}

// compiled/rspack-chain/src/ChainedSet.js
var ChainedSet_default = createSet(createChainable(Object));

// compiled/rspack-chain/src/Resolve.js
var childMaps = ["alias", "fallback", "byDependency", "extensionAlias"];
var childSets = [
  "aliasFields",
  "conditionNames",
  "descriptionFiles",
  "extensions",
  "mainFields",
  "mainFiles",
  "exportsFields",
  "importsFields",
  "restrictions",
  "roots",
  "modules"
];
var Resolve_default = class extends ChainedMap_default {
  constructor(parent) {
    super(parent);
    childMaps.forEach((key) => {
      this[key] = new ChainedMap_default(this);
    });
    childSets.forEach((key) => {
      this[key] = new ChainedSet_default(this);
    });
    this.extend([
      "enforceExtension",
      "symlinks",
      "preferRelative",
      "preferAbsolute",
      "tsConfig"
    ]);
  }
  get(key) {
    if (childMaps.includes(key)) {
      return this[key].entries();
    }
    if (childSets.includes(key)) {
      return this[key].values();
    }
    return super.get(key);
  }
  toConfig() {
    const config = Object.assign(this.entries() || {});
    childMaps.forEach((key) => {
      config[key] = this[key].entries();
    });
    childSets.forEach((key) => {
      config[key] = this[key].values();
    });
    return this.clean(config);
  }
  merge(obj, omit = []) {
    const omissions = [...childMaps, ...childSets];
    omissions.forEach((key) => {
      if (!omit.includes(key) && key in obj) {
        this[key].merge(obj[key]);
      }
    });
    return super.merge(obj, [...omit, ...omissions]);
  }
};

// compiled/rspack-chain/src/ResolveLoader.js
var ResolveLoader_default = class extends Resolve_default {
  constructor(parent) {
    super(parent);
    this.modules = new ChainedSet_default(this);
    this.moduleExtensions = new ChainedSet_default(this);
    this.packageMains = new ChainedSet_default(this);
  }
  toConfig() {
    return this.clean({
      modules: this.modules.values(),
      moduleExtensions: this.moduleExtensions.values(),
      packageMains: this.packageMains.values(),
      ...super.toConfig()
    });
  }
  merge(obj, omit = []) {
    const omissions = ["modules", "moduleExtensions", "packageMains"];
    omissions.forEach((key) => {
      if (!omit.includes(key) && key in obj) {
        this[key].merge(obj[key]);
      }
    });
    return super.merge(obj, [...omit, ...omissions]);
  }
};

// compiled/rspack-chain/src/Output.js
var Output_default = class extends ChainedMap_default {
  constructor(parent) {
    super(parent);
    this.extend([
      "assetModuleFilename",
      "bundlerInfo",
      "chunkFilename",
      "chunkLoadTimeout",
      "chunkLoadingGlobal",
      "chunkLoading",
      "chunkFormat",
      "enabledChunkLoadingTypes",
      "crossOriginLoading",
      "devtoolFallbackModuleFilenameTemplate",
      "devtoolModuleFilenameTemplate",
      "devtoolNamespace",
      "filename",
      "globalObject",
      "uniqueName",
      "hashDigest",
      "hashDigestLength",
      "hashFunction",
      "hashSalt",
      "hotUpdateChunkFilename",
      "hotUpdateGlobal",
      "hotUpdateMainFilename",
      "library",
      "importFunctionName",
      "path",
      "pathinfo",
      "publicPath",
      "scriptType",
      "sourceMapFilename",
      "strictModuleErrorHandling",
      "strictModuleExceptionHandling",
      "workerChunkLoading",
      "enabledLibraryTypes",
      "environment",
      "compareBeforeEmit",
      "wasmLoading",
      "webassemblyModuleFilename",
      "enabledWasmLoadingTypes",
      "iife",
      "module",
      "clean"
    ]);
  }
};

// compiled/rspack-chain/src/DevServer.js
var DevServer_default = class extends ChainedMap_default {
  constructor(parent) {
    super(parent);
    this.extend([
      "allowedHosts",
      "app",
      "client",
      "compress",
      "devMiddleware",
      "headers",
      "host",
      "historyApiFallback",
      "hot",
      "ipc",
      "liveReload",
      "onListening",
      "open",
      "port",
      "proxy",
      "server",
      "setupExitSignals",
      "setupMiddlewares",
      "static",
      "watchFiles",
      "webSocketServer"
    ]);
  }
  toConfig() {
    return this.clean(this.entries() || {});
  }
};

// compiled/rspack-chain/src/Orderable.js
var Orderable_default = (Class) => class extends Class {
  before(name) {
    if (this.__after) {
      throw new Error(
        `Unable to set .before(${JSON.stringify(
          name
        )}) with existing value for .after()`
      );
    }
    this.__before = name;
    return this;
  }
  after(name) {
    if (this.__before) {
      throw new Error(
        `Unable to set .after(${JSON.stringify(
          name
        )}) with existing value for .before()`
      );
    }
    this.__after = name;
    return this;
  }
  merge(obj, omit = []) {
    if (obj.before) {
      this.before(obj.before);
    }
    if (obj.after) {
      this.after(obj.after);
    }
    return super.merge(obj, [...omit, "before", "after"]);
  }
};

// compiled/rspack-chain/src/Plugin.js
var Plugin_default = Orderable_default(
  class extends ChainedMap_default {
    constructor(parent, name, type = "plugin") {
      super(parent);
      this.name = name;
      this.type = type;
      this.extend(["init"]);
      this.init((Plugin, args = []) => {
        if (typeof Plugin === "function") {
          return new Plugin(...args);
        }
        return Plugin;
      });
    }
    use(plugin, args = []) {
      return this.set("plugin", plugin).set("args", args);
    }
    tap(f) {
      if (!this.has("plugin")) {
        throw new Error(
          `Cannot call .tap() on a plugin that has not yet been defined. Call ${this.type}('${this.name}').use(<Plugin>) first.`
        );
      }
      this.set("args", f(this.get("args") || []));
      return this;
    }
    set(key, value) {
      if (key === "args" && !Array.isArray(value)) {
        throw new Error("args must be an array of arguments");
      }
      return super.set(key, value);
    }
    merge(obj, omit = []) {
      if ("plugin" in obj) {
        this.set("plugin", obj.plugin);
      }
      if ("args" in obj) {
        this.set("args", obj.args);
      }
      return super.merge(obj, [...omit, "args", "plugin"]);
    }
    toConfig() {
      const init = this.get("init");
      let plugin = this.get("plugin");
      const args = this.get("args");
      let pluginPath = null;
      if (plugin === void 0) {
        throw new Error(
          `Invalid ${this.type} configuration: ${this.type}('${this.name}').use(<Plugin>) was not called to specify the plugin`
        );
      }
      if (typeof plugin === "string") {
        pluginPath = plugin;
        plugin = require(pluginPath);
      }
      const constructorName = plugin.__expression ? `(${plugin.__expression})` : plugin.name;
      const config = init(plugin, args);
      Object.defineProperties(config, {
        __pluginName: { value: this.name },
        __pluginType: { value: this.type },
        __pluginArgs: { value: args },
        __pluginConstructorName: { value: constructorName },
        __pluginPath: { value: pluginPath }
      });
      return config;
    }
  }
);

// compiled/rspack-chain/src/Use.js
var import_deepmerge2 = __toESM(require_cjs());
var Use_default = Orderable_default(
  class extends ChainedMap_default {
    constructor(parent, name) {
      super(parent);
      this.name = name;
      this.extend(["loader", "options", "parallel"]);
    }
    tap(f) {
      this.options(f(this.get("options")));
      return this;
    }
    merge(obj, omit = []) {
      if (!omit.includes("loader") && "loader" in obj) {
        this.loader(obj.loader);
      }
      if (!omit.includes("options") && "options" in obj) {
        this.options((0, import_deepmerge2.default)(this.store.get("options") || {}, obj.options));
      }
      return super.merge(obj, [...omit, "loader", "options"]);
    }
    toConfig() {
      const config = this.clean(this.entries() || {});
      Object.defineProperties(config, {
        __useName: { value: this.name },
        __ruleNames: { value: this.parent && this.parent.names },
        __ruleTypes: { value: this.parent && this.parent.ruleTypes }
      });
      return config;
    }
  }
);

// compiled/rspack-chain/src/Rule.js
function toArray(arr) {
  return Array.isArray(arr) ? arr : [arr];
}
var Rule = Orderable_default(
  class extends ChainedMap_default {
    constructor(parent, name, ruleType = "rule") {
      super(parent);
      this.ruleName = name;
      this.names = [];
      this.ruleType = ruleType;
      this.ruleTypes = [];
      let rule = this;
      while (rule instanceof Rule) {
        this.names.unshift(rule.ruleName);
        this.ruleTypes.unshift(rule.ruleType);
        rule = rule.parent;
      }
      this.uses = new ChainedMap_default(this);
      this.include = new ChainedSet_default(this);
      this.exclude = new ChainedSet_default(this);
      this.rules = new ChainedMap_default(this);
      this.oneOfs = new ChainedMap_default(this);
      this.resolve = new Resolve_default(this);
      this.resolve.extend(["fullySpecified"]);
      this.extend([
        "dependency",
        "enforce",
        "issuer",
        "issuerLayer",
        "layer",
        "mimetype",
        "parser",
        "generator",
        "resource",
        "resourceFragment",
        "resourceQuery",
        "sideEffects",
        "with",
        "test",
        "type"
      ]);
    }
    use(name) {
      return this.uses.getOrCompute(name, () => new Use_default(this, name));
    }
    rule(name) {
      return this.rules.getOrCompute(name, () => new Rule(this, name, "rule"));
    }
    oneOf(name) {
      return this.oneOfs.getOrCompute(
        name,
        () => new Rule(this, name, "oneOf")
      );
    }
    pre() {
      return this.enforce("pre");
    }
    post() {
      return this.enforce("post");
    }
    toConfig() {
      const config = this.clean(
        Object.assign(this.entries() || {}, {
          include: this.include.values(),
          exclude: this.exclude.values(),
          rules: this.rules.values().map((rule) => rule.toConfig()),
          oneOf: this.oneOfs.values().map((oneOf) => oneOf.toConfig()),
          use: this.uses.values().map((use) => use.toConfig()),
          resolve: this.resolve.toConfig()
        })
      );
      Object.defineProperties(config, {
        __ruleNames: { value: this.names },
        __ruleTypes: { value: this.ruleTypes }
      });
      return config;
    }
    merge(obj, omit = []) {
      if (!omit.includes("include") && "include" in obj) {
        this.include.merge(toArray(obj.include));
      }
      if (!omit.includes("exclude") && "exclude" in obj) {
        this.exclude.merge(toArray(obj.exclude));
      }
      if (!omit.includes("use") && "use" in obj) {
        Object.keys(obj.use).forEach(
          (name) => this.use(name).merge(obj.use[name])
        );
      }
      if (!omit.includes("rules") && "rules" in obj) {
        Object.keys(obj.rules).forEach(
          (name) => this.rule(name).merge(obj.rules[name])
        );
      }
      if (!omit.includes("oneOf") && "oneOf" in obj) {
        Object.keys(obj.oneOf).forEach(
          (name) => this.oneOf(name).merge(obj.oneOf[name])
        );
      }
      if (!omit.includes("resolve") && "resolve" in obj) {
        this.resolve.merge(obj.resolve);
      }
      if (!omit.includes("test") && "test" in obj) {
        this.test(
          obj.test instanceof RegExp || typeof obj.test === "function" ? obj.test : new RegExp(obj.test)
        );
      }
      return super.merge(obj, [
        ...omit,
        "include",
        "exclude",
        "use",
        "rules",
        "oneOf",
        "resolve",
        "test"
      ]);
    }
  }
);
var Rule_default = Rule;

// compiled/rspack-chain/src/Module.js
var Module_default = class extends ChainedMap_default {
  constructor(parent) {
    super(parent);
    this.rules = new ChainedMap_default(this);
    this.defaultRules = new ChainedMap_default(this);
    this.generator = new ChainedMap_default(this);
    this.parser = new ChainedMap_default(this);
    this.extend(["noParse"]);
  }
  defaultRule(name) {
    return this.defaultRules.getOrCompute(
      name,
      () => new Rule_default(this, name, "defaultRule")
    );
  }
  rule(name) {
    return this.rules.getOrCompute(name, () => new Rule_default(this, name, "rule"));
  }
  toConfig() {
    return this.clean(
      Object.assign(this.entries() || {}, {
        defaultRules: this.defaultRules.values().map((r) => r.toConfig()),
        generator: this.generator.entries(),
        parser: this.parser.entries(),
        rules: this.rules.values().map((r) => r.toConfig())
      })
    );
  }
  merge(obj, omit = []) {
    if (!omit.includes("rule") && "rule" in obj) {
      Object.keys(obj.rule).forEach(
        (name) => this.rule(name).merge(obj.rule[name])
      );
    }
    if (!omit.includes("defaultRule") && "defaultRule" in obj) {
      Object.keys(obj.defaultRule).forEach(
        (name) => this.defaultRule(name).merge(obj.defaultRule[name])
      );
    }
    return super.merge(obj, ["rule", "defaultRule"]);
  }
};

// compiled/rspack-chain/src/Optimization.js
var Optimization_default = class extends ChainedMap_default {
  constructor(parent) {
    super(parent);
    this.minimizers = new ChainedMap_default(this);
    this.splitChunks = new ChainedValueMap_default(this);
    this.extend([
      "minimize",
      "runtimeChunk",
      "emitOnErrors",
      "moduleIds",
      "chunkIds",
      "nodeEnv",
      "removeEmptyChunks",
      "mergeDuplicateChunks",
      "providedExports",
      "usedExports",
      "concatenateModules",
      "sideEffects",
      "mangleExports",
      "innerGraph",
      "inlineExports",
      "realContentHash",
      "avoidEntryIife"
    ]);
  }
  minimizer(name) {
    if (Array.isArray(name)) {
      throw new Error(
        "optimization.minimizer() no longer supports being passed an array."
      );
    }
    return this.minimizers.getOrCompute(
      name,
      () => new Plugin_default(this, name, "optimization.minimizer")
    );
  }
  toConfig() {
    return this.clean(
      Object.assign(this.entries() || {}, {
        splitChunks: this.splitChunks.entries(),
        minimizer: this.minimizers.values().map((plugin) => plugin.toConfig())
      })
    );
  }
  merge(obj, omit = []) {
    if (!omit.includes("minimizer") && "minimizer" in obj) {
      Object.keys(obj.minimizer).forEach(
        (name) => this.minimizer(name).merge(obj.minimizer[name])
      );
    }
    return super.merge(obj, [...omit, "minimizer"]);
  }
};

// compiled/rspack-chain/src/Performance.js
var Performance_default = class extends ChainedValueMap_default {
  constructor(parent) {
    super(parent);
    this.extend(["assetFilter", "hints", "maxAssetSize", "maxEntrypointSize"]);
  }
};

// compiled/rspack-chain/src/index.js
var import_javascript_stringify = __toESM(require_dist());
var castArray = (value) => Array.isArray(value) ? value : [value];
var toEntryObject = (entryPoints) => {
  const entry = Object.keys(entryPoints).reduce(
    (acc, key) => Object.assign(acc, { [key]: entryPoints[key].values() }),
    {}
  );
  const formattedEntry = {};
  for (const [entryName, entryValue] of Object.entries(entry)) {
    const entryImport = [];
    let entryDescription = null;
    for (const item of castArray(entryValue)) {
      if (typeof item === "string") {
        entryImport.push(item);
        continue;
      }
      if (item.import) {
        entryImport.push(...castArray(item.import));
      }
      if (entryDescription) {
        Object.assign(entryDescription, item);
      } else {
        entryDescription = item;
      }
    }
    formattedEntry[entryName] = entryDescription ? {
      ...entryDescription,
      import: entryImport
    } : entryImport;
  }
  return formattedEntry;
};
var RspackChain = class extends ChainedMap_default {
  constructor() {
    super();
    this.entryPoints = new ChainedMap_default(this);
    this.output = new Output_default(this);
    this.module = new Module_default(this);
    this.resolve = new Resolve_default(this);
    this.resolveLoader = new ResolveLoader_default(this);
    this.optimization = new Optimization_default(this);
    this.plugins = new ChainedMap_default(this);
    this.devServer = new DevServer_default(this);
    this.performance = new Performance_default(this);
    this.node = new ChainedValueMap_default(this);
    this.extend([
      "context",
      "mode",
      "devtool",
      "target",
      "watch",
      "watchOptions",
      "externals",
      "externalsType",
      "externalsPresets",
      "stats",
      "experiments",
      "amd",
      "bail",
      "cache",
      "dependencies",
      "ignoreWarnings",
      "loader",
      "name",
      "infrastructureLogging",
      "snapshot",
      "lazyCompilation"
    ]);
  }
  static toString(config, { verbose = false, configPrefix = "config" } = {}) {
    return (0, import_javascript_stringify.stringify)(
      config,
      (value, indent, stringify2) => {
        if (value && value.__pluginName) {
          const prefix = `/* ${configPrefix}.${value.__pluginType}('${value.__pluginName}') */
`;
          const constructorExpression = value.__pluginPath ? (
            // The path is stringified to ensure special characters are escaped
            // (such as the backslashes in Windows-style paths).
            `(require(${stringify2(value.__pluginPath)}))`
          ) : value.__pluginConstructorName;
          if (constructorExpression) {
            const args = stringify2(value.__pluginArgs).slice(1, -1);
            return `${prefix}new ${constructorExpression}(${args})`;
          }
          return prefix + stringify2(
            value.__pluginArgs && value.__pluginArgs.length ? { args: value.__pluginArgs } : {}
          );
        }
        if (value && value.__ruleNames) {
          const ruleTypes = value.__ruleTypes;
          const prefix = `/* ${configPrefix}.module${value.__ruleNames.map(
            (r, index) => `.${ruleTypes ? ruleTypes[index] : "rule"}('${r}')`
          ).join("")}${value.__useName ? `.use('${value.__useName}')` : ``} */
`;
          return prefix + stringify2(value);
        }
        if (value && value.__expression) {
          return value.__expression;
        }
        if (typeof value === "function") {
          if (!verbose && value.toString().length > 100) {
            return `function ${value.name || ""}() { /* omitted long function */ }`;
          }
        }
        return stringify2(value);
      },
      2
    );
  }
  entry(name) {
    return this.entryPoints.getOrCompute(name, () => new ChainedSet_default(this));
  }
  plugin(name) {
    return this.plugins.getOrCompute(name, () => new Plugin_default(this, name));
  }
  toConfig() {
    const entryPoints = this.entryPoints.entries() || {};
    const baseConfig = this.entries() || {};
    return this.clean(
      Object.assign(baseConfig, {
        node: this.node.entries(),
        output: this.output.entries(),
        resolve: this.resolve.toConfig(),
        resolveLoader: this.resolveLoader.toConfig(),
        devServer: this.devServer.toConfig(),
        module: this.module.toConfig(),
        optimization: this.optimization.toConfig(),
        plugins: this.plugins.values().map((plugin) => plugin.toConfig()),
        performance: this.performance.entries(),
        entry: toEntryObject(entryPoints)
      })
    );
  }
  toString(options) {
    return this.constructor.toString(this.toConfig(), options);
  }
  merge(obj = {}, omit = []) {
    const omissions = [
      "node",
      "output",
      "resolve",
      "resolveLoader",
      "devServer",
      "optimization",
      "performance",
      "module"
    ];
    if (!omit.includes("entry") && "entry" in obj) {
      Object.keys(obj.entry).forEach(
        (name) => this.entry(name).merge([].concat(obj.entry[name]))
      );
    }
    if (!omit.includes("plugin") && "plugin" in obj) {
      Object.keys(obj.plugin).forEach(
        (name) => this.plugin(name).merge(obj.plugin[name])
      );
    }
    omissions.forEach((key) => {
      if (!omit.includes(key) && key in obj) {
        this[key].merge(obj[key]);
      }
    });
    return super.merge(obj, [...omit, ...omissions, "entry", "plugin"]);
  }
};
// Annotate the CommonJS export names for ESM import in node:
0 && (module.exports = {
  RspackChain
});
