import data from './generated/artworks.json';
import { base } from '$app/paths';

export type Artwork = (typeof data)[number];
export const artworks: Artwork[] = data;
export const categories = ['All work', ...new Set(artworks.map((art) => art.category))];
export const imagePath = (path: string) => `${base}${path}`;
export const workPath = (art: Artwork) => `${base}/work/${art.id}/`;
export const preview = (art: Artwork) => imagePath(art.previews[art.previews.length - 1].src);
export const srcset = (art: Artwork) => art.previews.map((image) => `${imagePath(image.src)} ${image.width}w`).join(', ');
export const fileSize = (bytes: number) => bytes >= 1_000_000 ? `${(bytes / 1_000_000).toFixed(1)} MB` : `${Math.round(bytes / 1000)} KB`;
