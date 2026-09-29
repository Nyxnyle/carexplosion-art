<script lang="ts">
  let { name, size = 20 }: { name: 'arrow' | 'down' | 'close' | 'left' | 'right' | 'expand' | 'grid' | 'compact' | 'play' | 'pause' | 'plus' | 'minus'; size?: number } = $props();
  const paths = {
    arrow: 'M5 19 19 5M5 5h14v14',
    down: 'M12 4v16m-6-6 6 6 6-6',
    close: 'm6 6 12 12M6 18 18 6',
    left: 'm14 5-7 7 7 7',
    right: 'm10 5 7 7-7 7',
    expand: 'M9 4H4v5m11-5h5v5M4 15v5h5m11-5v5h-5',
    grid: 'M3 3h7v7H3zM14 3h7v7h-7zM3 14h7v7H3zM14 14h7v7h-7z',
    compact: 'M3 3h4v4H3zM10 3h4v4h-4zM17 3h4v4h-4zM3 10h4v4H3zM10 10h4v4h-4zM17 10h4v4h-4zM3 17h4v4H3zM10 17h4v4h-4zM17 17h4v4h-4z',
    play: 'm8 4 12 8-12 8z',
    pause: 'M8 4v16M16 4v16',
    plus: 'M12 5v14M5 12h14',
    minus: 'M5 12h14'
  };
</script>

<svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d={paths[name]} /></svg>
