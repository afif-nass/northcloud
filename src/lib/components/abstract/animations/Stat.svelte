<script lang="ts">
	import { cn } from '$lib/helpers/utils';
	import { browser } from '$app/environment';
	import NumberFlow, { continuous } from '@number-flow/svelte';
	import { onMount } from 'svelte';
	import { cubicInOut } from 'svelte/easing';
	import { Tween } from 'svelte/motion';

	let {
		val = 0,
		format = { style: 'currency', currency: 'USD', trailingZeroDisplay: 'stripIfInteger' },
		classes = '',
		children = null,
		prefix = ''
	} = $props();

	let value = $state(0);

	const tweenedValue = new Tween(0, {
		duration: 1500,
		easing: cubicInOut
	});

	function number(num: Number) {
		return num.toLocaleString('en-US', {
			minimumFractionDigits: 0,
			maximumFractionDigits: 0
		});
	}

	tweenedValue.target = val;

	onMount(async () => {
		value = val;
	});
</script>

<!-- <h1 class="py-1 text-5xl leading-snug tracking-tight tabular-nums {classes}">
	{prefix}{number(tweenedValue.current)}{@render children?.()}
</h1> -->
{#if browser}
	<NumberFlow
		class={cn('text-5xl', classes)}
		plugins={[continuous]}
		{prefix}
		spinTiming={{
			duration: 1500,
			easing: 'ease-out'
		}}
		{value}
		{format}
	/>
{/if}
