<script lang="ts">
	let { img }: { img: string } = $props();
</script>

<!-- <div
	class="animate-blob animation-delay-2000 {color} absolute left-52 size-80 rounded-[1000px] mix-blend-multiply blur-[10000px] filter"
></div> -->
<img
	class="animate-blob animation-delay-2000 absolute -top-10 -right-40 w-[500px]"
	src={`/${img}.png`}
	alt=""
/>

<style>
	.animation-delay-2000 {
		animation-delay: 1s;
	}
</style>
