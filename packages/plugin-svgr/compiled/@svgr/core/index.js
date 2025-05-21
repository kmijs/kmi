(() => {
  "use strict";
  var __webpack_modules__ = {
    787: (module) => {
      const UPPERCASE = /[\p{Lu}]/u;
      const LOWERCASE = /[\p{Ll}]/u;
      const LEADING_CAPITAL = /^[\p{Lu}](?![\p{Lu}])/gu;
      const IDENTIFIER = /([\p{Alpha}\p{N}_]|$)/u;
      const SEPARATORS = /[_.\- ]+/;
      const LEADING_SEPARATORS = new RegExp("^" + SEPARATORS.source);
      const SEPARATORS_AND_IDENTIFIER = new RegExp(
        SEPARATORS.source + IDENTIFIER.source,
        "gu",
      );
      const NUMBERS_AND_IDENTIFIER = new RegExp(
        "\\d+" + IDENTIFIER.source,
        "gu",
      );
      const preserveCamelCase = (string, toLowerCase, toUpperCase) => {
        let isLastCharLower = false;
        let isLastCharUpper = false;
        let isLastLastCharUpper = false;
        for (let i = 0; i < string.length; i++) {
          const character = string[i];
          if (isLastCharLower && UPPERCASE.test(character)) {
            string = string.slice(0, i) + "-" + string.slice(i);
            isLastCharLower = false;
            isLastLastCharUpper = isLastCharUpper;
            isLastCharUpper = true;
            i++;
          } else if (
            isLastCharUpper &&
            isLastLastCharUpper &&
            LOWERCASE.test(character)
          ) {
            string = string.slice(0, i - 1) + "-" + string.slice(i - 1);
            isLastLastCharUpper = isLastCharUpper;
            isLastCharUpper = false;
            isLastCharLower = true;
          } else {
            isLastCharLower =
              toLowerCase(character) === character &&
              toUpperCase(character) !== character;
            isLastLastCharUpper = isLastCharUpper;
            isLastCharUpper =
              toUpperCase(character) === character &&
              toLowerCase(character) !== character;
          }
        }
        return string;
      };
      const preserveConsecutiveUppercase = (input, toLowerCase) => {
        LEADING_CAPITAL.lastIndex = 0;
        return input.replace(LEADING_CAPITAL, (m1) => toLowerCase(m1));
      };
      const postProcess = (input, toUpperCase) => {
        SEPARATORS_AND_IDENTIFIER.lastIndex = 0;
        NUMBERS_AND_IDENTIFIER.lastIndex = 0;
        return input
          .replace(SEPARATORS_AND_IDENTIFIER, (_, identifier) =>
            toUpperCase(identifier),
          )
          .replace(NUMBERS_AND_IDENTIFIER, (m) => toUpperCase(m));
      };
      const camelCase = (input, options) => {
        if (!(typeof input === "string" || Array.isArray(input))) {
          throw new TypeError("Expected the input to be `string | string[]`");
        }
        options = {
          pascalCase: false,
          preserveConsecutiveUppercase: false,
          ...options,
        };
        if (Array.isArray(input)) {
          input = input
            .map((x) => x.trim())
            .filter((x) => x.length)
            .join("-");
        } else {
          input = input.trim();
        }
        if (input.length === 0) {
          return "";
        }
        const toLowerCase =
          options.locale === false
            ? (string) => string.toLowerCase()
            : (string) => string.toLocaleLowerCase(options.locale);
        const toUpperCase =
          options.locale === false
            ? (string) => string.toUpperCase()
            : (string) => string.toLocaleUpperCase(options.locale);
        if (input.length === 1) {
          return options.pascalCase ? toUpperCase(input) : toLowerCase(input);
        }
        const hasUpperCase = input !== toLowerCase(input);
        if (hasUpperCase) {
          input = preserveCamelCase(input, toLowerCase, toUpperCase);
        }
        input = input.replace(LEADING_SEPARATORS, "");
        if (options.preserveConsecutiveUppercase) {
          input = preserveConsecutiveUppercase(input, toLowerCase);
        } else {
          input = toLowerCase(input);
        }
        if (options.pascalCase) {
          input = toUpperCase(input.charAt(0)) + input.slice(1);
        }
        return postProcess(input, toUpperCase);
      };
      module.exports = camelCase;
      module.exports["default"] = camelCase;
    },
    512: (module) => {
      module.exports = require("../../cosmiconfig");
    },
    17: (module) => {
      module.exports = require("path");
    },
  };
  var __webpack_module_cache__ = {};
  function __nccwpck_require__(moduleId) {
    var cachedModule = __webpack_module_cache__[moduleId];
    if (cachedModule !== undefined) {
      return cachedModule.exports;
    }
    var module = (__webpack_module_cache__[moduleId] = { exports: {} });
    var threw = true;
    try {
      __webpack_modules__[moduleId](
        module,
        module.exports,
        __nccwpck_require__,
      );
      threw = false;
    } finally {
      if (threw) delete __webpack_module_cache__[moduleId];
    }
    return module.exports;
  }
  if (typeof __nccwpck_require__ !== "undefined")
    __nccwpck_require__.ab = __dirname + "/";
  var __webpack_exports__ = {};
  (() => {
    var exports = __webpack_exports__;
    var path = __nccwpck_require__(17);
    var camelCase = __nccwpck_require__(787);
    var cosmiconfig = __nccwpck_require__(512);
    var __defProp$1 = Object.defineProperty;
    var __getOwnPropSymbols$1 = Object.getOwnPropertySymbols;
    var __hasOwnProp$1 = Object.prototype.hasOwnProperty;
    var __propIsEnum$1 = Object.prototype.propertyIsEnumerable;
    var __defNormalProp$1 = (obj, key, value) =>
      key in obj
        ? __defProp$1(obj, key, {
            enumerable: true,
            configurable: true,
            writable: true,
            value,
          })
        : (obj[key] = value);
    var __spreadValues$1 = (a, b) => {
      for (var prop in b || (b = {}))
        if (__hasOwnProp$1.call(b, prop)) __defNormalProp$1(a, prop, b[prop]);
      if (__getOwnPropSymbols$1)
        for (var prop of __getOwnPropSymbols$1(b)) {
          if (__propIsEnum$1.call(b, prop)) __defNormalProp$1(a, prop, b[prop]);
        }
      return a;
    };
    const VALID_CHAR_REGEX = /[^a-zA-Z0-9 _-]/g;
    const getComponentName = (filePath) => {
      if (!filePath) return "SvgComponent";
      const pascalCaseFileName = camelCase(
        path.parse(filePath).name.replace(VALID_CHAR_REGEX, ""),
        { pascalCase: true },
      );
      return `Svg${pascalCaseFileName}`;
    };
    const expandState = (state) =>
      __spreadValues$1(
        {
          componentName:
            state.componentName || getComponentName(state.filePath),
        },
        state,
      );
    var __defProp = Object.defineProperty;
    var __getOwnPropSymbols = Object.getOwnPropertySymbols;
    var __hasOwnProp = Object.prototype.hasOwnProperty;
    var __propIsEnum = Object.prototype.propertyIsEnumerable;
    var __defNormalProp = (obj, key, value) =>
      key in obj
        ? __defProp(obj, key, {
            enumerable: true,
            configurable: true,
            writable: true,
            value,
          })
        : (obj[key] = value);
    var __spreadValues = (a, b) => {
      for (var prop in b || (b = {}))
        if (__hasOwnProp.call(b, prop)) __defNormalProp(a, prop, b[prop]);
      if (__getOwnPropSymbols)
        for (var prop of __getOwnPropSymbols(b)) {
          if (__propIsEnum.call(b, prop)) __defNormalProp(a, prop, b[prop]);
        }
      return a;
    };
    var __objRest = (source, exclude) => {
      var target = {};
      for (var prop in source)
        if (__hasOwnProp.call(source, prop) && exclude.indexOf(prop) < 0)
          target[prop] = source[prop];
      if (source != null && __getOwnPropSymbols)
        for (var prop of __getOwnPropSymbols(source)) {
          if (exclude.indexOf(prop) < 0 && __propIsEnum.call(source, prop))
            target[prop] = source[prop];
        }
      return target;
    };
    const DEFAULT_CONFIG = {
      dimensions: true,
      expandProps: "end",
      icon: false,
      native: false,
      typescript: false,
      prettier: true,
      prettierConfig: void 0,
      memo: false,
      ref: false,
      replaceAttrValues: void 0,
      svgProps: void 0,
      svgo: true,
      svgoConfig: void 0,
      template: void 0,
      index: false,
      titleProp: false,
      descProp: false,
      runtimeConfig: true,
      namedExport: "ReactComponent",
      exportType: "default",
    };
    const explorer = cosmiconfig.cosmiconfig("svgr");
    const explorerSync = cosmiconfig.cosmiconfigSync("svgr");
    const resolveConfig = async (searchFrom, configFile) => {
      if (configFile == null) {
        const result2 = await explorer.search(searchFrom);
        return result2 ? result2.config : null;
      }
      const result = await explorer.load(configFile);
      return result ? result.config : null;
    };
    resolveConfig.sync = (searchFrom, configFile) => {
      if (configFile == null) {
        const result2 = explorerSync.search(searchFrom);
        return result2 ? result2.config : null;
      }
      const result = explorerSync.load(configFile);
      return result ? result.config : null;
    };
    const resolveConfigFile = async (filePath) => {
      const result = await explorer.search(filePath);
      return result ? result.filepath : null;
    };
    resolveConfigFile.sync = (filePath) => {
      const result = explorerSync.search(filePath);
      return result ? result.filepath : null;
    };
    const loadConfig = async (_a, state = {}) => {
      var _b = _a,
        { configFile } = _b,
        baseConfig = __objRest(_b, ["configFile"]);
      const rcConfig =
        state.filePath && baseConfig.runtimeConfig !== false
          ? await resolveConfig(state.filePath, configFile)
          : {};
      return __spreadValues(
        __spreadValues(__spreadValues({}, DEFAULT_CONFIG), baseConfig),
        rcConfig,
      );
    };
    loadConfig.sync = (_c, state = {}) => {
      var _d = _c,
        { configFile } = _d,
        baseConfig = __objRest(_d, ["configFile"]);
      const rcConfig =
        state.filePath && baseConfig.runtimeConfig !== false
          ? resolveConfig.sync(state.filePath, configFile)
          : {};
      return __spreadValues(
        __spreadValues(__spreadValues({}, DEFAULT_CONFIG), baseConfig),
        rcConfig,
      );
    };
    const DEFAULT_PLUGINS = [];
    const getPlugins = (config, state) => {
      var _a;
      if (config.plugins) {
        return config.plugins;
      }
      if ((_a = state.caller) == null ? void 0 : _a.defaultPlugins) {
        return state.caller.defaultPlugins;
      }
      return DEFAULT_PLUGINS;
    };
    const resolvePlugin = (plugin) => {
      if (typeof plugin === "function") {
        return plugin;
      }
      if (typeof plugin === "string") {
        return loadPlugin(plugin);
      }
      throw new Error(`Invalid plugin "${plugin}"`);
    };
    const pluginCache = {};
    const resolveModule = (m) => (m ? m.default || m : null);
    const loadPlugin = (moduleName) => {
      if (pluginCache[moduleName]) {
        return pluginCache[moduleName];
      }
      try {
        const plugin = resolveModule(require(moduleName));
        if (!plugin) {
          throw new Error(`Invalid plugin "${moduleName}"`);
        }
        pluginCache[moduleName] = plugin;
        return pluginCache[moduleName];
      } catch (error) {
        console.log(error);
        throw new Error(
          `Module "${moduleName}" missing. Maybe \`npm install ${moduleName}\` could help!`,
        );
      }
    };
    const run = (code, config, state) => {
      const expandedState = expandState(state);
      const plugins = getPlugins(config, state).map(resolvePlugin);
      let nextCode = String(code).replace("\0", "");
      for (const plugin of plugins) {
        nextCode = plugin(nextCode, config, expandedState);
      }
      return nextCode;
    };
    const transform = async (code, config = {}, state = {}) => {
      config = await loadConfig(config, state);
      return run(code, config, state);
    };
    transform.sync = (code, config = {}, state = {}) => {
      config = loadConfig.sync(config, state);
      return run(code, config, state);
    };
    exports.DEFAULT_CONFIG = DEFAULT_CONFIG;
    exports.loadConfig = loadConfig;
    exports.resolveConfig = resolveConfig;
    exports.resolveConfigFile = resolveConfigFile;
    exports.transform = transform;
  })();
  module.exports = __webpack_exports__;
})();
