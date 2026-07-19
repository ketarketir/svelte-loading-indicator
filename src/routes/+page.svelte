<script lang="ts">
	import { useTopLoader } from '$lib/index.js';

	const loader = useTopLoader();
</script>

<h1>sveltekit-toploader demo</h1>
<p>Navigate to another route, or trigger the bar manually:</p>

<button onclick={() => loader.start()}>Start</button>
<button onclick={() => loader.setProgress(0.5)}>Set 50%</button>
<button onclick={() => loader.done()}>Done</button>

<a href="/about">Go to /about</a>

