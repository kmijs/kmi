const { join } = require('node:path')
const {picocolors, fsExtra } = require('@kmijs/shared')

const base = join(__dirname, '../bundles/webpack/');
const files = require(join(base, 'packages/deepImports.json'));

files.forEach((file) => {
  const name = file.split('/').slice(-1)[0];
  console.log(picocolors.green(`Write packages/${name}.js`));
  fsExtra.writeFileSync(
    join(base, 'packages', `${name}.js`),
    `module.exports = require('./').${name};\n`,
    'utf-8',
  );
});
