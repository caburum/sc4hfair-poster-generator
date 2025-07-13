<script>
	import QRCode from 'qrcode-svg';
	import ShortUniqueId from 'short-unique-id';
	import { untrack } from 'svelte';

	import input8_5x11 from '../assets/8_5x11 input.svg?raw';
	import input11x17 from '../assets/11x17 input.svg?raw';
	import inputLarge from '../assets/extra_large input.svg?raw';
	import { generatePDF } from './pdfGenerator.js';

	const templates = {
		'8.5x11': input8_5x11,
		'11x17': input11x17,
		'extra large': inputLarge,
	};

	/** @type {keyof typeof templates} */
	let template = $state('8.5x11');
	let pages = $state(10);

	const parser = new DOMParser();
	let svg = $derived(parser.parseFromString(templates[template], 'image/svg+xml').querySelector('svg'));

	const uid = new ShortUniqueId({
		dictionary: 'alphanum_upper',
		length: 5,
		// counter: Math.floor((Date.now() - new Date(2025, 1, 1, 0, 0, 0, 0).getTime()) / 1000),
	});

	let usedIds = $state(localStorage.getItem('usedIds') ? localStorage.getItem('usedIds')?.split(',') : []);
	$effect(() => {
		localStorage.setItem('usedIds', usedIds.join(','));
	});

	/** @type {Promise<string>} */
	let pdf = $state(null);
	const generate = () => {
		let svgs = [];

		for (let i = 0; i < pages; i++) {
			const id = uid.rnd();

			if (untrack(() => usedIds.includes(id))) {
				// this should never happen, but just in case
				alert(`ID collision: ${id}`);
				i--;
				continue;
			}
			untrack(() => usedIds.push(id));

			svg.getElementById('id-text').textContent = id;

			const qr = new QRCode({
				content: `https://sc4hfair.app/?referrer=poster-${id}`,
				ecl: 'M',
				container: 'none',
			}).svg();

			svg.getElementById('qr_code').innerHTML = qr;

			svgs.push(/** @type {SVGSVGElement} */ (/**@type {any}*/ svg.cloneNode(true)));
		}

		pdf = generatePDF(svgs);
	};
</script>

<div>
	{uid.uniqueness()} uniqueness &middot;
	<!-- svelte-ignore a11y_click_events_have_key_events -->
	<!-- svelte-ignore a11y_no_static_element_interactions -->
	<span onclick={() => confirm('reset ids?') && (usedIds = [])}>used {usedIds.length}/{uid.availableUUIDs()} unique</span> &middot;
	{uid.collisionProbability()} &middot;
	{uid.approxMaxBeforeCollision()}
</div>

<div>
	<label for="template">template:</label>
	<select id="template" bind:value={template}>
		{#each Object.keys(templates) as key}
			<option value={key}>{key}</option>
		{/each}
	</select>
</div>

<div>
	<label for="pages"># pages:</label>
	<input id="pages" type="number" bind:value={pages} min="1" max="100" />
</div>

<div>
	<button onclick={generate}>generate</button>
	<button
		disabled={!pdf}
		onclick={async () => {
			const link = document.createElement('a');
			link.href = await pdf;
			link.download = `sc4hfair-poster-${template.replaceAll(/\W/g, '_')}-${uid.rnd()}.pdf`;
			document.body.appendChild(link);
			link.click();
			document.body.removeChild(link);
		}}>save</button
	>
</div>

<div>
	{#await pdf}
		<p>generating pdf...</p>
	{:then pdf}
		<iframe title="pdf" style="width: 800px; height: 800px; border: none;" src={pdf}></iframe>
	{:catch error}
		<p>error: {error}</p>
	{/await}
</div>
