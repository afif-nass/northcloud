<script lang="ts">
	import { onMount } from 'svelte';
	import LayerChart from 'layerchart';
	import Card from '$components/containers/Card.svelte';

	let lineChartContainer: HTMLDivElement;
	let pieChartContainer: HTMLDivElement;
	let stackedChartContainer: HTMLDivElement;

	const savingsTrends = [
		{ month: 'January', savings: 150 },
		{ month: 'February', savings: 175 },
		{ month: 'March', savings: 200 },
		{ month: 'April', savings: 225 },
		{ month: 'May', savings: 250 },
		{ month: 'June', savings: 200.75 }
	];

	const savingsByCategory = [
		{ service: 'EC2', savings: 500 },
		{ service: 'S3', savings: 300 },
		{ service: 'RDS', savings: 250 },
		{ service: 'Lambda', savings: 150 }
	];

	const detailedSavings = [
		{ date: '2025-06-01', service: 'EC2', amount: 50 },
		{ date: '2025-06-02', service: 'S3', amount: 30 },
		{ date: '2025-06-03', service: 'RDS', amount: 25 },
		{ date: '2025-06-04', service: 'Lambda', amount: 15 },
		{ date: '2025-06-05', service: 'EC2', amount: 60 },
		{ date: '2025-06-06', service: 'S3', amount: 40 }
	];

	function getCSSVar(name: string) {
		return getComputedStyle(document.documentElement).getPropertyValue(name).trim();
	}

	onMount(() => {
		new LayerChart(lineChartContainer, {
			type: 'line',
			data: savingsTrends,
			x: 'month',
			y: 'savings',
			color: getCSSVar('--color-primary'),
			title: 'Monthly Savings'
		});

		new LayerChart(pieChartContainer, {
			type: 'pie',
			data: savingsByCategory,
			value: 'savings',
			category: 'service',
			colors: savingsByCategory.map(
				(d) => getCSSVar(`--color-${d.service.toLowerCase()}`) || getCSSVar('--color-muted')
			),
			title: 'Savings by Category'
		});

		const dates = [...new Set(detailedSavings.map((d) => d.date))];
		const services = [...new Set(detailedSavings.map((d) => d.service))];
		const stacked = services
			.map((service) => {
				return dates.map((date) => {
					const found = detailedSavings.find((d) => d.date === date && d.service === service);
					return {
						date,
						service,
						amount: found ? found.amount : 0
					};
				});
			})
			.flat();

		new LayerChart(stackedChartContainer, {
			type: 'bar',
			data: stacked,
			x: 'date',
			y: 'amount',
			groupBy: 'service',
			stacked: true,
			colors: services.map(
				(s) => getCSSVar(`--color-${s.toLowerCase()}`) || getCSSVar('--color-muted')
			),
			title: 'Daily Service Breakdown'
		});
	});
</script>

<div class="grid gap-6 *:p-6">
	<Card>
		<canvas bind:this={lineChartContainer}></canvas>
	</Card>
	<Card>
		<canvas bind:this={pieChartContainer}></canvas>
	</Card>
	<Card>
		<canvas bind:this={stackedChartContainer}></canvas>
	</Card>
</div>

<style>
	canvas {
		width: 100% !important;
		max-height: 300px;
	}
</style>
