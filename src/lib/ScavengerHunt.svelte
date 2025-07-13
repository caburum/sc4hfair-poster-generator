<script>
	import ShortUniqueId from 'short-unique-id';
	import ScavengerHuntPoster from './ScavengerHuntPoster.svelte';

	import '../pages.css';

	const uid = new ShortUniqueId({
		dictionary: 'alphanum_lower',
		length: 8,
	});

	let pages = $state(10);

	let ids = $derived(Array.from({ length: pages }, () => uid.rnd()));
</script>

<div class="controls">
	<div>
		<label for="pages"># pages:</label>
		<input id="pages" type="number" bind:value={pages} min="1" max="100" />
	</div>

	<button onclick={() => window.print()}>print</button>
</div>

<div class="pages">
	{#each ids as code}
		<!-- we no longer include locations and just use generics -->
		<ScavengerHuntPoster {code} location="" />
	{/each}
</div>
