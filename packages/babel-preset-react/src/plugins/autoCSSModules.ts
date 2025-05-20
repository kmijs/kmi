import { extname } from 'node:path'
import type * as Babel from '@kmijs/bundler-compiled/compiled/babel/core'
import * as t from '@kmijs/bundler-compiled/compiled/babel/types'

const CSS_EXT_NAMES = ['.css', '.less', '.sass', '.scss', '.stylus', '.styl']

export default function () {
  return {
    visitor: {
      ImportDeclaration(path: Babel.NodePath<t.ImportDeclaration>) {
        const {
          specifiers,
          source,
          source: { value },
        } = path.node
        if (specifiers.length && CSS_EXT_NAMES.includes(extname(value))) {
          source.value = `${value}?modules`
        }
      },

      // e.g.
      // const styles = await import('./index.less');
      VariableDeclarator(path: Babel.NodePath<t.VariableDeclarator>) {
        const { node } = path
        if (
          t.isAwaitExpression(node.init) &&
          t.isCallExpression(node.init.argument) &&
          t.isImport(node.init.argument.callee) &&
          node.init.argument.arguments.length === 1 &&
          t.isStringLiteral(node.init.argument.arguments[0]) &&
          CSS_EXT_NAMES.includes(extname(node.init.argument.arguments[0].value))
        ) {
          node.init.argument.arguments[0].value = `${node.init.argument.arguments[0].value}?modules`
        }
      },
    },
  }
}
