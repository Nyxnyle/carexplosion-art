<script lang="ts">
  import { tick } from 'svelte';
  import { fileSize, imagePath, preview, workPath, type Artwork } from '$lib/art';
  import Icon from './Icon.svelte';

  let { works, selected = $bindable(null) }: { works: Artwork[]; selected: Artwork | null } = $props();
  let dialog: HTMLDialogElement;
  let zoomed = $state(false);
  let playing = $state(false);
  let failed = $state(false);
  let stage = $state<HTMLDivElement>();
  const index = $derived(selected ? works.findIndex((art) => art.id === selected?.id) : -1);

  $effect(() => {
    if (selected && dialog) {
      zoomed = false;
      playing = false;
      failed = false;
      if (!dialog.open) dialog.showModal();
      const previousOverflow = document.body.style.overflow;
      document.body.style.overflow = 'hidden';
      return () => { document.body.style.overflow = previousOverflow; };
    }
    if (!selected && dialog?.open) dialog.close();
  });

  async function move(direction: number) {
    selected = works[(index + direction + works.length) % works.length];
    await tick();
    stage?.scrollTo(0, 0);
  }

  function keydown(event: KeyboardEvent) {
    if (event.key === 'ArrowRight' || event.key === 'ArrowLeft') {
      event.preventDefault();
      void move(event.key === 'ArrowRight' ? 1 : -1);
    }
  }
</script>

<dialog bind:this={dialog} class="art-viewer" aria-label={selected ? `${selected.title} — artwork viewer` : 'Artwork viewer'} onclose={() => selected = null} onkeydown={keydown}>
  {#if selected}
    <div class="viewer-top">
      <span class="eyebrow">A closer look <span class="viewer-count">/ {String(index + 1).padStart(2, '0')} of {String(works.length).padStart(2, '0')}</span></span>
      <button class="icon-button" onclick={() => dialog.close()} aria-label="Close artwork viewer"><Icon name="close" /></button>
    </div>
    <div bind:this={stage} class:zoomed class="viewer-stage">
      {#if failed}
        <p>This image couldn’t load. <a href={imagePath(selected.original)} target="_blank" rel="noreferrer">Open the original file ↗</a></p>
      {:else}
        <button class="image-zoom" class:zoomed onclick={() => zoomed = !zoomed} aria-label={zoomed ? 'Fit artwork to screen' : 'Zoom to original size'}>
          <img src={selected.animated && !playing ? preview(selected) : imagePath(selected.original)} alt={selected.alt} width={selected.width} height={selected.height} onerror={() => failed = true} />
        </button>
      {/if}
    </div>
    <div class="viewer-bottom">
      <div class="viewer-title" aria-live="polite"><h2>{selected.title}</h2><p>{selected.medium} <span>·</span> {selected.width} × {selected.height} px</p></div>
      <div class="viewer-tools">
        {#if selected.animated}<button class="text-button" onclick={() => playing = !playing}><Icon name={playing ? 'pause' : 'play'} />{playing ? 'Pause' : 'Play'}</button>{/if}
        <button class="icon-button" onclick={() => zoomed = !zoomed} aria-label={zoomed ? 'Fit artwork to screen' : 'Zoom to original size'} aria-pressed={zoomed}><Icon name={zoomed ? 'minus' : 'plus'} /></button>
        <a class="text-button original-link" href={imagePath(selected.original)} target="_blank" rel="noreferrer" title={`Original file · ${fileSize(selected.bytes)}`}>Original <Icon name="arrow" size={15} /></a>
        <a class="text-button detail-link" href={workPath(selected)}>Artwork page <Icon name="arrow" size={15} /></a>
        <div class="viewer-nav"><button class="icon-button" onclick={() => move(-1)} aria-label="Previous artwork"><Icon name="left" /></button><button class="icon-button" onclick={() => move(1)} aria-label="Next artwork"><Icon name="right" /></button></div>
      </div>
    </div>
  {/if}
</dialog>

<style>
  .art-viewer { position: fixed; inset: 0; width: calc(100vw - 40px); max-width: 1800px; height: calc(100dvh - 40px); max-height: none; margin: auto; padding: 0; border: 1px solid #50574f; border-radius: 8px; background: #1f2823; color: #f4f2ea; overflow: hidden; }
  .art-viewer[open] { display: flex; flex-direction: column; }
  .art-viewer::backdrop { background: #111a16e6; backdrop-filter: blur(8px); }
  .viewer-top { display: flex; justify-content: space-between; align-items: center; padding: 12px 24px; flex-shrink: 0; }
  .viewer-count { color: #b2baae; margin-left: 14px; }
  .viewer-stage { flex: 1; min-height: 0; display: flex; justify-content: center; align-items: center; overflow: auto; padding: 12px 50px; }
  .image-zoom { display: flex; justify-content: center; align-items: center; width: 100%; height: 100%; padding: 0; border: none; background: transparent; cursor: zoom-in; }
  .image-zoom img { width: auto; height: auto; max-width: 100%; max-height: 100%; object-fit: contain; }
  .viewer-stage.zoomed { display: block; padding: 0; }
  .image-zoom.zoomed { display: block; width: max-content; height: max-content; min-width: 100%; min-height: 100%; cursor: zoom-out; }
  .image-zoom.zoomed img { width: auto; height: auto; max-width: none; max-height: none; margin: auto; }
  .viewer-bottom { display: flex; justify-content: space-between; align-items: center; gap: 20px; padding: 22px 24px; flex-shrink: 0; }
  .viewer-title h2 { font-family: var(--font-serif); font-size: 30px; font-weight: 500; margin: 0 0 3px; }
  .viewer-title p { color: #b9c1b5; font-size: 12px; margin: 0; }
  .viewer-title p span { margin: 0 7px; }
  .viewer-tools, .viewer-nav { display: flex; align-items: center; gap: 12px; }
  .viewer-nav { border-left: 1px solid #535d53; padding-left: 16px; margin-left: 10px; gap: 4px; }
  .icon-button { color: inherit; border-color: #596353; }
  .icon-button:hover { color: #1f2823; background: #e8edbd; }
  .text-button { color: inherit; font-size: 12px; }
  @media(max-width: 900px) { .detail-link { display: none; } .viewer-bottom { align-items: flex-start; } .viewer-tools { flex-wrap: wrap; justify-content: flex-end; } }
  @media(max-width: 600px) { .art-viewer { width: 100vw; height: 100dvh; border: 0; border-radius: 0; } .viewer-top { padding: 10px 16px; } .viewer-count { margin-left: 6px; } .viewer-stage { padding: 8px; } .viewer-bottom { padding: 16px; flex-direction: column; gap: 16px; } .viewer-tools { width: 100%; justify-content: flex-start; } .viewer-nav { margin-left: auto; } .viewer-title h2 { font-size: 28px; } }
</style>
