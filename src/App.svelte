<script>
	import GetTheApp from './lib/GetTheApp.svelte';
	import ScavengerHunt from './lib/ScavengerHunt.svelte';

	const modes = {
		'get the app': GetTheApp,
		'scavenger hunt': ScavengerHunt,
	};
	/** @type {keyof typeof modes | null} */
	let mode = $state(null);

	let Component = $derived(modes[mode] || null);
</script>

<div class="controls">
	<h1>sc4hfair-poster-generator</h1>

	<div>
		<label for="mode">Mode:</label>
		<select id="mode" bind:value={mode}>
			{#each Object.keys(modes) as key}
				<option value={key}>{key}</option>
			{/each}
		</select>
	</div>
</div>

<Component />
