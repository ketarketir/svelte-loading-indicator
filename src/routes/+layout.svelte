<script lang="ts">
	import './layout.css';
	import TopLoader from '$lib/TopLoader.svelte';
	const { children } = $props();
</script>

<TopLoader color="#7c3aed" showSpinner={true} height={3} />

{@render children()}
