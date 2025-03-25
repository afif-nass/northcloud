<script lang="ts">
	import { onMount, onDestroy } from 'svelte';

	export let squareSize: number = 4;
	export let gridGap: number = 6;
	export let flickerChance: number = 0.3;
	export let color: string = 'rgb(0, 0, 0)';
	export let width: number = 600;
	export let height: number = 600;
	export let maxOpacity: number = 0.3;
	export let className: string = '';

	let canvas: HTMLCanvasElement | null = null;
	let container: HTMLDivElement | null = null;
	let isInView = false;
	let canvasSize: { width: number; height: number } = { width: 0, height: 0 };
	let animationFrameId: number | undefined;
	let resizeObserver: ResizeObserver | undefined;
	let intersectionObserver: IntersectionObserver | undefined;
	let gridParams:
		| {
				cols: number;
				rows: number;
				squares: Float32Array;
				dpr: number;
		  }
		| undefined;
	let lastTime = 0;

	// Convert color to RGBA format
	$: memoizedColor = (() => {
		if (typeof window === 'undefined') return 'rgba(0, 0, 0,';

		const ctx = document.createElement('canvas').getContext('2d');
		if (!ctx) return 'rgba(0, 0, 0,';

		try {
			ctx.fillStyle = color;
			ctx.fillRect(0, 0, 1, 1);
			const [r, g, b] = ctx.getImageData(0, 0, 1, 1).data;
			return `rgba(${r}, ${g}, ${b},`;
		} catch {
			return 'rgba(0, 0, 0,';
		}
	})();

	function setupCanvas(canvas: HTMLCanvasElement, width: number, height: number) {
		const dpr = window.devicePixelRatio || 1;
		canvas.width = width * dpr;
		canvas.height = height * dpr;
		canvas.style.width = `${width}px`;
		canvas.style.height = `${height}px`;
		const cols = Math.ceil(width / (squareSize + gridGap));
		const rows = Math.ceil(height / (squareSize + gridGap));

		const squares = new Float32Array(cols * rows);
		for (let i = 0; i < squares.length; i++) {
			squares[i] = 0.1 + Math.random() * (maxOpacity - 0.1);
		}

		return { cols, rows, squares, dpr };
	}

	function updateSquares(squares: Float32Array, deltaTime: number) {
		for (let i = 0; i < squares.length; i++) {
			if (Math.random() < flickerChance * deltaTime) {
				squares[i] = 0.1 + Math.random() * (maxOpacity - 0.1);
			}
		}
	}

	function drawGrid(
		ctx: CanvasRenderingContext2D,
		canvasWidth: number,
		canvasHeight: number,
		cols: number,
		rows: number,
		squares: Float32Array,
		dpr: number
	) {
		ctx.clearRect(0, 0, canvasWidth, canvasHeight);
		ctx.fillStyle = 'transparent';
		ctx.fillRect(0, 0, canvasWidth, canvasHeight);

		for (let i = 0; i < cols; i++) {
			for (let j = 0; j < rows; j++) {
				const index = j * cols + i;
				const opacity = squares[index];
				// const opacity = squares[i * rows + j];
				ctx.fillStyle = `${memoizedColor}${opacity})`;
				const x = i * (squareSize + gridGap) * dpr;
				const y = j * (squareSize + gridGap) * dpr;

				ctx.beginPath();
				ctx.arc(
					x + (squareSize / 2) * dpr,
					y + (squareSize / 2) * dpr,
					(squareSize / 2) * dpr,
					0,
					Math.PI * 2
				);
				ctx.fill();
			}
		}
	}

	function updateCanvasSize() {
		if (!canvas || !container) return;

		const newWidth = width ?? container.clientWidth;
		const newHeight = height ?? container.clientHeight;
		canvasSize = { width: newWidth, height: newHeight };
		gridParams = setupCanvas(canvas, newWidth, newHeight);
	}

	function animate(time: number) {
		if (!isInView || !gridParams || !canvas) return;

		const deltaTime = (time - lastTime) / 1000;
		lastTime = time;

		updateSquares(gridParams.squares, deltaTime);
		const ctx = canvas.getContext('2d');
		if (ctx) {
			drawGrid(
				ctx,
				canvas.width,
				canvas.height,
				gridParams.cols,
				gridParams.rows,
				gridParams.squares,
				gridParams.dpr
			);
		}
		animationFrameId = requestAnimationFrame(animate);
	}

	onMount(() => {
		if (!canvas || !container) return;

		const ctx = canvas.getContext('2d');
		if (!ctx) return;

		updateCanvasSize();

		resizeObserver = new ResizeObserver(() => {
			updateCanvasSize();
		});
		resizeObserver.observe(container);

		intersectionObserver = new IntersectionObserver(
			([entry]) => {
				isInView = entry.isIntersecting;
				if (isInView && animationFrameId === undefined) {
					lastTime = performance.now();
					animationFrameId = requestAnimationFrame(animate);
				}
			},
			{ threshold: 0 }
		);
		intersectionObserver.observe(canvas);
	});

	$: if (isInView && animationFrameId === undefined && gridParams) {
		lastTime = performance.now();
		animationFrameId = requestAnimationFrame(animate);
	} else if (!isInView && animationFrameId !== undefined) {
		cancelAnimationFrame(animationFrameId);
		animationFrameId = undefined;
	}

	onDestroy(() => {
		if (animationFrameId !== undefined) {
			cancelAnimationFrame(animationFrameId);
		}
		resizeObserver?.disconnect();
		intersectionObserver?.disconnect();
	});
</script>

<div bind:this={container} class="h-full w-full {className}">
	<canvas
		bind:this={canvas}
		class="pointer-events-none"
		style="width: {canvasSize.width}px; height: {canvasSize.height}px;"
	>
	</canvas>
</div>
