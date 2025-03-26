<script lang="ts">
	import Top from '$blocks/dash/Top.svelte';
	import Card from '$components/containers/Card.svelte';
	import Graphs from '$blocks/dash/Graphs.svelte';
	import { browser } from '$app/environment';

	let { data } = $props();
</script>

<div class="contain mb-40 flex">
	{#if browser}
		<Card
			classes="contain border-border mb-40 mt-4 flex flex-col gap-6 rounded-md border bg-white p-6"
		>
			<Top overview={data.stats.overview} />
			<Graphs stats={data.stats} />
		</Card>
	{/if}
</div>
