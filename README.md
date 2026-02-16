# Inline Pills

An [Obsidian](https://obsidian.md) plugin that renders `{{label}}` syntax as styled inline pill elements in your notes.

## Usage

Wrap any text in double curly braces and it will be rendered as a coloured pill:

```
Status: {{In Progress}}  {{Blocked}}  {{Done}}
```

Each label is assigned a colour deterministically from its text, so the same label always renders with the same colour across all your notes.

## Installation

### Manual

1. Download `main.js`, `manifest.json`, and `styles.css` from the [latest release](../../releases/latest).
2. Copy the files to `<Vault>/.obsidian/plugins/inline-pills/`.
3. Reload Obsidian and enable **Inline Pills** under **Settings → Community plugins**.

## Development

### Prerequisites

- Node.js v18+
- npm

### Setup

```bash
npm install
```

### Dev (watch mode)

```bash
npm run dev
```

This compiles `src/main.ts` to `main.js` and watches for changes. To test, copy `main.js`, `manifest.json`, and `styles.css` into your vault's plugin folder and reload Obsidian.

### Production build

```bash
npm run build
```

### Lint

```bash
npm run lint
```

## Releasing

1. Update `minAppVersion` in `manifest.json` if the release requires a newer Obsidian API.
2. Run `npm version patch` (or `minor` / `major`) — this automatically updates the version in `manifest.json` and `versions.json`.
3. Create a GitHub release with a tag that exactly matches the version (no leading `v`).
4. Attach `main.js`, `manifest.json`, and `styles.css` as release assets.
