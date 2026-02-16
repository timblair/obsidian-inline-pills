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
  main.ts              # Plugin entry point and lifecycle (onload, post-processor registration)
  editor-extension.ts  # CodeMirror 6 ViewPlugin for Live Preview rendering
  colour.ts            # Hash → HSL → RGB → hex utilities, shared constants, createPillElement()
styles.css             # .inline-pill styles
manifest.json          # Plugin metadata
```

### Suggested structure as the plugin grows

```
src/
  main.ts              # Plugin entry point and lifecycle only
  editor-extension.ts  # CM6 ViewPlugin for Live Preview
  colour.ts            # Colour utilities and pill DOM factory
  settings.ts          # Settings interface, defaults, and settings tab
```

## Plugin mechanics

Pills are rendered in two contexts, both using `createPillElement(label)` from `colour.ts`:

### Reading view (`main.ts`)

A `MarkdownPostProcessor` registered in `onload()`:

1. Checks if the rendered element contains `{{`.
2. Recursively finds all text nodes (via `findTextNode`) containing `{{`.
3. Replaces `{{label}}` patterns in the parent element's `innerHTML` with `createPillElement(label).outerHTML`.

### Live Preview / editing view (`editor-extension.ts`)

A CodeMirror 6 `ViewPlugin` registered via `this.registerEditorExtension()`:

1. On each document change, cursor move, or viewport change, scans visible ranges for `{{label}}` patterns.
2. For each match, checks whether any cursor or selection overlaps the range.
3. If the cursor is **outside** the range, replaces it with a `PillWidget` (renders via `createPillElement`).
4. If the cursor is **inside** the range, the raw `{{label}}` text is shown for editing.

### Shared colour utilities (`colour.ts`)

- `getHash(str)` → deterministic number from label text
- `hashToHex(hash, saturation, lightness)` → hex colour string
- `createPillElement(label)` → styled `<span class="inline-pill">` element
- `PILL_DARK: [0.5, 0.35]` — background colour (saturation, lightness)
- `PILL_LIGHT: [0.9, 0.9]` — foreground colour (saturation, lightness)

## Manifest rules (`manifest.json`)

- `id`: `inline-pills` — never change after release.
- `version`: SemVer `x.y.z`.
- `minAppVersion`: keep accurate when using newer Obsidian APIs.
- `isDesktopOnly`: currently `false` — keep it that way; avoid Node/Electron APIs.

## Versioning & releases

- Bump version via `npm version <patch|minor|major>` — this runs `version-bump.mjs` automatically, updating `manifest.json` and `versions.json`, and creates a git tag.
- Push both the commit and the tag: `git push && git push --tags`.
- GitHub Actions (`.github/workflows/release.yml`) will trigger on the tag push, build the plugin, and create a **draft** GitHub release with `main.js`, `manifest.json`, and `styles.css` attached.
- Edit the draft release on GitHub to add release notes, then publish it.
- The release tag must exactly match the version in `manifest.json`. **No leading `v`.**
- Ensure "Read and write permissions" is enabled under **GitHub → Settings → Actions → General → Workflow permissions**.

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

## Git workflow

- **Always work in a feature branch** — never commit directly to `main`. Create a branch for each piece of work: `git checkout -b <feature-name>`.
- **Never commit until work is verified** — do not commit changes until the user has confirmed the feature is working correctly, or has explicitly asked you to commit.
- Merge to `main` only when the user instructs it.

## Agent do/don't

**Do**
- Keep colour generation deterministic — the same label must always produce the same colour.
- Use `createPillElement(label)` from `colour.ts` as the single source of truth for pill DOM creation.
- Keep `PILL_DARK` and `PILL_LIGHT` constants in `colour.ts` — never duplicate them elsewhere.
- Use `this.registerMarkdownPostProcessor` for Reading view post-processing.
- Use `this.registerEditorExtension` for Live Preview (CM6) extensions.
- Write idempotent processing — reloading the plugin should not double-process already-rendered pills.
- Use `this.register*` helpers for anything needing cleanup.
- When modifying the CM6 extension, always rebuild (`npm run build`) and reload Obsidian to test — changes to `editor-extension.ts` are not reflected until `main.js` is rebuilt.
- Use `createEl()`, `createDiv()`, `createSpan()` Obsidian helpers for DOM construction in preference to `innerHTML`/`outerHTML`.
- Use CSS classes and Obsidian CSS variables for styling where possible. Inline styles are acceptable only for dynamically computed values (e.g. per-label colours).
- Use `async`/`await` over promise chains.
- Use `const`/`let`, never `var`.
- Use `getActiveViewOfType()` instead of `workspace.activeLeaf` if editor access is needed.

**Don't**
- Introduce network calls or external dependencies.
- Commit `main.js`, `node_modules/`, or `.hotreload`.
- Change the plugin `id` in `manifest.json`.
- Use `console.log` in production code — remove debug logging before release.
- Duplicate pill DOM creation logic — always use `createPillElement()`.
- Mark `@codemirror/*` packages as bundled dependencies — they must remain external (provided by Obsidian at runtime).
- Use Node.js or Electron APIs (`fs`, `crypto`, `os`, etc.) — the plugin must remain mobile-compatible (`isDesktopOnly: false`).
- Use lookbehind regex patterns — not supported on iOS.
- Add default hotkeys to commands — this conflicts with user-defined shortcuts.
- Obfuscate code or introduce client-side tracking/analytics.
- Add automatic update mechanisms outside of Obsidian's plugin system.

## Community plugin submission checklist

Before submitting to the Obsidian community plugin list:

- [ ] `manifest.json` description: starts with an action verb, ends with a period, under 250 chars, no emoji, no "This is a plugin", correct capitalisation ("Obsidian", "Markdown", etc.)
- [ ] `manifest.json` has no `fundingUrl` unless donations are accepted.
- [ ] `minAppVersion` reflects the earliest Obsidian version the plugin genuinely supports.
- [ ] All sample/placeholder code removed.
- [ ] No `console.log` debug output in production builds.
- [ ] LICENSE file present with correct attribution.
- [ ] README documents any remote service usage, file access beyond vault, or payment requirements.

## References

- Obsidian sample plugin: https://github.com/obsidianmd/obsidian-sample-plugin
- API documentation: https://docs.obsidian.md
- Developer policies: https://docs.obsidian.md/Developer+policies
- Plugin guidelines: https://docs.obsidian.md/Plugins/Releasing/Plugin+guidelines
