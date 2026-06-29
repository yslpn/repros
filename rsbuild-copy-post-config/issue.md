# [Bug]: `rsbuild dev` handles `POST` inconsistently for `server.publicDir` and `output.copy` assets

### Version

```sh
System:
  OS: macOS 26.5.1
  CPU: (14) arm64 Apple M4 Pro
  Memory: 202.42 MB / 24.00 GB
  Shell: 5.9 - /bin/zsh
Browsers:
  Chrome: 149.0.7827.200
  Firefox: 152.0.3
  Safari: 26.5
npmPackages:
  @rsbuild/core: 2.1.1 => 2.1.1
```

### Details

`rsbuild dev` handles static asset `POST` requests differently depending on whether the file comes from `server.publicDir` or `output.copy`.

The reproduction starts a single dev server and opens a page that requests two JSON files:

- `POST /public-config.json`, served from `server.publicDir`
- `POST /copy-config.json`, served from `output.copy`

The public-dir asset returns `200`, while the copied asset returns `404`.

This looks inconsistent because both files are static JSON assets exposed by the same dev server. Either both asset sources should support `POST`, or both should reject it consistently. Since `server.publicDir` currently supports `POST`, I would expect `output.copy` assets to behave the same way in dev.

Expected requests from the page:

```sh
server.publicDir POST /public-config.json -> 200 { "source": "server.publicDir" }
output.copy      POST /copy-config.json   -> 404 This page could not be found
```

### Reproduce link

https://github.com/yslpn/repros/tree/master/rsbuild-copy-post-config

### Reproduce Steps

1. Clone the reproduction repository.
2. Go to the repro folder:

```sh
cd rsbuild-copy-post-config
```

3. Install dependencies:

```sh
pnpm install
```

4. Start the dev server:

```sh
pnpm dev
```

5. Open http://127.0.0.1:4171.

The page sends two `POST` requests:

- `/public-config.json` is served from `server.publicDir` and returns `200`
- `/copy-config.json` is served from `output.copy` and returns `404`

Manual curl check:

```sh
curl -i -X POST http://127.0.0.1:4171/public-config.json
```

```sh
curl -i -X POST http://127.0.0.1:4171/copy-config.json
```
