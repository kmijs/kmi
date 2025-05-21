(() => {
  "use strict";
  var __webpack_modules__ = {
    64: (module, __unused_webpack_exports, __nccwpck_require__) => {
      var core = __nccwpck_require__(697);
      const positionMethod = {
        start: "unshiftContainer",
        end: "pushContainer",
      };
      const addJSXAttribute = (_, opts) => {
        function getAttributeValue({ literal, value }) {
          if (typeof value === "boolean") {
            return core.types.jsxExpressionContainer(
              core.types.booleanLiteral(value),
            );
          }
          if (typeof value === "number") {
            return core.types.jsxExpressionContainer(
              core.types.numericLiteral(value),
            );
          }
          if (typeof value === "string" && literal) {
            return core.types.jsxExpressionContainer(
              core.template.ast(value).expression,
            );
          }
          if (typeof value === "string") {
            return core.types.stringLiteral(value);
          }
          return null;
        }
        function getAttribute({ spread, name, value, literal }) {
          if (spread) {
            return core.types.jsxSpreadAttribute(core.types.identifier(name));
          }
          return core.types.jsxAttribute(
            core.types.jsxIdentifier(name),
            getAttributeValue({ value, literal }),
          );
        }
        return {
          visitor: {
            JSXOpeningElement(path) {
              if (!core.types.isJSXIdentifier(path.node.name)) return;
              if (!opts.elements.includes(path.node.name.name)) return;
              opts.attributes.forEach(
                ({
                  name,
                  value = null,
                  spread = false,
                  literal = false,
                  position = "end",
                }) => {
                  const method = positionMethod[position];
                  const newAttribute = getAttribute({
                    spread,
                    name,
                    value,
                    literal,
                  });
                  const attributes = path.get("attributes");
                  const isEqualAttribute = (attribute) => {
                    if (spread)
                      return (
                        attribute.isJSXSpreadAttribute() &&
                        attribute.get("argument").isIdentifier({ name })
                      );
                    return (
                      attribute.isJSXAttribute() &&
                      attribute.get("name").isJSXIdentifier({ name })
                    );
                  };
                  const replaced = attributes.some((attribute) => {
                    if (!isEqualAttribute(attribute)) return false;
                    attribute.replaceWith(newAttribute);
                    return true;
                  });
                  if (!replaced) {
                    path[method]("attributes", newAttribute);
                  }
                },
              );
            },
          },
        };
      };
      module.exports = addJSXAttribute;
    },
    706: (module, __unused_webpack_exports, __nccwpck_require__) => {
      var core = __nccwpck_require__(697);
      const removeJSXAttribute = (_, opts) => ({
        visitor: {
          JSXOpeningElement(path) {
            if (!core.types.isJSXIdentifier(path.node.name)) return;
            if (!opts.elements.includes(path.node.name.name)) return;
            path.get("attributes").forEach((attribute) => {
              if (
                core.types.isJSXAttribute(attribute.node) &&
                core.types.isJSXIdentifier(attribute.node.name) &&
                opts.attributes.includes(attribute.node.name.name)
              ) {
                attribute.remove();
              }
            });
          },
        },
      });
      module.exports = removeJSXAttribute;
    },
    28: (module, __unused_webpack_exports, __nccwpck_require__) => {
      var core = __nccwpck_require__(697);
      const removeJSXEmptyExpression = () => ({
        visitor: {
          JSXExpressionContainer(path) {
            if (core.types.isJSXEmptyExpression(path.get("expression"))) {
              path.remove();
            }
          },
        },
      });
      module.exports = removeJSXEmptyExpression;
    },
    175: (module, __unused_webpack_exports, __nccwpck_require__) => {
      var core = __nccwpck_require__(697);
      const addJSXAttribute = (api, opts) => {
        const getAttributeValue = (value, literal) => {
          if (typeof value === "string" && literal) {
            return core.types.jsxExpressionContainer(
              core.template.ast(value).expression,
            );
          }
          if (typeof value === "string") {
            return core.types.stringLiteral(value);
          }
          if (typeof value === "boolean") {
            return core.types.jsxExpressionContainer(
              core.types.booleanLiteral(value),
            );
          }
          if (typeof value === "number") {
            return core.types.jsxExpressionContainer(
              core.types.numericLiteral(value),
            );
          }
          return null;
        };
        return {
          visitor: {
            JSXAttribute(path) {
              const valuePath = path.get("value");
              if (!valuePath.isStringLiteral()) return;
              opts.values.forEach(({ value, newValue, literal }) => {
                if (!valuePath.isStringLiteral({ value })) return;
                const attributeValue = getAttributeValue(newValue, literal);
                if (attributeValue) {
                  valuePath.replaceWith(attributeValue);
                }
              });
            },
          },
        };
      };
      module.exports = addJSXAttribute;
    },
    343: (module, __unused_webpack_exports, __nccwpck_require__) => {
      var core = __nccwpck_require__(697);
      const elements = ["svg", "Svg"];
      const createTagElement = (tag, children = [], attributes = []) => {
        const eleName = core.types.jsxIdentifier(tag);
        return core.types.jsxElement(
          core.types.jsxOpeningElement(eleName, attributes),
          core.types.jsxClosingElement(eleName),
          children,
        );
      };
      const createTagIdAttribute = (tag) =>
        core.types.jsxAttribute(
          core.types.jsxIdentifier("id"),
          core.types.jsxExpressionContainer(core.types.identifier(`${tag}Id`)),
        );
      const addTagIdAttribute = (tag, attributes) => {
        const existingId = attributes.find(
          (attribute) =>
            core.types.isJSXAttribute(attribute) &&
            attribute.name.name === "id",
        );
        if (!existingId) {
          return [...attributes, createTagIdAttribute(tag)];
        }
        existingId.value = core.types.jsxExpressionContainer(
          core.types.isStringLiteral(existingId.value)
            ? core.types.logicalExpression(
                "||",
                core.types.identifier(`${tag}Id`),
                existingId.value,
              )
            : core.types.identifier(`${tag}Id`),
        );
        return attributes;
      };
      const plugin = () => ({
        visitor: {
          JSXElement(path, state) {
            const tag = state.opts.tag || "title";
            if (!elements.length) return;
            const openingElement = path.get("openingElement");
            const openingElementName = openingElement.get("name");
            if (
              !elements.some((element) =>
                openingElementName.isJSXIdentifier({ name: element }),
              )
            ) {
              return;
            }
            const getTagElement = (existingTitle) => {
              var _a;
              const tagExpression = core.types.identifier(tag);
              if (existingTitle) {
                existingTitle.openingElement.attributes = addTagIdAttribute(
                  tag,
                  existingTitle.openingElement.attributes,
                );
              }
              const conditionalTitle = core.types.conditionalExpression(
                tagExpression,
                createTagElement(
                  tag,
                  [core.types.jsxExpressionContainer(tagExpression)],
                  existingTitle
                    ? existingTitle.openingElement.attributes
                    : [createTagIdAttribute(tag)],
                ),
                core.types.nullLiteral(),
              );
              if (
                (_a =
                  existingTitle == null ? void 0 : existingTitle.children) ==
                null
                  ? void 0
                  : _a.length
              ) {
                return core.types.jsxExpressionContainer(
                  core.types.conditionalExpression(
                    core.types.binaryExpression(
                      "===",
                      tagExpression,
                      core.types.identifier("undefined"),
                    ),
                    existingTitle,
                    conditionalTitle,
                  ),
                );
              }
              return core.types.jsxExpressionContainer(conditionalTitle);
            };
            let tagElement = null;
            const hasTitle = path.get("children").some((childPath) => {
              if (childPath.node === tagElement) return false;
              if (!childPath.isJSXElement()) return false;
              const name = childPath.get("openingElement").get("name");
              if (!name.isJSXIdentifier()) return false;
              if (name.node.name !== tag) return false;
              tagElement = getTagElement(childPath.node);
              childPath.replaceWith(tagElement);
              return true;
            });
            tagElement = tagElement || getTagElement();
            if (!hasTitle) {
              path.node.children.unshift(tagElement);
              path.replaceWith(path.node);
            }
          },
        },
      });
      module.exports = plugin;
    },
    187: (module, __unused_webpack_exports, __nccwpck_require__) => {
      var core = __nccwpck_require__(697);
      const elements = ["svg", "Svg"];
      const getValue = (raw) => {
        if (raw === void 0) return core.types.stringLiteral("1em");
        switch (typeof raw) {
          case "number":
            return core.types.jsxExpressionContainer(
              core.types.numericLiteral(raw),
            );
          case "string":
            return core.types.stringLiteral(raw);
          default:
            return core.types.stringLiteral("1em");
        }
      };
      const plugin = (_, opts) => ({
        visitor: {
          JSXOpeningElement(path) {
            if (
              !elements.some((element) =>
                path.get("name").isJSXIdentifier({ name: element }),
              )
            )
              return;
            const values = {
              width: getValue(opts.width),
              height: getValue(opts.height),
            };
            const requiredAttributes = Object.keys(values);
            path.get("attributes").forEach((attributePath) => {
              if (!attributePath.isJSXAttribute()) return;
              const namePath = attributePath.get("name");
              if (!namePath.isJSXIdentifier()) return;
              const index = requiredAttributes.indexOf(namePath.node.name);
              if (index === -1) return;
              const valuePath = attributePath.get("value");
              valuePath.replaceWith(values[namePath.node.name]);
              requiredAttributes.splice(index, 1);
            });
            path.pushContainer(
              "attributes",
              requiredAttributes.map((attr) =>
                core.types.jsxAttribute(
                  core.types.jsxIdentifier(attr),
                  values[attr],
                ),
              ),
            );
          },
        },
      });
      module.exports = plugin;
    },
    277: (module, __unused_webpack_exports, __nccwpck_require__) => {
      var core = __nccwpck_require__(697);
      const elementToComponent = {
        svg: "Svg",
        circle: "Circle",
        clipPath: "ClipPath",
        ellipse: "Ellipse",
        g: "G",
        linearGradient: "LinearGradient",
        radialGradient: "RadialGradient",
        line: "Line",
        path: "Path",
        pattern: "Pattern",
        polygon: "Polygon",
        polyline: "Polyline",
        rect: "Rect",
        symbol: "Symbol",
        text: "Text",
        textPath: "TextPath",
        tspan: "TSpan",
        use: "Use",
        defs: "Defs",
        stop: "Stop",
        mask: "Mask",
        image: "Image",
        foreignObject: "ForeignObject",
      };
      const plugin = () => {
        function replaceElement(path, state) {
          const namePath = path.get("openingElement").get("name");
          if (!namePath.isJSXIdentifier()) return;
          const { name } = namePath.node;
          const component = elementToComponent[name];
          if (component) {
            namePath.replaceWith(core.types.jsxIdentifier(component));
            if (path.has("closingElement")) {
              const closingNamePath = path.get("closingElement").get("name");
              closingNamePath.replaceWith(core.types.jsxIdentifier(component));
            }
            state.replacedComponents.add(component);
            return;
          }
          state.unsupportedComponents.add(name);
          path.remove();
        }
        const svgElementVisitor = {
          JSXElement(path, state) {
            if (
              !path
                .get("openingElement")
                .get("name")
                .isJSXIdentifier({ name: "svg" })
            ) {
              return;
            }
            replaceElement(path, state);
            path.traverse(jsxElementVisitor, state);
          },
        };
        const jsxElementVisitor = {
          JSXElement(path, state) {
            replaceElement(path, state);
          },
        };
        const importDeclarationVisitor = {
          ImportDeclaration(path, state) {
            if (
              path
                .get("source")
                .isStringLiteral({ value: "react-native-svg" }) &&
              !path.get("importKind").hasNode()
            ) {
              state.replacedComponents.forEach((component) => {
                if (
                  path
                    .get("specifiers")
                    .some((specifier) =>
                      specifier.get("local").isIdentifier({ name: component }),
                    )
                ) {
                  return;
                }
                path.pushContainer(
                  "specifiers",
                  core.types.importSpecifier(
                    core.types.identifier(component),
                    core.types.identifier(component),
                  ),
                );
              });
            } else if (path.get("source").isStringLiteral({ value: "expo" })) {
              path.pushContainer(
                "specifiers",
                core.types.importSpecifier(
                  core.types.identifier("Svg"),
                  core.types.identifier("Svg"),
                ),
              );
            } else {
              return;
            }
            if (
              state.unsupportedComponents.size &&
              !path.has("trailingComments")
            ) {
              const componentList = [...state.unsupportedComponents].join(", ");
              path.addComment(
                "trailing",
                ` SVGR has dropped some elements not supported by react-native-svg: ${componentList} `,
              );
            }
          },
        };
        return {
          visitor: {
            Program(path, state) {
              state.replacedComponents = new Set();
              state.unsupportedComponents = new Set();
              path.traverse(svgElementVisitor, state);
              path.traverse(importDeclarationVisitor, state);
            },
          },
        };
      };
      module.exports = plugin;
    },
    679: (module, __unused_webpack_exports, __nccwpck_require__) => {
      var core = __nccwpck_require__(697);
      const defaultTemplate = (variables, { tpl }) => tpl`
${variables.imports};

${variables.interfaces};

const ${variables.componentName} = (${variables.props}) => (
  ${variables.jsx}
);
 
${variables.exports};
`;
      var __defProp = Object.defineProperty;
      var __defProps = Object.defineProperties;
      var __getOwnPropDescs = Object.getOwnPropertyDescriptors;
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
      var __spreadProps = (a, b) => __defProps(a, __getOwnPropDescs(b));
      const tsOptionalPropertySignature = (...args) =>
        __spreadProps(
          __spreadValues({}, core.types.tsPropertySignature(...args)),
          { optional: true },
        );
      const getOrCreateImport = (
        { imports },
        sourceValue,
        importKind = void 0,
      ) => {
        const existing = imports.find(
          (imp2) =>
            imp2.source.value === sourceValue &&
            imp2.importKind === importKind &&
            !imp2.specifiers.some(
              (specifier) => specifier.type === "ImportNamespaceSpecifier",
            ),
        );
        if (existing) return existing;
        const imp = core.types.importDeclaration(
          [],
          core.types.stringLiteral(sourceValue),
        );
        if (importKind !== void 0) {
          imp.importKind = importKind;
        }
        imports.push(imp);
        return imp;
      };
      const tsTypeReferenceSVGProps = (ctx) => {
        if (ctx.opts.native) {
          const identifier2 = core.types.identifier("SvgProps");
          getOrCreateImport(ctx, "react-native-svg", "type").specifiers.push(
            core.types.importSpecifier(identifier2, identifier2),
          );
          return core.types.tsTypeReference(identifier2);
        }
        const identifier = core.types.identifier("SVGProps");
        getOrCreateImport(ctx, ctx.importSource, "type").specifiers.push(
          core.types.importSpecifier(identifier, identifier),
        );
        return core.types.tsTypeReference(
          identifier,
          core.types.tsTypeParameterInstantiation([
            core.types.tsTypeReference(core.types.identifier("SVGSVGElement")),
          ]),
        );
      };
      const tsTypeReferenceSVGRef = (ctx) => {
        const identifier = core.types.identifier("Ref");
        getOrCreateImport(ctx, ctx.importSource).specifiers.push(
          core.types.importSpecifier(identifier, identifier),
        );
        return core.types.tsTypeReference(
          identifier,
          core.types.tsTypeParameterInstantiation([
            core.types.tsTypeReference(core.types.identifier("SVGSVGElement")),
          ]),
        );
      };
      const getJsxRuntimeImport = (cfg) => {
        const specifiers = (() => {
          if (cfg.namespace)
            return [
              core.types.importNamespaceSpecifier(
                core.types.identifier(cfg.namespace),
              ),
            ];
          if (cfg.defaultSpecifier) {
            const identifier = core.types.identifier(cfg.defaultSpecifier);
            return [core.types.importDefaultSpecifier(identifier)];
          }
          if (cfg.specifiers)
            return cfg.specifiers.map((specifier) => {
              const identifier = core.types.identifier(specifier);
              return core.types.importSpecifier(identifier, identifier);
            });
          throw new Error(
            `Specify "namespace", "defaultSpecifier", or "specifiers" in "jsxRuntimeImport" option`,
          );
        })();
        return core.types.importDeclaration(
          specifiers,
          core.types.stringLiteral(cfg.source),
        );
      };
      const defaultJsxRuntimeImport = { source: "react", namespace: "React" };
      const defaultImportSource = "react";
      const getVariables = ({ opts, jsx }) => {
        var _a, _b, _c, _d;
        const interfaces = [];
        const props = [];
        const imports = [];
        const exports = [];
        const ctx = {
          importSource:
            (_a = opts.importSource) != null ? _a : defaultImportSource,
          exportIdentifier: core.types.identifier(opts.state.componentName),
          opts,
          interfaces,
          props,
          imports,
          exports,
        };
        if (opts.jsxRuntime !== "automatic") {
          imports.push(
            getJsxRuntimeImport(
              (_b = opts.jsxRuntimeImport) != null
                ? _b
                : defaultJsxRuntimeImport,
            ),
          );
        }
        if (opts.native) {
          getOrCreateImport(ctx, "react-native-svg").specifiers.push(
            core.types.importDefaultSpecifier(core.types.identifier("Svg")),
          );
        }
        if (opts.titleProp || opts.descProp) {
          const properties = [];
          const propertySignatures = [];
          const createProperty = (attr) =>
            core.types.objectProperty(
              core.types.identifier(attr),
              core.types.identifier(attr),
              false,
              true,
            );
          const createSignature = (attr) =>
            tsOptionalPropertySignature(
              core.types.identifier(attr),
              core.types.tsTypeAnnotation(core.types.tsStringKeyword()),
            );
          if (opts.titleProp) {
            properties.push(createProperty("title"), createProperty("titleId"));
            if (opts.typescript) {
              propertySignatures.push(
                createSignature("title"),
                createSignature("titleId"),
              );
            }
          }
          if (opts.descProp) {
            properties.push(createProperty("desc"), createProperty("descId"));
            if (opts.typescript) {
              propertySignatures.push(
                createSignature("desc"),
                createSignature("descId"),
              );
            }
          }
          const prop = core.types.objectPattern(properties);
          props.push(prop);
          if (opts.typescript) {
            interfaces.push(
              core.types.tsInterfaceDeclaration(
                core.types.identifier("SVGRProps"),
                null,
                null,
                core.types.tSInterfaceBody(propertySignatures),
              ),
            );
            prop.typeAnnotation = core.types.tsTypeAnnotation(
              core.types.tsTypeReference(core.types.identifier("SVGRProps")),
            );
          }
        }
        if (opts.expandProps) {
          const identifier = core.types.identifier("props");
          if (core.types.isObjectPattern(props[0])) {
            props[0].properties.push(core.types.restElement(identifier));
            if (opts.typescript) {
              props[0].typeAnnotation = core.types.tsTypeAnnotation(
                core.types.tsIntersectionType([
                  tsTypeReferenceSVGProps(ctx),
                  props[0].typeAnnotation.typeAnnotation,
                ]),
              );
            }
          } else {
            props.push(identifier);
            if (opts.typescript) {
              identifier.typeAnnotation = core.types.tsTypeAnnotation(
                tsTypeReferenceSVGProps(ctx),
              );
            }
          }
        }
        if (opts.ref) {
          if (props.length === 0) {
            props.push(core.types.identifier("_"));
          }
          const prop = core.types.identifier("ref");
          props.push(prop);
          if (opts.typescript) {
            prop.typeAnnotation = core.types.tsTypeAnnotation(
              tsTypeReferenceSVGRef(ctx),
            );
          }
          const forwardRef = core.types.identifier("forwardRef");
          const ForwardRef = core.types.identifier("ForwardRef");
          getOrCreateImport(ctx, ctx.importSource).specifiers.push(
            core.types.importSpecifier(forwardRef, forwardRef),
          );
          exports.push(
            core.types.variableDeclaration("const", [
              core.types.variableDeclarator(
                ForwardRef,
                core.types.callExpression(forwardRef, [ctx.exportIdentifier]),
              ),
            ]),
          );
          ctx.exportIdentifier = ForwardRef;
        }
        if (opts.memo) {
          const memo = core.types.identifier("memo");
          const Memo = core.types.identifier("Memo");
          getOrCreateImport(ctx, ctx.importSource).specifiers.push(
            core.types.importSpecifier(memo, memo),
          );
          exports.push(
            core.types.variableDeclaration("const", [
              core.types.variableDeclarator(
                Memo,
                core.types.callExpression(memo, [ctx.exportIdentifier]),
              ),
            ]),
          );
          ctx.exportIdentifier = Memo;
        }
        if (
          ((_c = opts.state.caller) == null ? void 0 : _c.previousExport) ||
          opts.exportType === "named"
        ) {
          if (!opts.namedExport) {
            throw new Error(`"namedExport" not specified`);
          }
          exports.push(
            core.types.exportNamedDeclaration(null, [
              core.types.exportSpecifier(
                ctx.exportIdentifier,
                core.types.identifier(opts.namedExport),
              ),
            ]),
          );
          if ((_d = opts.state.caller) == null ? void 0 : _d.previousExport) {
            const previousExportAst = core.template.ast(
              opts.state.caller.previousExport,
            );
            exports.push(
              ...(Array.isArray(previousExportAst)
                ? previousExportAst
                : [previousExportAst]),
            );
          }
        } else {
          exports.push(
            core.types.exportDefaultDeclaration(ctx.exportIdentifier),
          );
        }
        return {
          componentName: opts.state.componentName,
          props,
          interfaces,
          imports,
          exports,
          jsx,
        };
      };
      const plugin = (_, opts) => {
        const template = opts.template || defaultTemplate;
        const plugins = opts.typescript ? ["jsx", "typescript"] : ["jsx"];
        const tpl = core.template.smart({
          plugins,
          preserveComments: true,
        }).ast;
        return {
          visitor: {
            Program(path) {
              const jsx = path.node.body[0].expression;
              const variables = getVariables({ opts, jsx });
              const body = template(variables, { options: opts, tpl });
              path.node.body = Array.isArray(body) ? body : [body];
              path.replaceWith(path.node);
            },
          },
        };
      };
      module.exports = plugin;
    },
    362: (module, __unused_webpack_exports, __nccwpck_require__) => {
      var addJSXAttribute = __nccwpck_require__(64);
      var removeJSXAttribute = __nccwpck_require__(706);
      var removeJSXEmptyExpression = __nccwpck_require__(28);
      var replaceJSXAttributeValue = __nccwpck_require__(175);
      var svgDynamicTitle = __nccwpck_require__(343);
      var svgEmDimensions = __nccwpck_require__(187);
      var transformReactNativeSVG = __nccwpck_require__(277);
      var transformSvgComponent = __nccwpck_require__(679);
      const getAttributeValue = (value) => {
        const literal =
          typeof value === "string" &&
          value.startsWith("{") &&
          value.endsWith("}");
        return { value: literal ? value.slice(1, -1) : value, literal };
      };
      const propsToAttributes = (props) =>
        Object.keys(props).map((name) => {
          const { literal, value } = getAttributeValue(props[name]);
          return { name, literal, value };
        });
      function replaceMapToValues(replaceMap) {
        return Object.keys(replaceMap).map((value) => {
          const { literal, value: newValue } = getAttributeValue(
            replaceMap[value],
          );
          return { value, newValue, literal };
        });
      }
      const plugin = (_, opts) => {
        let toRemoveAttributes = ["version"];
        let toAddAttributes = [];
        if (opts.svgProps) {
          toAddAttributes = [
            ...toAddAttributes,
            ...propsToAttributes(opts.svgProps),
          ];
        }
        if (opts.ref) {
          toAddAttributes = [
            ...toAddAttributes,
            { name: "ref", value: "ref", literal: true },
          ];
        }
        if (opts.titleProp) {
          toAddAttributes = [
            ...toAddAttributes,
            { name: "aria-labelledby", value: "titleId", literal: true },
          ];
        }
        if (opts.descProp) {
          toAddAttributes = [
            ...toAddAttributes,
            { name: "aria-describedby", value: "descId", literal: true },
          ];
        }
        if (opts.expandProps) {
          toAddAttributes = [
            ...toAddAttributes,
            {
              name: "props",
              spread: true,
              position:
                opts.expandProps === "start" || opts.expandProps === "end"
                  ? opts.expandProps
                  : void 0,
            },
          ];
        }
        if (!opts.dimensions) {
          toRemoveAttributes = [...toRemoveAttributes, "width", "height"];
        }
        const plugins = [
          [transformSvgComponent, opts],
          ...(opts.icon !== false && opts.dimensions
            ? [
                [
                  svgEmDimensions,
                  opts.icon !== true
                    ? { width: opts.icon, height: opts.icon }
                    : opts.native
                      ? { width: 24, height: 24 }
                      : {},
                ],
              ]
            : []),
          [
            removeJSXAttribute,
            { elements: ["svg", "Svg"], attributes: toRemoveAttributes },
          ],
          [
            addJSXAttribute,
            { elements: ["svg", "Svg"], attributes: toAddAttributes },
          ],
          removeJSXEmptyExpression,
        ];
        if (opts.replaceAttrValues) {
          plugins.push([
            replaceJSXAttributeValue,
            { values: replaceMapToValues(opts.replaceAttrValues) },
          ]);
        }
        if (opts.titleProp) {
          plugins.push(svgDynamicTitle);
        }
        if (opts.descProp) {
          plugins.push([svgDynamicTitle, { tag: "desc" }, "desc"]);
        }
        if (opts.native) {
          plugins.push(transformReactNativeSVG);
        }
        return { plugins };
      };
      module.exports = plugin;
    },
    697: (module) => {
      module.exports = require("@kmijs/bundler-compiled/compiled/babel/core");
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
  var __webpack_exports__ = __nccwpck_require__(362);
  module.exports = __webpack_exports__;
})();
