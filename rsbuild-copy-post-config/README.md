# Rsbuild `POST` copy asset repro

Minimal reproduction for inconsistent `rsbuild dev` behavior:

- `POST /public-config.json` from `server.publicDir` returns `200`
- `POST /copy-config.json` from `output.copy` returns `404`

Both files are requested by the browser from the same dev server when you open the page.

## Run

```sh
pnpm install
pnpm dev
```

Open http://127.0.0.1:4171 and check DevTools Network:

```text
POST /public-config.json -> 200
POST /copy-config.json   -> 404
```

## Curl check

```sh
curl -i -X POST http://127.0.0.1:4171/public-config.json
```

```sh
curl -i -X POST http://127.0.0.1:4171/copy-config.json
```

The copied file is available via `GET /copy-config.json`, but not via `POST /copy-config.json`.
