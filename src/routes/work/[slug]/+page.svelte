<script lang="ts">
  import { base } from '$app/paths';
  import { artworks, fileSize, imagePath, preview, workPath, type Artwork } from '$lib/art';
  import { site } from '$lib/site';
  import ArtImage from '$lib/components/ArtImage.svelte';
  import ArtViewer from '$lib/components/ArtViewer.svelte';
  import Icon from '$lib/components/Icon.svelte';
  import type { PageData } from './$types';
  let { data }: { data: PageData } = $props();
  let selected = $state<Artwork | null>(null);
  let playing = $state(false);
  $effect(() => { void data.art.id; playing = false; });
</script>

<svelte:head><title>{data.art.title} — {site.name}</title><meta name="description" content={data.art.alt} /><meta property="og:title" content={`${data.art.title} — ${site.name}`} /><meta property="og:description" content={data.art.alt} /><meta property="og:type" content="article" /><meta property="og:image" content={preview(data.art)} /></svelte:head>

<main id="main" class="detail page-width">
  <div id="top"></div>
  <a class="text-button back-link" href={`${base}/#work`}><Icon name="left" size={15} /> Back to the collection</a>
  <div class="detail-heading"><div><span class="eyebrow">{data.art.category} / {data.art.medium}</span><h1>{data.art.title}</h1></div><button class="text-button" onclick={() => selected = data.art}>Take a closer look <Icon name="expand" size={18} /></button></div>
  <div class="detail-image">
    {#if data.art.animated && playing}<img src={imagePath(data.art.original)} alt={data.art.alt} width={data.art.width} height={data.art.height} />{:else}<ArtImage art={data.art} eager sizes="(max-width: 800px) 90vw, 80vw" />{/if}
  </div>
  <div class="detail-info"><p>{data.art.alt}</p><div>{#if data.art.animated}<button class="text-button" onclick={() => playing = !playing}><Icon name={playing ? 'pause' : 'play'} size={17} />{playing ? 'Pause animation' : 'Play animation'}</button>{/if}<a class="text-button" href={imagePath(data.art.original)} target="_blank" rel="noreferrer">Open original <Icon name="arrow" size={15} /></a><span>{data.art.width} × {data.art.height} px · {fileSize(data.art.bytes)}</span></div></div>
  <nav class="artwork-navigation" aria-label="More artwork"><a href={workPath(data.previous)}><Icon name="left" size={18} /><span><small>Previous work</small>{data.previous.title}</span></a><a href={workPath(data.next)}><span><small>Next work</small>{data.next.title}</span><Icon name="right" size={18} /></a></nav>
</main>
<ArtViewer works={artworks} bind:selected />

<style>
  .detail { padding-block: 36px 25px; }
  .back-link { color: var(--muted); font-size: 11px; }
  .detail-heading { display: flex; align-items: center; justify-content: space-between; gap: 20px; margin: 35px 0; }
  h1 { font-family: var(--font-serif); font-weight: 400; font-size: clamp(48px, 6vw, 76px); letter-spacing: -1.5px; margin: 10px 0 0; line-height: 1; }
  .detail-image { background: #e9e7de; padding: 30px; display: flex; justify-content: center; }
  .detail-image :global(img) { max-height: 78vh; width: auto; max-width: 100%; object-fit: contain; }
  .detail-info { display: flex; align-items: start; justify-content: space-between; gap: 35px; padding-block: 25px 45px; border-bottom: 1px solid var(--line); }
  .detail-info > p { font-size: 12px; max-width: 450px; line-height: 1.8; color: var(--muted); margin: 0; }
  .detail-info > div { display: flex; flex-wrap: wrap; justify-content: flex-end; gap: 0 20px; }
  .detail-info > div > span { width: 100%; text-align: right; font-size: 10px; color: var(--muted); }
  .detail-info .text-button { padding-top: 0; }
  .artwork-navigation { display: flex; justify-content: space-between; padding-block: 20px; gap: 20px; }
  .artwork-navigation a { display: flex; align-items: center; gap: 20px; font-size: 14px; }
  .artwork-navigation a:last-child { text-align: right; }
  .artwork-navigation small { display: block; color: var(--muted); font-size: 9px; text-transform: uppercase; letter-spacing: .1em; margin-bottom: 7px; }
  @media(max-width: 600px) { .detail-heading { align-items: start; flex-direction: column; margin-block: 25px; } .detail-heading .text-button { font-size: 11px; } .detail-image { padding: 10px; } .detail-info { flex-direction: column; gap: 20px; padding-bottom: 25px; } .detail-info > div { justify-content: flex-start; } .detail-info > div > span { text-align: left; } .artwork-navigation a { font-size: 12px; gap: 8px; } }
</style>
