/**
 * Devuelve la URL de la primera imagen de una noticia.
 * Usa el array `media` si existe, sino `image_url` (compatibilidad con publicaciones antiguas).
 */
export function getFirstImageUrl(news) {
  if (!news) return null;
  const media = news.media;
  if (Array.isArray(media)) {
    const first = media.find((m) => m && m.type === "image" && m.url);
    if (first) return first.url;
  }
  return news.image_url || null;
}
