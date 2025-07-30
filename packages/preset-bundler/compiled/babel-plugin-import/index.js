/******/ (() => { // webpackBootstrap
/******/ 	var __webpack_modules__ = ({

/***/ 523:
/***/ ((module, __unused_webpack_exports, __nccwpck_require__) => {

var __defProp = Object.defineProperty;
var __getOwnPropDesc = Object.getOwnPropertyDescriptor;
var __getOwnPropNames = Object.getOwnPropertyNames;
var __hasOwnProp = Object.prototype.hasOwnProperty;
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
var __toCommonJS = (mod) => __copyProps(__defProp({}, "__esModule", { value: true }), mod);

// src/Plugin.js
var Plugin_exports = {};
__export(Plugin_exports, {
  default: () => Plugin
});
module.exports = __toCommonJS(Plugin_exports);
var import_path = __nccwpck_require__(17);
var import_helper_module_imports = __nccwpck_require__(68);
function transCamel(_str, symbol) {
  const cells = _str.match(/([A-Z]+(?=[A-Z]|$))|([A-Z]?[^A-Z]+)/g) || [];
  return cells.map((c) => c.toLowerCase()).join(symbol);
}
function winPath(path) {
  return path.replace(/\\/g, "/");
}
function normalizeCustomName(originCustomName) {
  if (typeof originCustomName === "string") {
    const customNameExports = require(originCustomName);
    return typeof customNameExports === "function" ? customNameExports : customNameExports.default;
  }
  return originCustomName;
}
var Plugin = class {
  constructor(libraryName, libraryDirectory, style, styleLibraryDirectory, customStyleName, camel2DashComponentName, camel2UnderlineComponentName, fileName, customName, transformToDefaultImport, types, index = 0) {
    this.libraryName = libraryName;
    this.libraryDirectory = typeof libraryDirectory === "undefined" ? "lib" : libraryDirectory;
    this.camel2DashComponentName = typeof camel2DashComponentName === "undefined" ? true : camel2DashComponentName;
    this.camel2UnderlineComponentName = camel2UnderlineComponentName;
    this.style = style || false;
    this.styleLibraryDirectory = styleLibraryDirectory;
    this.customStyleName = normalizeCustomName(customStyleName);
    this.fileName = fileName || "";
    this.customName = normalizeCustomName(customName);
    this.transformToDefaultImport = typeof transformToDefaultImport === "undefined" ? true : transformToDefaultImport;
    this.types = types;
    this.pluginStateKey = `importPluginState${index}`;
  }
  getPluginState(state) {
    if (!state[this.pluginStateKey]) {
      state[this.pluginStateKey] = {};
    }
    return state[this.pluginStateKey];
  }
  importMethod(methodName, file, pluginState) {
    if (!pluginState.selectedMethods[methodName]) {
      const { style, libraryDirectory } = this;
      const transformedMethodName = this.camel2UnderlineComponentName ? transCamel(methodName, "_") : this.camel2DashComponentName ? transCamel(methodName, "-") : methodName;
      const path = winPath(
        this.customName ? this.customName(transformedMethodName, file) : (0, import_path.join)(this.libraryName, libraryDirectory, transformedMethodName, this.fileName)
        // eslint-disable-line
      );
      pluginState.selectedMethods[methodName] = this.transformToDefaultImport ? (0, import_helper_module_imports.addDefault)(file.path, path, { nameHint: methodName }) : (0, import_helper_module_imports.addNamed)(file.path, methodName, path);
      if (this.customStyleName) {
        const stylePath = winPath(this.customStyleName(transformedMethodName, file));
        (0, import_helper_module_imports.addSideEffect)(file.path, `${stylePath}`);
      } else if (this.styleLibraryDirectory) {
        const stylePath = winPath(
          (0, import_path.join)(this.libraryName, this.styleLibraryDirectory, transformedMethodName, this.fileName)
        );
        (0, import_helper_module_imports.addSideEffect)(file.path, `${stylePath}`);
      } else if (style === true) {
        (0, import_helper_module_imports.addSideEffect)(file.path, `${path}/style`);
      } else if (style === "css") {
        (0, import_helper_module_imports.addSideEffect)(file.path, `${path}/style/css`);
      } else if (typeof style === "function") {
        const stylePath = style(path, file);
        if (stylePath) {
          (0, import_helper_module_imports.addSideEffect)(file.path, stylePath);
        }
      }
    }
    return { ...pluginState.selectedMethods[methodName] };
  }
  buildExpressionHandler(node, props, path, state) {
    const file = path && path.hub && path.hub.file || state && state.file;
    const { types } = this;
    const pluginState = this.getPluginState(state);
    props.forEach((prop) => {
      if (!types.isIdentifier(node[prop]))
        return;
      if (pluginState.specified[node[prop].name] && types.isImportSpecifier(path.scope.getBinding(node[prop].name).path)) {
        node[prop] = this.importMethod(pluginState.specified[node[prop].name], file, pluginState);
      }
    });
  }
  buildDeclaratorHandler(node, prop, path, state) {
    const file = path && path.hub && path.hub.file || state && state.file;
    const { types } = this;
    const pluginState = this.getPluginState(state);
    const checkScope = (targetNode) => pluginState.specified[targetNode.name] && // eslint-disable-line
    path.scope.hasBinding(targetNode.name) && // eslint-disable-line
    path.scope.getBinding(targetNode.name).path.type === "ImportSpecifier";
    if (types.isIdentifier(node[prop]) && checkScope(node[prop])) {
      node[prop] = this.importMethod(pluginState.specified[node[prop].name], file, pluginState);
    } else if (types.isSequenceExpression(node[prop])) {
      node[prop].expressions.forEach((expressionNode, index) => {
        if (types.isIdentifier(expressionNode) && checkScope(expressionNode)) {
          node[prop].expressions[index] = this.importMethod(
            pluginState.specified[expressionNode.name],
            file,
            pluginState
          );
        }
      });
    }
  }
  ProgramEnter(path, state) {
    const pluginState = this.getPluginState(state);
    pluginState.specified = /* @__PURE__ */ Object.create(null);
    pluginState.libraryObjs = /* @__PURE__ */ Object.create(null);
    pluginState.selectedMethods = /* @__PURE__ */ Object.create(null);
    pluginState.pathsToRemove = [];
  }
  ProgramExit(path, state) {
    this.getPluginState(state).pathsToRemove.forEach((p) => !p.removed && p.remove());
  }
  ImportDeclaration(path, state) {
    const { node } = path;
    if (!node)
      return;
    const { value } = node.source;
    const { libraryName } = this;
    const { types } = this;
    const pluginState = this.getPluginState(state);
    if (value === libraryName) {
      node.specifiers.forEach((spec) => {
        if (types.isImportSpecifier(spec)) {
          pluginState.specified[spec.local.name] = spec.imported.name;
        } else {
          pluginState.libraryObjs[spec.local.name] = true;
        }
      });
      pluginState.pathsToRemove.push(path);
    }
  }
  CallExpression(path, state) {
    const { node } = path;
    const file = path && path.hub && path.hub.file || state && state.file;
    const { name } = node.callee;
    const { types } = this;
    const pluginState = this.getPluginState(state);
    if (types.isIdentifier(node.callee)) {
      if (pluginState.specified[name]) {
        node.callee = this.importMethod(pluginState.specified[name], file, pluginState);
      }
    }
    node.arguments = node.arguments.map((arg) => {
      const { name: argName } = arg;
      if (pluginState.specified[argName] && path.scope.hasBinding(argName) && path.scope.getBinding(argName).path.type === "ImportSpecifier") {
        return this.importMethod(pluginState.specified[argName], file, pluginState);
      }
      return arg;
    });
  }
  MemberExpression(path, state) {
    const { node } = path;
    const file = path && path.hub && path.hub.file || state && state.file;
    const pluginState = this.getPluginState(state);
    if (!node.object || !node.object.name)
      return;
    if (pluginState.libraryObjs[node.object.name]) {
      path.replaceWith(this.importMethod(node.property.name, file, pluginState));
    } else if (pluginState.specified[node.object.name] && path.scope.hasBinding(node.object.name)) {
      const { scope } = path.scope.getBinding(node.object.name);
      if (scope.path.parent.type === "File") {
        node.object = this.importMethod(pluginState.specified[node.object.name], file, pluginState);
      }
    }
  }
  Property(path, state) {
    const { node } = path;
    this.buildDeclaratorHandler(node, "value", path, state);
  }
  VariableDeclarator(path, state) {
    const { node } = path;
    this.buildDeclaratorHandler(node, "init", path, state);
  }
  ArrayExpression(path, state) {
    const { node } = path;
    const props = node.elements.map((_, index) => index);
    this.buildExpressionHandler(node.elements, props, path, state);
  }
  LogicalExpression(path, state) {
    const { node } = path;
    this.buildExpressionHandler(node, ["left", "right"], path, state);
  }
  ConditionalExpression(path, state) {
    const { node } = path;
    this.buildExpressionHandler(node, ["test", "consequent", "alternate"], path, state);
  }
  IfStatement(path, state) {
    const { node } = path;
    this.buildExpressionHandler(node, ["test"], path, state);
    this.buildExpressionHandler(node.test, ["left", "right"], path, state);
  }
  ExpressionStatement(path, state) {
    const { node } = path;
    const { types } = this;
    if (types.isAssignmentExpression(node.expression)) {
      this.buildExpressionHandler(node.expression, ["right"], path, state);
    }
  }
  ReturnStatement(path, state) {
    const { node } = path;
    this.buildExpressionHandler(node, ["argument"], path, state);
  }
  ExportDefaultDeclaration(path, state) {
    const { node } = path;
    this.buildExpressionHandler(node, ["declaration"], path, state);
  }
  BinaryExpression(path, state) {
    const { node } = path;
    this.buildExpressionHandler(node, ["left", "right"], path, state);
  }
  NewExpression(path, state) {
    const { node } = path;
    this.buildExpressionHandler(node, ["callee"], path, state);
    const argumentsProps = node.arguments.map((_, index) => index);
    this.buildExpressionHandler(node.arguments, argumentsProps, path, state);
  }
  SwitchStatement(path, state) {
    const { node } = path;
    this.buildExpressionHandler(node, ["discriminant"], path, state);
  }
  SwitchCase(path, state) {
    const { node } = path;
    this.buildExpressionHandler(node, ["test"], path, state);
  }
  ClassDeclaration(path, state) {
    const { node } = path;
    this.buildExpressionHandler(node, ["superClass"], path, state);
  }
  SequenceExpression(path, state) {
    const { node } = path;
    const expressionsProps = node.expressions.map((_, index) => index);
    this.buildExpressionHandler(node.expressions, expressionsProps, path, state);
  }
};


/***/ }),

/***/ 26:
/***/ ((module, __unused_webpack_exports, __nccwpck_require__) => {

var __create = Object.create;
var __defProp = Object.defineProperty;
var __getOwnPropDesc = Object.getOwnPropertyDescriptor;
var __getOwnPropNames = Object.getOwnPropertyNames;
var __getProtoOf = Object.getPrototypeOf;
var __hasOwnProp = Object.prototype.hasOwnProperty;
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

// src/index.js
var src_exports = {};
__export(src_exports, {
  default: () => src_default
});
module.exports = __toCommonJS(src_exports);
var import_assert = __toESM(__nccwpck_require__(491));
var import_Plugin = __toESM(__nccwpck_require__(523));
function src_default({ types }) {
  let plugins = null;
  global.__clearBabelAntdPlugin = () => {
    plugins = null;
  };
  function applyInstance(method, args, context) {
    for (const plugin of plugins) {
      if (plugin[method]) {
        plugin[method].apply(plugin, [...args, context]);
      }
    }
  }
  const Program = {
    enter(path, { opts = {} }) {
      if (!plugins) {
        if (Array.isArray(opts)) {
          plugins = opts.map(
            ({
              libraryName,
              libraryDirectory,
              style,
              styleLibraryDirectory,
              customStyleName,
              camel2DashComponentName,
              camel2UnderlineComponentName,
              fileName,
              customName,
              transformToDefaultImport
            }, index) => {
              (0, import_assert.default)(libraryName, "libraryName should be provided");
              return new import_Plugin.default(
                libraryName,
                libraryDirectory,
                style,
                styleLibraryDirectory,
                customStyleName,
                camel2DashComponentName,
                camel2UnderlineComponentName,
                fileName,
                customName,
                transformToDefaultImport,
                types,
                index
              );
            }
          );
        } else {
          (0, import_assert.default)(opts.libraryName, "libraryName should be provided");
          plugins = [
            new import_Plugin.default(
              opts.libraryName,
              opts.libraryDirectory,
              opts.style,
              opts.styleLibraryDirectory,
              opts.customStyleName,
              opts.camel2DashComponentName,
              opts.camel2UnderlineComponentName,
              opts.fileName,
              opts.customName,
              opts.transformToDefaultImport,
              types
            )
          ];
        }
      }
      applyInstance("ProgramEnter", arguments, this);
    },
    exit() {
      applyInstance("ProgramExit", arguments, this);
    }
  };
  const methods = [
    "ImportDeclaration",
    "CallExpression",
    "MemberExpression",
    "Property",
    "VariableDeclarator",
    "ArrayExpression",
    "LogicalExpression",
    "ConditionalExpression",
    "IfStatement",
    "ExpressionStatement",
    "ReturnStatement",
    "ExportDefaultDeclaration",
    "BinaryExpression",
    "NewExpression",
    "ClassDeclaration",
    "SwitchStatement",
    "SwitchCase",
    "SequenceExpression"
  ];
  const ret = {
    visitor: { Program }
  };
  for (const method of methods) {
    ret.visitor[method] = function() {
      applyInstance(method, arguments, ret.visitor);
    };
  }
  return ret;
}


/***/ }),

/***/ 68:
/***/ ((module) => {

"use strict";
module.exports = require("@kmijs/bundler-compiled/compiled/babel/helper-module-imports");

/***/ }),

/***/ 491:
/***/ ((module) => {

"use strict";
module.exports = require("assert");

/***/ }),

/***/ 17:
/***/ ((module) => {

"use strict";
module.exports = require("path");

/***/ })

/******/ 	});
/************************************************************************/
/******/ 	// The module cache
/******/ 	var __webpack_module_cache__ = {};
/******/ 	
/******/ 	// The require function
/******/ 	function __nccwpck_require__(moduleId) {
/******/ 		// Check if module is in cache
/******/ 		var cachedModule = __webpack_module_cache__[moduleId];
/******/ 		if (cachedModule !== undefined) {
/******/ 			return cachedModule.exports;
/******/ 		}
/******/ 		// Create a new module (and put it into the cache)
/******/ 		var module = __webpack_module_cache__[moduleId] = {
/******/ 			// no module.id needed
/******/ 			// no module.loaded needed
/******/ 			exports: {}
/******/ 		};
/******/ 	
/******/ 		// Execute the module function
/******/ 		var threw = true;
/******/ 		try {
/******/ 			__webpack_modules__[moduleId](module, module.exports, __nccwpck_require__);
/******/ 			threw = false;
/******/ 		} finally {
/******/ 			if(threw) delete __webpack_module_cache__[moduleId];
/******/ 		}
/******/ 	
/******/ 		// Return the exports of the module
/******/ 		return module.exports;
/******/ 	}
/******/ 	
/************************************************************************/
/******/ 	/* webpack/runtime/compat */
/******/ 	
/******/ 	if (typeof __nccwpck_require__ !== 'undefined') __nccwpck_require__.ab = __dirname + "/";
/******/ 	
/************************************************************************/
/******/ 	
/******/ 	// startup
/******/ 	// Load entry module and return exports
/******/ 	// This entry module is referenced by other modules so it can't be inlined
/******/ 	var __webpack_exports__ = __nccwpck_require__(26);
/******/ 	module.exports = __webpack_exports__;
/******/ 	
/******/ })()
;