<script lang="ts">
  import { page } from '$app/state';
  import { base } from '$app/paths';
  import { site } from '$lib/site';
  import Star from '$lib/components/Star.svelte';
</script>
<svelte:head><title>{page.status} — {site.name}</title></svelte:head>
<main id="main" class="page-width error-page"><div id="top"></div><Star size={50} /><p class="eyebrow">{page.status}</p><h1>A little off the page.</h1><p>{page.error?.message || 'This page could not be found.'}</p><a class="text-button" href={`${base}/`}>Return to the collection ↗</a></main>
<style>.error-page { min-height: 65vh; display: flex; flex-direction: column; align-items: center; justify-content: center; text-align: center; padding-block: 50px; } h1 { font: 400 56px var(--font-serif); margin: 12px 0; } p { color: var(--muted); font-size: 13px; }</style>
