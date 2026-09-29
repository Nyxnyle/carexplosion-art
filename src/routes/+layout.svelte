<script lang="ts">
  import '@fontsource/dm-sans/latin-400.css';
  import '@fontsource/dm-sans/latin-500.css';
  import '@fontsource/dm-sans/latin-600.css';
  import '@fontsource/cormorant-garamond/latin-400.css';
  import '@fontsource/cormorant-garamond/latin-500.css';
  import '@fontsource/cormorant-garamond/latin-400-italic.css';
  import '../app.css';
  import { base } from '$app/paths';
  import { site } from '$lib/site';
  import Star from '$lib/components/Star.svelte';
  import Icon from '$lib/components/Icon.svelte';
  let { children } = $props();
</script>

<a class="skip-link" href="#main">Skip to content</a>
<header class="site-header page-width">
  <a class="wordmark" href={`${base}/`} aria-label={`${site.name} home`}><Star size={30} /><span>{site.name.toLowerCase()}<span class="wordmark-dot">.</span></span></a>
  <span class="header-note">{site.title}</span>
  <nav aria-label="Main navigation"><a href={`${base}/#work`}>The work <span class="nav-dot"></span></a><a href={`${base}/#about`}>The artist <Icon name="arrow" size={14} /></a></nav>
</header>

{@render children()}

<footer class="site-footer page-width"><a class="footer-brand" href={`${base}/`}><Star size={20} />{site.name.toLowerCase()}.</a><span>© {new Date().getFullYear()} {site.name}. All artwork reserved.</span><a href="#top">Back to top ↑</a></footer>
