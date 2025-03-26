<script lang="ts">
	import { browser } from '$app/environment';
	import type { Stats } from '$lib/types/stats';
	import { AgCharts, type AgCartesianChartOptions } from 'ag-charts-community';
	import { onMount } from 'svelte';

	let { stats }: { stats: Stats } = $props();

	const computedStyle = getComputedStyle(document.documentElement);
	const secondary = computedStyle.getPropertyValue('--color-secondary');
	const fg = computedStyle.getPropertyValue('--color-fg');
	const background = {
		fill: 'transparent'
	};
	let loaded = $state(false);

	onMount(() => {
		if (!browser) return;
		// Monthly Savings Area Chart
		const monthlyOptions: AgCartesianChartOptions = {
			background,
			container: document.getElementById('monthlySavingsChart') as HTMLElement,
			data: stats.savingsTrends,
			animation: {
				enabled: true,
				duration: 1000
			},
			theme: {
				params: {
					fontSize: 12,
					foregroundColor: fg,
					axisColor: 'transparent',
					gridLineColor: '#00000010'
				}
			},
			series: [
				{
					type: 'area',
					xKey: 'month',
					yKey: 'savings',
					stroke: secondary,
					strokeWidth: 4,
					fill: secondary,
					fillOpacity: 0.08,
					marker: { enabled: false }
				}
			],
			axes: [
				{
					type: 'category'
				},
				{
					type: 'number',
					position: 'left',
					label: {
						formatter: (params: any) => (params.value === 0 ? '' : `$${params.value.toFixed(2)}`),
						color: 'var(--color-fg)'
					}
				}
			]
		};
		AgCharts.create(monthlyOptions);
		loaded = true;
	});
</script>

{#if browser}
	<div class="mt-5 grid gap-5 *:*:h-[300px] *:*:min-w-full *:border-none *:bg-none *:shadow-none">
		<h2 class="ml-5 text-left text-2xl font-medium tracking-tight">Monthly Savings</h2>
		<div id="monthlySavingsChart"></div>
		<!-- <Card><div id="savingsByServicePieChart"></div></Card>
		<Card><div id="dailySavingsChart"></div></Card> -->
	</div>
{/if}
