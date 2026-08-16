# Dynamic import keys repro

This is a minimal standalone project outside the Valibot workspace. It compares
two dynamic import cases:

1. a local directory that the bundler can scan;
2. a subpath of the published `@valibot/i18n` package.

## Run

```bash
pnpm install
pnpm run check
pnpm run build:vite
pnpm run build:rsbuild
```

The regular build commands compile `src/index.ts`. The import key is provided
at runtime through a query parameter:

```ts
const lang = new URLSearchParams(location.search).get('lang') ?? 'de';

import(`./locales/${lang}.ts`);
```

The `./locales/` directory is statically visible, so Vite and Rsbuild can find
`de.ts` and `ru.ts`, create async chunks for them, and select the appropriate
chunk at runtime. After building, the app can be opened with `?lang=ru`.

## `@valibot/i18n` probe

`src/valibot-import.ts` contains the same pattern for a bare package import:

```ts
import(`@valibot/i18n/${lang}`);
```

Run the probe separately:

```bash
pnpm run probe:valibot:vite
pnpm run probe:valibot:rsbuild
```

Result:

- Vite completes the build, but leaves the package import dynamic in the
  output and does not create discovered locale chunks. In a regular browser
  output, this bare specifier is not a URL, so the call fails during module
  resolution unless the application configures an import map separately;
- Rsbuild fails to resolve `@valibot/i18n` as a context module.

The relevant Rsbuild error is:

```text
File: ./src/valibot-import.ts:1:1
  × Module not found: Can't resolve '@valibot/i18n'
```

The reason is that the local import has a statically visible directory context
(`./locales/`), while the package import only exposes the package name. The
current `@valibot/i18n` `exports` map lists concrete subpaths such as `./de`
and `./ru`, but does not describe a wildcard/context for `./${lang}`. Therefore
the bundler cannot reliably enumerate the possible package files from this
expression.

This does not mean that every dynamic import with a variable fails. Webpack
and Rspack support context modules when they can infer the directory and file
set from the expression. The mechanism is described in the [Webpack dependency
management documentation](https://webpack.js.org/guides/dependency-management/)
and the [Rspack context replacement documentation](https://rspack.rs/plugins/webpack/context-replacement-plugin).
For package subpaths, both the bundler's context support and the package's
public `exports` pattern must be compatible.

A practical application-level workaround is an explicit loader map:

```ts
const loaders = {
  de: () => import('@valibot/i18n/de'),
  ru: () => import('@valibot/i18n/ru'),
};

const locale = await loaders[lang]();
```

The map makes each package subpath statically visible to the bundler. This
repro intentionally demonstrates the limitation of a templated package import
rather than fixing it.
