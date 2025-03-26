<script lang="ts">
	import Blobs from '$components/abstract/animations/Blobs.svelte';
	import Stat from '$components/abstract/animations/Stat.svelte';
	import Pixels from '$components/abstract/pixels/Pixels.svelte';
	import Card from '$components/containers/Card.svelte';
	import type { Stats } from '$lib/types/stats';
	import { IconCalendarWeek, IconStar } from '@tabler/icons-svelte';

	let { overview }: { overview: Stats['overview'] } = $props();

	const currentMonth = new Date().toLocaleString('en-US', { month: 'long' });

	let bigStats = $derived([
		{
			value: overview.currentMonthSavings,
			icon: IconCalendarWeek,
			label: currentMonth + ' Savings',
			grad: 'from-primary',
			pixelColor: '#F2DEFE',
			img: 'purple'
		},
		{
			value: overview.totalSavings,
			icon: IconStar,
			label: 'Total Savings',
			grad: 'from-secondary',
			pixelColor: '#B2FFF1',
			img: 'green'
		}
	]);
</script>

<div class="flex flex-col gap-2 md:flex-row">
	{#each bigStats as { value, label, icon: Icon, grad, pixelColor, img }, i}
		<Card classes="overflow-hidden relative w-full flex-col h-40 px-6 justify-center">
			<Pixels
				className="absolute flex top-0 left-[70%]"
				width={180}
				height={180}
				squareSize={5}
				gridGap={5}
				color={pixelColor}
				maxOpacity={1}
				flickerChance={1}
			/>
			<div class="absolute -top-1 right-[10%] h-[30%] w-[30%] bg-white/90 blur-sm"></div>
			<div class="absolute right-[25%] top-0 h-[200px] w-[100px] bg-white/90 blur-sm"></div>
			<Blobs {img} />
			<div
				class="bg-gradient-to-r {grad} z-1 mb-4 h-[5px] w-full max-w-[50%] rounded-full to-transparent opacity-30"
			></div>
			<div class="flex flex-col">
				<div class="mt-2 flex items-center gap-2 text-muted *:text-xs">
					<Icon class="mb-[2px] size-4" />
					<p class="font-semibold uppercase tracking-widest">{label}</p>
				</div>
				{#if i}
					<Stat val={value} />
				{:else}
					<div class="flex items-end gap-3">
						<Stat val={value} />
						<Stat
							format={{ style: 'percent', maximumFractionDigits: 2, signDisplay: 'always' }}
							val={overview.percentageChange / 100}
							classes={'text-3xl mb-[10px] transition-colors duration-300 ' +
								(overview.percentageChange < 0 ? 'text-red-500' : 'text-emerald-500')}
						/>
					</div>
				{/if}
			</div>
		</Card>
	{/each}
</div>
