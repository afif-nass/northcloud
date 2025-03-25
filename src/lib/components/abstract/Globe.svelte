<script lang="ts">
	import { onMount, onDestroy } from 'svelte';
	import createGlobe from 'cobe';
	import { Spring } from 'svelte/motion';

	export let size = 600;
	export let hex = 'FFFFFF';
	export let classes = '';

	let x = new Spring(0, {
		stiffness: 0.04,
		damping: 0.4,
		precision: 0.005
	});
	let pointerInteracting: any = null;
	let pointerInteractionMovement = 0;

	type Marker = { location: [number, number]; size: number };
	type FlashMarker = {
		location: [number, number];
		startTime: number;
		duration: number;
	};

	let canvas: HTMLCanvasElement;
	let phi = 0;
	let rgb: [number, number, number] = hexToRgb(hex);
	let markers: Marker[] = [];
	let flashMarkers: FlashMarker[] = [];
	let intervalId: any;

	function hexToRgb(hex: string): [number, number, number] {
		hex = hex.replace(/^#/, '');
		let bigint = parseInt(hex, 16);
		let r = (bigint >> 16) & 255;
		let g = (bigint >> 8) & 255;
		let b = bigint & 255;
		return [r / 100, g / 100, b / 100];
	}

	function addMarker(location: Marker['location']) {
		markers.push({ location, size: 0.06 });
		flashMarkers.push({
			location,
			startTime: performance.now(),
			duration: 2000
		});
	}

	onMount(() => {
		createGlobe(canvas, {
			devicePixelRatio: 2,
			width: size * 2,
			height: size * 2,
			phi: 0,
			theta: 0,
			dark: 0,
			diffuse: 0,
			mapSamples: 10000,
			mapBrightness: 12,
			mapBaseBrightness: 0,
			opacity: 0.95,
			baseColor: [0.94, 0.95, 0.96],
			markerColor: [2.55, 2.55, 2.55],
			glowColor: [0.98, 0.98, 0.98],
			markers: [],
			onRender: (state: any) => {
				state.phi = phi + x.current;
				if (!pointerInteracting) {
					phi += 0.01;
				}
				flashMarkers = flashMarkers.filter(({ startTime, duration }) => {
					return performance.now() - startTime < duration;
				});
				state.markers = [
					...markers,
					...flashMarkers.map(({ location }) => ({
						location,
						size: 0.01
					}))
				];
			}
		});
	});

	onDestroy(() => {
		clearInterval(intervalId);
	});
</script>

<canvas
	class={classes}
	bind:this={canvas}
	style={`width: ${size}px; height: ${size}px`}
	on:pointerdown={(e) => {
		pointerInteracting = e.clientX - pointerInteractionMovement;
		canvas.style.cursor = 'grabbing';
	}}
	on:pointerup={() => {
		pointerInteracting = null;
		canvas.style.cursor = 'grab';
	}}
	on:pointerout={() => {
		pointerInteracting = null;
		canvas.style.cursor = 'grab';
	}}
	on:mousemove={(e) => {
		if (pointerInteracting !== null) {
			const delta = e.clientX - pointerInteracting;
			pointerInteractionMovement = delta;
			x.set(delta / 200);
		}
	}}
>
</canvas>
