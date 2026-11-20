import { BASE } from "./data.js";

/* Note bodies are not bundled into the app (the bundle would grow with every post).
   Each prerendered note page embeds its own content; other notes are fetched on demand. */
const cache = new Map();

export function preloadNote(note) {
  if (note && note.slug) cache.set(note.slug, note);
}

export function getCachedNote(slug) {
  return cache.get(slug) || null;
}

export async function loadNote(slug) {
  if (cache.has(slug)) return cache.get(slug);
  const res = await fetch(`${BASE}notes-data/${slug}.json`);
  if (!res.ok) throw new Error(`Note ${slug}: ${res.status}`);
  const note = await res.json();
  cache.set(slug, note);
  return note;
}
