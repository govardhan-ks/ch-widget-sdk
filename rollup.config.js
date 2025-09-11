// rollup.config.js (CommonJS)
const typescript = require('@rollup/plugin-typescript');
const commonjs = require('@rollup/plugin-commonjs');
const { nodeResolve } = require('@rollup/plugin-node-resolve');
const path = require('path');
const fs = require('fs');

const packagesDir = './packages';
let packages = fs.readdirSync(packagesDir);
const only = process.env.PKG;
if (only) {
  packages = packages.filter(p => p === only);
}

module.exports = packages.map(pkg => {
  const pkgDir = path.resolve(packagesDir, pkg);
  const pkgJson = JSON.parse(
    fs.readFileSync(path.join(pkgDir, 'package.json'))
  );

  // Default entry = src/index.ts, React supports TSX
  let input = path.join(pkgDir, 'src/index.ts');
  if (pkg === 'react') {
    const tsxPath = path.join(pkgDir, 'src/index.tsx');
    if (fs.existsSync(tsxPath)) input = tsxPath;
  }

  const externals = new Set([
    ...Object.keys(pkgJson.peerDependencies || {}),
    ...Object.keys(pkgJson.dependencies || {}),
  ]);
  const external = id => {
    // Exact matches or subpath imports like "react/jsx-runtime"
    for (const dep of externals) {
      if (id === dep || id.startsWith(dep + '/')) return true;
    }
    return false;
  };

  return {
    input,
    output: [
      {
        file: path.join(pkgDir, 'dist/index.esm.js'),
        format: 'esm',
        sourcemap: true,
        exports: 'named',
      },
      {
        file: path.join(pkgDir, 'dist/index.cjs.js'),
        format: 'cjs',
        sourcemap: true,
        exports: 'named',
      },
    ],
    plugins: [
      nodeResolve({ extensions: ['.mjs', '.js', '.json', '.ts', '.tsx'] }),
      commonjs(),
      typescript({
        tsconfig: path.join(pkgDir, 'tsconfig.json'),
        declaration: true,
        declarationDir: path.join(pkgDir, 'dist/types'),
        rootDir: path.join(pkgDir, 'src'),
        exclude: ['**/__tests__'],
      }),
    ],
    external,
  };
});
