## ch-widget-sdk

Build and publish three framework-specific SDK packages plus a core:

- widget-sdk-core
- widget-sdk-react
- widget-sdk-angular
- widget-sdk-vue

### Install (consumers)
- React: `npm install widget-sdk-react`
- Angular: `npm install widget-sdk-angular`
- Vue 3: `npm install widget-sdk-vue`

### Build (maintainers)
- Build all packages:
```bash
npx rollup -c
```
- Build one package:
```bash
PKG=react npx rollup -c
# or PKG=angular / PKG=vue / PKG=core
```

### Version and publish (independent versions)
1) Bump versions (choose per package):
```bash
npx lerna version
git push --follow-tags
```
2) Publish changed packages:
```bash
npx lerna publish from-package
```

To publish only a specific package:
```bash
npx lerna publish from-package --scope widget-sdk-react
```
