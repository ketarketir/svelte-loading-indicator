<script lang="ts">
	import { beforeNavigate, afterNavigate, onNavigate } from '$app/navigation';
	import { topLoader } from './toploader.svelte.js';
	import type { TopLoaderProps } from './types.js';

	let {
		color = '#29d',
		initialPosition = 0.08,
		crawlSpeed = 200,
		height = 3,
		crawl = true,
		showSpinner = true,
		easing = 'ease',
		speed = 200,
		shadow,
		template,
		zIndex = 1600,
		showAtBottom = false,
		showForHashAnchor = true,
		nonce
	}: TopLoaderProps = $props();

	const defaultTemplate =
		'<div class="bar" role="bar"><div class="peg"></div></div>' +
		'<div class="spinner" role="spinner"><div class="spinner-icon"></div></div>';

	const resolvedTemplate = $derived(template ?? defaultTemplate);

	const resolvedShadow = $derived(
		shadow === false ? 'none' : (shadow ?? `0 0 10px ${color}, 0 0 5px ${color}`)
	);

	// Keep the singleton controller's timing/behaviour settings in sync with props.
	$effect(() => {
		topLoader.configure({
			initialPosition,
			crawlSpeed,
			crawl,
			speed,
			easing
		});
	});

	function isSamePageHashNavigation(
		navigation: Parameters<Parameters<typeof beforeNavigate>[0]>[0]
	): boolean {
		const from = navigation.from?.url;
		const to = navigation.to?.url;
		if (!from || !to) return false;
		return (
			navigation.type === 'link' &&
			from.pathname === to.pathname &&
			from.search === to.search &&
			from.hash !== to.hash
		);
	}

	beforeNavigate((navigation) => {
		// 'leave' = user is navigating away from the app entirely (closing tab, etc.)
		if (navigation.type === 'leave') return;

		// Skip same-page hash-only navigations (e.g. <a href="#section">) if disabled.
		if (!showForHashAnchor && isSamePageHashNavigation(navigation)) return;

		topLoader.start();
	});

	afterNavigate(() => {
		topLoader.done();
	});

	// Ensures the bar also completes for view-transition based navigations
	// and doesn't get stuck if afterNavigate is delayed by a transition.
	onNavigate(() => {
		return () => {
			topLoader.done();
		};
	});
</script>

{#if topLoader.visible}
	<div
		class="stl-toploader"
		class:stl-bottom={showAtBottom}
		class:stl-no-spinner={!showSpinner}
		style:--stl-color={color}
		style:--stl-height={`${height}px`}
		style:--stl-shadow={resolvedShadow}
		style:--stl-speed={`${speed}ms`}
		style:--stl-easing={easing}
		style:--stl-z={zIndex}
		style:--stl-progress={topLoader.progress}
	>
		{@html resolvedTemplate}
	</div>
{/if}

<style>
	:global(.stl-toploader) {
		pointer-events: none;
	}

	:global(.stl-toploader .bar) {
		position: fixed;
		top: 0;
		left: 0;
		width: calc(var(--stl-progress, 0) * 100%);
		height: var(--stl-height, 3px);
		background: var(--stl-color, #29d);
		z-index: var(--stl-z, 1600);
		transition: width var(--stl-speed, 200ms) var(--stl-easing, ease);
	}

	:global(.stl-toploader.stl-bottom .bar) {
		top: auto;
		bottom: 0;
	}

	:global(.stl-toploader .peg) {
		display: block;
		position: absolute;
		right: 0;
		width: 100px;
		height: 100%;
		box-shadow: var(--stl-shadow, none);
		opacity: 1;
		transform: rotate(3deg) translate(0, -4px);
	}

	:global(.stl-toploader .spinner) {
		display: block;
		position: fixed;
		z-index: var(--stl-z, 1600);
		top: 15px;
		right: 15px;
	}

	:global(.stl-toploader.stl-bottom .spinner) {
		top: auto;
		bottom: 15px;
	}

	:global(.stl-toploader.stl-no-spinner .spinner) {
		display: none;
	}

	:global(.stl-toploader .spinner-icon) {
		width: 18px;
		height: 18px;
		box-sizing: border-box;
		border: solid 2px transparent;
		border-top-color: var(--stl-color, #29d);
		border-left-color: var(--stl-color, #29d);
		border-radius: 50%;
		animation: stl-spin 400ms linear infinite;
	}

	@keyframes stl-spin {
		0% {
			transform: rotate(0deg);
		}
		100% {
			transform: rotate(360deg);
		}
	}
</style>

