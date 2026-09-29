import { error } from '@sveltejs/kit';
import { artworks } from '$lib/art';
import type { PageLoad, EntryGenerator } from './$types';

export const entries: EntryGenerator = () => artworks.map((art) => ({ slug: art.id }));

export const load: PageLoad = ({ params }) => {
  const index = artworks.findIndex((art) => art.id === params.slug);
  if (index < 0) error(404, 'This artwork is not in the collection.');
  return {
    art: artworks[index],
    previous: artworks[(index - 1 + artworks.length) % artworks.length],
    next: artworks[(index + 1) % artworks.length]
  };
};
