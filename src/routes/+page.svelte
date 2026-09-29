<script lang="ts">
  import { artworks, categories, workPath, type Artwork } from '$lib/art';
  import { site } from '$lib/site';
  import ArtImage from '$lib/components/ArtImage.svelte';
  import ArtViewer from '$lib/components/ArtViewer.svelte';
  import Icon from '$lib/components/Icon.svelte';
  import Star from '$lib/components/Star.svelte';

  let category = $state('All work');
  let compact = $state(false);
  let selected = $state<Artwork | null>(null);
  const featured = artworks[0];
  const visibleWorks = $derived(category === 'All work' ? artworks : artworks.filter((art) => art.category === category));
  const count = (value: string) => value === 'All work' ? artworks.length : artworks.filter((art) => art.category === value).length;

  function open(event: MouseEvent, art: Artwork) {
    if (event.ctrlKey || event.metaKey || event.shiftKey || event.altKey || event.button !== 0) return;
    event.preventDefault();
    selected = art;
  }
</script>

<svelte:head><title>{site.name} — {site.title}</title><meta name="description" content={site.description} /><meta property="og:title" content={`${site.name} — ${site.title}`} /><meta property="og:description" content={site.description} /><meta property="og:type" content="website" /></svelte:head>

<main id="main">
  <div id="top"></div>
  <section class="hero page-width" aria-labelledby="intro-title">
    <div class="hero-copy">
      <div class="eyebrow intro-label"><span></span> The world of {site.name}</div>
      <h1 id="intro-title">A little strange.<br />A little <em>human.</em></h1>
      <p>{site.intro}</p>
      <a class="browse-link" href="#work">Step inside <span><Icon name="down" size={18} /></span></a>
      <div class="hero-footnote"><span class="little-line"></span> A personal collection, always growing.</div>
    </div>
    <div class="hero-art">
      <div class="art-stamp"><Star size={26} /><span>Made of<br /><em>little things.</em></span></div>
      <a href={workPath(featured)} onclick={(event) => open(event, featured)} class="hero-art-link" aria-label={`View ${featured.title}`}><ArtImage art={featured} eager sizes="(max-width: 800px) 90vw, 56vw" /><span class="hero-expand"><Icon name="expand" size={18} /></span></a>
      <div class="featured-caption"><span><span class="caption-index">01 /</span> {featured.title}</span><span>{featured.medium} <Icon name="arrow" size={13} /></span></div>
    </div>
  </section>

  <section class="collection page-width" id="work" aria-labelledby="work-title">
    <div class="collection-heading"><div><div class="eyebrow">The collection</div><h2 id="work-title">Selected work<span>({String(artworks.length).padStart(2, '0')})</span></h2></div><p>A few familiar faces.<br />A few things you haven’t met yet.</p></div>
    <div class="gallery-toolbar"><div class="filters" role="group" aria-label="Filter artwork">{#each categories as value}<button class:active={category === value} aria-pressed={category === value} onclick={() => category = value}>{value}<span>{String(count(value)).padStart(2, '0')}</span></button>{/each}</div><div class="view-options" role="group" aria-label="Gallery layout"><button class:active={!compact} aria-pressed={!compact} aria-label="Comfortable view" onclick={() => compact = false}><Icon name="grid" size={16} /></button><button class:active={compact} aria-pressed={compact} aria-label="Compact view" onclick={() => compact = true}><Icon name="compact" size={17} /></button></div></div>
    <p class="sr-only" aria-live="polite">Showing {visibleWorks.length} artworks in {category}.</p>
    <div class="art-grid" class:compact>
      {#each visibleWorks as art (art.id)}
        <a class="art-card" href={workPath(art)} onclick={(event) => open(event, art)} aria-label={`View ${art.title}`}>
          <div class="art-card-image"><ArtImage {art} />{#if art.animated}<span class="motion-badge"><Icon name="play" size={11} /> In motion</span>{/if}<span class="art-open"><Icon name="expand" size={17} /></span></div>
          <div class="art-card-caption"><div><h3>{art.title}</h3><p>{art.medium}</p></div><span class="art-number">{String(artworks.indexOf(art) + 1).padStart(2, '0')}</span></div>
        </a>
      {/each}
    </div>
    <div class="collection-end"><span></span><Star size={21} /><span></span><p>You’ve reached the end. For now.</p></div>
  </section>

  <section class="about-section" id="about" aria-labelledby="about-title"><div class="about-inner page-width"><div class="about-kicker"><Star size={52} /><span class="eyebrow">Behind the drawings</span></div><div class="about-copy"><h2 id="about-title">Hello, I’m <em>{site.name}.</em></h2><p>{site.about}</p><div class="about-links">{#if site.email}<a class="text-button" href={`mailto:${site.email}`}>Say hello <Icon name="arrow" size={15} /></a>{/if}{#if site.instagram}<a class="text-button" href={site.instagram} target="_blank" rel="noreferrer">Instagram <Icon name="arrow" size={15} /></a>{/if}{#if site.github}<a class="text-button" href={site.github} target="_blank" rel="noreferrer">GitHub <Icon name="arrow" size={15} /></a>{/if}<a class="text-button" href="#work">Back to the collection <Icon name="arrow" size={15} /></a></div></div><span class="about-aside">Keep making<br /><em>curious things.</em></span></div></section>
</main>

<ArtViewer works={artworks} bind:selected />

<style>
  .hero { display: grid; grid-template-columns: .87fr 1.13fr; gap: 60px; align-items: center; padding-top: 84px; padding-bottom: 91px; }
  .intro-label { display: flex; align-items: center; gap: 9px; font-size: 9px; }
  .intro-label > span { width: 6px; height: 6px; border-radius: 50%; background: #829146; }
  h1 { font-family: var(--font-serif); font-size: clamp(50px, 5.15vw, 82px); line-height: .99; letter-spacing: -2.8px; font-weight: 400; margin: 27px 0 25px; }
  h1 em { color: #788148; font-weight: 400; }
  .hero-copy > p { color: var(--muted); font-size: 13px; line-height: 1.9; max-width: 320px; }
  .browse-link { display: inline-flex; align-items: center; gap: 27px; font-size: 12px; font-weight: 500; margin-top: 20px; }
  .browse-link span { display: flex; align-items: center; justify-content: center; border: 1px solid #b5bda9; width: 36px; height: 36px; border-radius: 50%; transition: background .2s; }
  .browse-link:hover span { background: var(--lime); }
  .hero-footnote { margin-top: 53px; display: flex; align-items: center; gap: 10px; font-size: 9px; color: var(--muted); }
  .little-line { width: 23px; height: 1px; background: #a2ab8a; }
  .hero-art { position: relative; padding-top: 22px; }
  .hero-art-link { position: relative; display: block; background: #e7dfd7; box-shadow: 0 8px 24px #333c3009; }
  .hero-art-link :global(img) { width: 100%; }
  .hero-expand { position: absolute; bottom: 14px; right: 14px; border-radius: 50%; width: 36px; height: 36px; background: #f4f2eade; display: flex; align-items: center; justify-content: center; transition: background .2s; }
  .hero-art-link:hover .hero-expand { background: var(--lime); }
  .art-stamp { position: absolute; z-index: 1; top: -25px; right: -19px; height: 94px; width: 94px; border-radius: 50%; background: var(--lime); display: flex; flex-direction: column; align-items: center; justify-content: center; gap: 4px; transform: rotate(13deg); border: 1px solid #d9dfa9; }
  .art-stamp span { text-align: center; font-size: 10px; line-height: 1.25; }
  .art-stamp em { font-family: var(--font-serif); font-size: 14px; }
  .featured-caption { display: flex; justify-content: space-between; gap: 10px; font-size: 10px; padding-top: 16px; }
  .featured-caption > span:last-child { display: flex; align-items: center; gap: 10px; color: var(--muted); font-size: 9px; }
  .caption-index { margin-right: 12px; color: #858b7c; font-size: 9px; }
  .collection { scroll-margin-top: 28px; border-top: 1px solid var(--line); padding-top: 40px; }
  .collection-heading { display: flex; align-items: center; justify-content: space-between; }
  .collection-heading h2 { font-family: var(--font-serif); font-size: 48px; font-weight: 400; letter-spacing: -1.5px; line-height: 1.1; margin: 12px 0 0; }
  .collection-heading h2 > span { font-family: 'DM Sans', sans-serif; display: inline-block; vertical-align: top; font-size: 11px; letter-spacing: 0; margin: 6px 0 0 10px; color: var(--muted); }
  .collection-heading > p { color: var(--muted); font-size: 11px; line-height: 1.7; margin-bottom: 0; }
  .gallery-toolbar { display: flex; justify-content: space-between; align-items: center; gap: 20px; margin: 28px 0 32px; padding-block: 15px; border-block: 1px solid var(--line); }
  .filters { display: flex; gap: 8px; flex-wrap: wrap; }
  .filters button { display: flex; align-items: center; gap: 12px; padding: 9px 16px; border: 1px solid transparent; border-radius: 30px; background: transparent; color: var(--muted); font-size: 11px; }
  .filters button span { font-size: 8px; opacity: .7; }
  .filters button.active { background: var(--ink); color: var(--paper); }
  .filters button:not(.active):hover { background: #e8eade; }
  .view-options { display: flex; gap: 2px; }
  .view-options button { display: flex; align-items: center; justify-content: center; width: 35px; height: 35px; border: none; border-radius: 4px; background: none; color: #8c9484; }
  .view-options button.active { color: var(--ink); background: #e4e7da; }
  .art-grid { columns: 3; column-gap: 27px; }
  .art-grid.compact { columns: 4; column-gap: 22px; }
  .art-card { display: inline-block; width: 100%; break-inside: avoid; margin: 0 0 32px; }
  .art-card-image { position: relative; overflow: hidden; background: #e5e4da; border-radius: 2px; }
  .art-card-image :global(img) { width: 100%; transition: filter .3s; }
  .art-card:hover .art-card-image :global(img) { filter: brightness(1.025); }
  .art-card-caption { display: flex; justify-content: space-between; align-items: flex-start; padding-top: 13px; }
  .art-card-caption h3 { font-size: 12px; font-weight: 500; margin: 0 0 4px; }
  .art-card-caption p { color: var(--muted); font-size: 10px; margin: 0; }
  .art-number { color: #868d7c; font-size: 9px; padding-top: 2px; }
  .art-open { position: absolute; right: 12px; bottom: 12px; width: 32px; height: 32px; display: flex; align-items: center; justify-content: center; background: #f4f2eae8; border-radius: 50%; opacity: 0; transform: translateY(4px); transition: opacity .2s, transform .2s; }
  .art-card:hover .art-open, .art-card:focus-visible .art-open { opacity: 1; transform: none; }
  .motion-badge { position: absolute; left: 12px; top: 12px; display: flex; align-items: center; gap: 7px; background: #f4f2eae8; padding: 7px 10px; border-radius: 20px; font-size: 9px; }
  .collection-end { display: flex; align-items: center; justify-content: center; gap: 14px; flex-wrap: wrap; color: #8b957b; padding: 23px 0 60px; }
  .collection-end > span { width: 60px; height: 1px; background: var(--line); }
  .collection-end > p { width: 100%; text-align: center; margin: 0; color: var(--muted); font-size: 10px; }
  .about-section { background: #e9ecdf; border-block: 1px solid #dde1d3; padding: 66px 0; scroll-margin-top: 20px; }
  .about-inner { display: grid; grid-template-columns: 1fr 2.5fr 1fr; gap: 50px; align-items: center; }
  .about-kicker { align-self: start; display: flex; flex-direction: column; gap: 28px; color: #627149; }
  .about-kicker .eyebrow { font-size: 8px; }
  .about-copy h2 { font-family: var(--font-serif); font-size: 38px; line-height: 1.1; font-weight: 400; margin: 0 0 18px; letter-spacing: -.8px; }
  .about-copy p { max-width: 490px; color: #65705e; font-size: 12px; line-height: 1.9; }
  .about-links { display: flex; gap: 24px; flex-wrap: wrap; margin-top: 14px; }
  .about-links .text-button { font-size: 11px; }
  .about-aside { font-family: var(--font-serif); font-size: 23px; line-height: 1.2; color: #75835f; text-align: center; transform: rotate(-8deg); }
  .sr-only { position: absolute; width: 1px; height: 1px; padding: 0; margin: -1px; overflow: hidden; clip-path: inset(50%); white-space: nowrap; border: 0; }
  @media(min-width: 1600px) { .hero { gap: 90px; padding-block: 100px; } }
  @media(max-width: 1100px) { .hero { gap: 35px; padding-block: 65px; } h1 { font-size: 60px; } .about-inner { gap: 25px; } .about-copy h2 { font-size: 34px; } }
  @media(max-width: 800px) { .hero { grid-template-columns: 1fr; gap: 35px; padding-block: 48px; } .hero-copy { position: relative; } h1 { font-size: 70px; } .hero-copy > p { max-width: 400px; } .hero-footnote { position: absolute; right: 0; bottom: 12px; margin: 0; } .hero-art { padding-top: 5px; } .art-stamp { top: -32px; right: 12px; } .art-grid { columns: 2; gap: 22px; } .art-grid.compact { columns: 3; gap: 18px; } .about-inner { grid-template-columns: 1fr 3fr; } .about-aside { display: none; } }
  @media(max-width: 600px) { .hero { padding-top: 38px; gap: 32px; padding-bottom: 45px; } h1 { font-size: clamp(50px, 12vw, 70px); letter-spacing: -2px; margin-block: 22px; } .hero-copy > p { font-size: 12px; max-width: 290px; } .intro-label { font-size: 8px; } .browse-link { margin-top: 12px; } .hero-footnote { display: none; } .art-stamp { width: 76px; height: 76px; top: -32px; right: 8px; } .art-stamp :global(svg) { width: 20px; height: 20px; } .art-stamp span { font-size: 9px; } .art-stamp em { font-size: 12px; } .featured-caption { font-size: 9px; padding-top: 12px; } .featured-caption > span:last-child { font-size: 8px; } .collection { padding-top: 30px; } .collection-heading h2 { font-size: 40px; } .collection-heading > p { display: none; } .gallery-toolbar { gap: 5px; margin: 22px 0 23px; padding-block: 11px; } .filters { gap: 1px; } .filters button { padding: 8px 11px; gap: 6px; font-size: 10px; } .filters button span { font-size: 7px; } .view-options { display: none; } .art-grid, .art-grid.compact { columns: 2; column-gap: 14px; } .art-card { margin-bottom: 23px; } .art-card-caption { padding-top: 10px; } .art-card-caption h3 { font-size: 11px; } .art-card-caption p { font-size: 8px; } .art-number { display: none; } .art-open { display: none; } .motion-badge { padding: 5px 7px; left: 7px; top: 7px; font-size: 8px; gap: 4px; } .collection-end { padding-bottom: 36px; } .about-section { padding-block: 40px; } .about-inner { grid-template-columns: 1fr; gap: 23px; } .about-kicker { flex-direction: row; align-items: center; gap: 13px; } .about-kicker :global(svg) { width: 30px; height: 30px; } .about-copy h2 { font-size: 34px; } .about-copy p { font-size: 12px; } }
  @media(max-width: 360px) { .filters button { padding-inline: 8px; } .filters button span { display: none; } }
</style>
