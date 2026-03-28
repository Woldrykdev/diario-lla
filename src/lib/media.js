/** @param {string} url */
function parseYouTubeVideoId(url) {
  try {
    const u = new URL(url);
    const h = u.hostname.replace(/^www\./, "");
    if (h === "youtube.com" && u.searchParams.get("v")) {
      return u.searchParams.get("v");
    }
    if (h === "youtu.be" && u.pathname.length > 1) {
      return u.pathname.slice(1).split("/")[0];
    }
  } catch (_) {}
  return null;
}

/** @param {string} url */
function parseVimeoVideoId(url) {
  try {
    const u = new URL(url);
    const h = u.hostname.replace(/^www\./, "");
    if (h === "vimeo.com" && u.pathname) {
      const id = u.pathname.replace(/^\//, "").split("/")[0];
      return id || null;
    }
  } catch (_) {}
  return null;
}

/** @param {string} url */
export function isDirectVideoUrl(url) {
  if (!url || typeof url !== "string") return false;
  const lower = url.toLowerCase();
  return lower.endsWith(".mp4") || lower.endsWith(".webm") || lower.endsWith(".ogg");
}

/**
 * Primera imagen de la noticia (media o image_url legacy).
 * @param {object} news
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

/**
 * Portada para listados: primera imagen, o si no hay, miniatura / preview del primer video.
 * @returns {{ type: 'image', url: string } | { type: 'video_embed', thumbnailUrl: string } | { type: 'video_direct', videoUrl: string } | { type: 'video_placeholder' } | null}
 */
export function getCoverPreview(news) {
  if (!news) return null;
  const media = news.media;
  if (Array.isArray(media)) {
    for (const m of media) {
      if (!m?.url) continue;
      if (m.type === "image") {
        return { type: "image", url: m.url };
      }
      if (m.type === "video") {
        const yt = parseYouTubeVideoId(m.url);
        if (yt) {
          return {
            type: "video_embed",
            thumbnailUrl: `https://img.youtube.com/vi/${yt}/hqdefault.jpg`,
          };
        }
        const vm = parseVimeoVideoId(m.url);
        if (vm) {
          return {
            type: "video_embed",
            thumbnailUrl: `https://vumbnail.com/${vm}.jpg`,
          };
        }
        if (isDirectVideoUrl(m.url)) {
          return { type: "video_direct", videoUrl: m.url };
        }
        return { type: "video_placeholder" };
      }
    }
  }
  if (news.image_url) {
    return { type: "image", url: news.image_url };
  }
  return null;
}

/** Fecha de publicación mostrada y usada para ordenar (la que editás en la BD). */
export function getPublicationDateValue(news) {
  if (!news) return null;
  return news.published_at || news.created_at || null;
}
