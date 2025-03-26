<script lang="ts">
	import Top from '$blocks/dash/Top.svelte';
	import Graphs from '$blocks/dash/Graphs.svelte';

	let { data } = $props();

	let { overview } = $derived(data.stats);
</script>

<div class="contain mb-20 mt-4 flex flex-col gap-2">
	<Top {overview} />
	<Graphs />
</div>
