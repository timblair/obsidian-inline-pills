# Inline Pills — Obsidian Plugin

## Project overview

Inline Pills is an Obsidian community plugin that converts `{{label}}` syntax in markdown into styled inline pill elements. Each label is rendered as a coloured `<span>` with a background and foreground colour derived deterministically from the label text via a hash function.

- Target: Obsidian Community Plugin (TypeScript → bundled JavaScript).
- Entry point: `src/main.ts` compiled to `main.js` and loaded by Obsidian.
- Required release artifacts: `main.js`, `manifest.json`, and `styles.css`.

## Environment & tooling

- Node.js: LTS (Node 18+ recommended).
- Package manager: **npm**.
- Bundler: **esbuild** (`esbuild.config.mjs`).

### Install

```bash
npm install
```

### Dev (watch)

```bash
npm run dev
```

### Production build

```bash
npm run build
```

### Lint

```bash
npm run lint
```

## File & folder conventions

- Source lives in `src/`. Keep `main.ts` focused on plugin lifecycle.
- **Do not commit build artifacts**: never commit `node_modules/`, `main.js`, `.hotreload`, or `*.map` files.

### Current structure

```
src/
  main.ts        # Plugin entry point, post-processor registration, colour logic
styles.css       # .inline-pill styles
manifest.json    # Plugin metadata
```

### Suggested structure as the plugin grows

```
src/
  main.ts        # Plugin entry point and lifecycle only
  processor.ts   # Markdown post-processor logic
  colour.ts      # Hash → HSL → RGB → hex colour utilities
  settings.ts    # Settings interface, defaults, and settings tab
```

## Plugin mechanics

The core behaviour is a `MarkdownPostProcessor` registered in `onload()`:

1. Checks if the rendered element contains `{{`.
2. Recursively finds all text nodes (via `findTextNode`) containing `{{`.
3. For each text node, replaces `{{label}}` patterns in the parent element's `innerHTML` with a styled `<span class="inline-pill">`.
4. Background and foreground colours are generated via `hashToHex(getHash(label), saturation, lightness)`.

**Colour constants** (in `main.ts`):
- `dark = [0.5, 0.35]` — used for background colour (saturation, lightness)
- `light = [0.9, 0.9]` — used for foreground colour (saturation, lightness)

## Manifest rules (`manifest.json`)

- `id`: `inline-pills` — never change after release.
- `version`: SemVer `x.y.z`.
- `minAppVersion`: keep accurate when using newer Obsidian APIs.
- `isDesktopOnly`: currently `false` — keep it that way; avoid Node/Electron APIs.

## Versioning & releases

- Bump version via `npm version <patch|minor|major>` — this runs `version-bump.mjs` automatically, updating `manifest.json` and `versions.json`.
- Create a GitHub release whose tag exactly matches the version in `manifest.json`. **No leading `v`.**
- Attach `main.js`, `manifest.json`, and `styles.css` as release assets.

## Testing

Manual install for local testing:

```
<Vault>/.obsidian/plugins/inline-pills/
  main.js
  manifest.json
  styles.css
```

Reload Obsidian and enable the plugin under **Settings → Community plugins**.

To test the plugin, add `{{SomeLabel}}` to any note. The text should render as a coloured inline pill. The same label text should always produce the same colour.

## Coding conventions

- TypeScript with strict checks enabled (see `tsconfig.json`).
- Prefer `async/await` over promise chains.
- Use `this.register*` helpers for all listeners and intervals so they clean up safely when the plugin is unloaded.
- Avoid Node/Electron APIs to maintain mobile compatibility.
- Keep `main.ts` minimal — delegate feature logic to separate modules as the codebase grows.

## Security & privacy

- This plugin operates entirely locally — no network requests, no telemetry, no external services.
- Never introduce network calls without a clear user-facing reason, explicit opt-in, and documentation.
- Read/write only what is necessary within the vault.

## Agent do/don't

**Do**
- Keep colour generation deterministic — the same label must always produce the same colour.
- Use `this.registerMarkdownPostProcessor` for all post-processing; don't manipulate the DOM outside of it.
- Write idempotent processing — reloading the plugin should not double-process already-rendered pills.
- Use `this.register*` helpers for anything needing cleanup.

**Don't**
- Introduce network calls or external dependencies.
- Commit `main.js`, `node_modules/`, or `.hotreload`.
- Change the plugin `id` in `manifest.json`.
- Use `console.log` in production code — remove debug logging before release.

## References

- Obsidian sample plugin: https://github.com/obsidianmd/obsidian-sample-plugin
- API documentation: https://docs.obsidian.md
- Developer policies: https://docs.obsidian.md/Developer+policies
- Plugin guidelines: https://docs.obsidian.md/Plugins/Releasing/Plugin+guidelines
