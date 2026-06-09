# Knip SCSS scoped package import repro

## Summary

Knip's built-in SCSS compiler appears to treat scoped package imports such as `@scope/pkg/...` as relative files instead of bare package imports.

This minimal repro uses `@fontsource/lato`, which exposes SCSS mixins that are commonly imported from package paths:

```scss
@use '@fontsource/lato/scss/mixins' as Lato;
```

With `compilers.scss: true`, Knip should count `@fontsource/lato` as a used package dependency. Instead, Knip reports it as an unused dependency.

## Reproduction

```sh
npm install
npm run knip
```

Expected: no unused dependency report for `@fontsource/lato`.

Actual:

```txt
Unused dependencies (1)
@fontsource/lato  package.json:10:6
```

## Why This Happens

The built-in SCSS compiler output is equivalent to treating the package import as a relative path:

```js
import _$0 from './@fontsource/lato/scss/mixins.scss';
```

That means the package name is not registered as a dependency usage.

## Expected Behavior

- Scoped package imports matching `@scope/pkg` or `@scope/pkg/...` should be treated as bare package imports.
- Webpack-style package imports matching `~pkg` or `~@scope/pkg` should be normalized by stripping the leading `~`.
- Alias-style imports such as `@/components/Button` should not be treated as scoped packages.

## Suggested Fix

The SCSS compiler could detect scoped package specifiers before applying relative-path expansion:

```ts
const isScopedPackageImport = /^@[^/]+\/[^/]+(?:\/.*)?$/.test(specifier);
const isTildePackageImport = /^~(?:@[^/]+\/[^/]+|[a-zA-Z0-9._-]+)(?:\/.*)?$/.test(specifier);
```

Then:

- for `@scope/pkg/...`, emit a bare import for the original specifier;
- for `~@scope/pkg/...` or `~pkg/...`, strip `~` and emit a bare import;
- keep existing behavior for relative paths, Sass built-ins such as `sass:map`, and aliases such as `@/...`.

Useful regression cases:

```scss
@use '@scope/pkg/styles';
@use '~@scope/pkg/styles';
@use '~pkg/styles';
@use '@/styles/variables';
@use 'sass:map';
@use './local';
```

## Workaround

Projects can use a custom documented compiler hook:

```ts
const styleImportCompiler = (source: string) =>
  [...source.matchAll(/@(use|import|forward)\s+(?:url\()?['"]([^'")]+)['"]/g)]
    .map((match) => match[2].replace(/^~/, ''))
    .filter(
      (specifier) =>
        !specifier.startsWith('.') &&
        !specifier.startsWith('/') &&
        !specifier.startsWith('sass:'),
    )
    .map((specifier) => `import '${specifier}';`)
    .join('\n');

export default {
  compilers: {
    scss: styleImportCompiler,
  },
};
```

This works, but the built-in SCSS compiler could support scoped package imports directly.
