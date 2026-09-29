<script lang="ts">
  import { preview, srcset, type Artwork } from '$lib/art';
  let { art, eager = false, sizes = '(max-width: 600px) calc(100vw - 40px), (max-width: 900px) 45vw, 30vw' }: { art: Artwork; eager?: boolean; sizes?: string } = $props();
</script>

<img src={preview(art)} srcset={srcset(art)} {sizes} alt={art.alt} width={art.width} height={art.height} loading={eager ? 'eager' : 'lazy'} fetchpriority={eager ? 'high' : 'auto'} decoding="async" />
