<script lang="ts">
	import { cn } from '$lib/helpers/utils';

	let { children = undefined, classes = '' } = $props();
</script>

<div
	class={cn(
		'border-border shadow-xs relative flex w-full overflow-hidden rounded-lg border bg-gradient-to-b from-white to-slate-50/40 shadow-slate-100',
		classes
	)}
>
	{@render children?.()}
</div>
