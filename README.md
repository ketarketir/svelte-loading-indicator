# svelte-loading-indicator

A page-loading progress bar for **SvelteKit**, built natively with **Svelte 5 runes**.
Feature-parity port of [`nextjs-toploader`](https://www.npmjs.com/package/nextjs-toploader) — same props, same default look, same `useTopLoader()`-style API — but wired into SvelteKit's own navigation lifecycle (`beforeNavigate` / `afterNavigate`) instead of patching History APIs.

- 🪶 Zero runtime dependencies (no `nprogress`, no `prop-types`)
- ⚡ Svelte 5 runes (`$state`, `$derived`, `$effect`) — fully reactive, no stores/subscriptions needed
- 🎯 Auto-starts/completes on every SvelteKit navigation (link clicks, `goto()`, popstate, form navigations)
- 🛠️ Manual control via `useTopLoader()` for custom loading states
- 🎨 Fully customizable: color, height, shadow, spinner, custom HTML template, position (top/bottom)

## Install

```bash
pnpm add svelte-loading-indicator
```

Requires `svelte@^5.0.0` and `@sveltejs/kit@^2.0.0` (peer dependencies).

## Usage

Add `<TopLoader />` once, in your root layout:

```svelte
<!-- src/routes/+layout.svelte -->
<script lang="ts">
	import TopLoader from 'svelte-loading-indicator';
	let { children } = $props();
</script>

<TopLoader />

{@render children()}
```

That's it — the bar will automatically start on navigation and complete when the new page has loaded.

## Props

If no props are passed, this is the default configuration:

```svelte
<TopLoader
	color="#29d"
	initialPosition={0.08}
	crawlSpeed={200}
	height={3}
	crawl={true}
	showSpinner={true}
	easing="ease"
	speed={200}
	shadow="0 0 10px #29d,0 0 5px #29d"
	zIndex={1600}
	showAtBottom={false}
	showForHashAnchor={true}
/>
```

| Prop                | Type              | Default                                    | Description                                                                    |
| ------------------- | ----------------- | ------------------------------------------ | ------------------------------------------------------------------------------ |
| `color`             | `string`          | `"#29d"`                                   | Color of the bar. Accepts any valid CSS `background` value.                    |
| `initialPosition`   | `number`          | `0.08`                                     | Initial position of the bar, as a percentage (`0.08` = 8%).                    |
| `crawlSpeed`        | `number`          | `200`                                      | Increment delay, in ms, for the auto-crawl behaviour.                          |
| `height`            | `number`          | `3`                                        | Height of the bar, in pixels.                                                  |
| `crawl`             | `boolean`         | `true`                                     | Whether the bar auto-increments while a navigation is in flight.               |
| `showSpinner`       | `boolean`         | `true`                                     | Show the spinner alongside the bar.                                            |
| `easing`            | `string`          | `"ease"`                                   | CSS easing function used for the bar's transition.                             |
| `speed`             | `number`          | `200`                                      | Animation speed, in ms, for the bar's transition.                              |
| `shadow`            | `string \| false` | `` `0 0 10px ${color},0 0 5px ${color}` `` | Box-shadow for the bar's leading edge. Pass `false` to disable.                |
| `template`          | `string`          | see below                                  | Custom HTML for the bar. Must include an element with class `bar`.             |
| `zIndex`            | `number`          | `1600`                                     | Stacking order of the bar and spinner.                                         |
| `showAtBottom`      | `boolean`         | `false`                                    | Render the bar (and spinner) at the bottom of the viewport instead of the top. |
| `showForHashAnchor` | `boolean`         | `true`                                     | Whether same-page hash links (e.g. `<a href="#section">`) trigger the bar.     |
| `nonce`             | `string`          | `undefined`                                | Accepted for prop-parity with `nextjs-toploader`; see CSP note below.          |

Default `template`:

```html
<div class="bar" role="bar"><div class="peg"></div></div>
<div class="spinner" role="spinner"><div class="spinner-icon"></div></div>
```

> **CSP note:** Svelte compiles the bar's styling into a scoped `<style>` block at build time (not inline `style=""` attributes injected at runtime for the CSS rules themselves), so most CSP setups won't need a nonce here at all. The `nonce` prop is kept only so existing `nextjs-toploader` configs port over without a type error.

## Manual control — `useTopLoader()`

For programmatic control (e.g. during a long-running client-side action that isn't a route navigation):

```svelte
<script lang="ts">
	import { useTopLoader } from 'svelte-loading-indicator';

	const loader = useTopLoader();

	async function handleSubmit() {
		loader.start();
		await doSomethingSlow();
		loader.done();
	}
</script>

<button onclick={() => loader.start()}>Start</button>
<button onclick={() => loader.setProgress(0.5)}>Set Progress</button>
<button onclick={handleSubmit}>Submit</button>
```

### `TopLoaderInstance` API

| Method                 | Description                                                                |
| ---------------------- | -------------------------------------------------------------------------- |
| `start()`              | Starts the progress bar.                                                   |
| `done(force?)`         | Completes the bar. Pass `true` to force completion even if not started.    |
| `remove()`             | Immediately removes the bar from the DOM.                                  |
| `setProgress(n)`       | Manually sets progress, `0.0`–`1.0`.                                       |
| `inc(amount?)`         | Increments progress by `amount`, or a sensible auto amount if omitted.     |
| `trickle()`            | Adds a small automatic increment (alias for `inc()`).                      |
| `isStarted()`          | Returns whether the bar has been started.                                  |
| `isRendered()`         | Returns whether the bar is currently rendered.                             |
| `progress` / `visible` | Reactive readonly fields — read directly in your own components if needed. |

## How it works

Unlike the React version (which patches `history.pushState` to detect client-side navigation), this library hooks directly into SvelteKit's built-in navigation lifecycle:

- `beforeNavigate` → starts the bar
- `afterNavigate` → completes the bar
- `onNavigate` → ensures the bar also resolves cleanly around view-transition-based navigations

No DOM patching, no extra event listeners on anchor tags.

## Development

```bash
pnpm install
pnpm run dev        # run the demo app in src/routes
pnpm run check       # type-check
pnpm run package      # build the publishable dist/ folder
```

## Publishing to npm

### Manual

```bash
pnpm run package
pnpm publish
```

`package.json` is already configured with `files`, `exports`, and `svelte`/`types` fields pointing at `dist/`, and passes `publint`. Update the `name`, `repository`, `homepage`, and `bugs` fields in `package.json` before publishing under your own npm account.

### Automatic — GitHub Actions

This repo includes `.github/workflows/publish.yml`, which auto-publishes to npm on every push to `main` using **pnpm v11**. It:

1. Installs deps with `pnpm install --frozen-lockfile`
2. Type-checks (`svelte-check`) and builds (`svelte-package` + `publint`)
3. Compares the `version` in `package.json` against the version currently published on npm
4. If it changed, runs `pnpm publish --provenance` and pushes a `vX.Y.Z` git tag — if it's unchanged, the run finishes without publishing (safe to push docs/README-only commits)

**Setup:**

1. Generate an npm **Automation** access token: [npmjs.com](https://www.npmjs.com) → your avatar → _Access Tokens_ → _Generate New Token_ → _Automation_.
2. In your GitHub repo: _Settings_ → _Secrets and variables_ → _Actions_ → _New repository secret_ → name it `NPM_TOKEN`, paste the token.
3. Bump `"version"` in `package.json` (e.g. `npm version patch` / `pnpm version patch`) whenever you want a new release, then push to `main`.

The workflow requests npm provenance (`--provenance`), which links the published package back to this exact commit/workflow run on npm's package page — no extra setup needed beyond the `id-token: write` permission already declared in the workflow.

## License

MIT
