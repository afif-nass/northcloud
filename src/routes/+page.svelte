<script lang="ts">
	import Blobs from '$components/abstract/animations/Blobs.svelte';
	import NumberFlow, { continuous } from '@number-flow/svelte';
	import Stat from '$components/abstract/animations/Stat.svelte';
	import Pixels from '$components/abstract/pixels/Pixels.svelte';
	import Card from '$components/containers/Card.svelte';
	import { IconCalendarWeek, IconStar } from '@tabler/icons-svelte';

	let { data } = $props();

	let { overview } = $derived(data.stats);

	const currentMonth = new Date().toLocaleString('en-US', { month: 'long' });

	let bigStats = $derived([
		{
			val: overview.currentMonthSavings,
			icon: IconCalendarWeek,
			label: currentMonth + ' Savings',
			grad: 'from-primary',
			pixelColor: '#F2DEFE',
			img: 'purple'
		},
		{
			val: overview.totalSavings,
			icon: IconStar,
			label: 'Total Savings',
			grad: 'from-secondary',
			pixelColor: '#B2FFF1',
			img: 'green'
		}
	]);
</script>

<div class="contain mb-20 mt-4 flex flex-col gap-2">
	<div class="flex gap-2">
		{#each bigStats as { val, label, icon: Icon, grad, pixelColor, img }}
			<Card classes="overflow-hidden relative w-full flex-col h-40 px-6 justify-center">
				<Pixels
					className="absolute flex top-0 left-64"
					width={180}
					height={180}
					squareSize={5}
					gridGap={5}
					color={pixelColor}
					maxOpacity={1}
					flickerChance={1}
				/>
				<div class="absolute -top-5 right-[10%] h-[30%] w-[30%] bg-white/90 blur-sm"></div>
				<div class="absolute right-[30%] top-0 h-[200px] w-[70px] bg-white/90 blur-sm"></div>
				<Blobs {img} />
				<div
					class="bg-gradient-to-r {grad} z-1 mb-4 h-[5px] w-full max-w-[50%] rounded-full to-transparent opacity-30"
				></div>
				<div class="flex flex-col">
					<div class="mt-2 flex items-center gap-2 text-muted *:text-xs">
						<Icon class="mb-[2px] size-4" />
						<p class="font-medium uppercase tracking-widest">{label}</p>
					</div>
					<Stat {val}></Stat>
				</div>
			</Card>
		{/each}
	</div>
</div>
