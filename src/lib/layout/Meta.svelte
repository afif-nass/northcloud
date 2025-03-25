<script lang="ts">
	import { page } from '$app/state';
	import { site } from '$lib/index';
</script>

<svelte:head>
	<title>{page.data.title ?? site.name}</title>
</svelte:head>
