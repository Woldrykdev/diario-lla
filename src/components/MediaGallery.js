"use client";

import dynamic from "next/dynamic";
import Image from "next/image";

const PdfViewer = dynamic(() => import("@/components/PdfViewer"), { ssr: false });

function getYouTubeEmbedUrl(url) {
  try {
    const u = new URL(url);
    if (u.hostname.replace("www.", "") === "youtube.com" && u.searchParams.get("v")) {
      return `https://www.youtube.com/embed/${u.searchParams.get("v")}`;
    }
    if (u.hostname === "youtu.be" && u.pathname.length > 1) {
      return `https://www.youtube.com/embed/${u.pathname.slice(1)}`;
    }
  } catch (_) {}
  return null;
}

function getVimeoEmbedUrl(url) {
  try {
    const u = new URL(url);
    if (u.hostname.replace("www.", "") === "vimeo.com" && u.pathname) {
      const id = u.pathname.replace(/^\//, "").split("/")[0];
      if (id) return `https://player.vimeo.com/video/${id}`;
    }
  } catch (_) {}
  return null;
}

function isDirectVideoUrl(url) {
  if (!url || typeof url !== "string") return false;
  const lower = url.toLowerCase();
  return lower.endsWith(".mp4") || lower.endsWith(".webm") || lower.endsWith(".ogg");
}

export default function MediaGallery({ media, imageUrlFallback, title }) {
  const items = [];
  if (Array.isArray(media) && media.length > 0) {
    media.forEach((m) => {
      if (m && m.url) items.push({ type: m.type || "image", url: m.url });
    });
  }
  if (items.length === 0 && imageUrlFallback) {
    items.push({ type: "image", url: imageUrlFallback });
  }

  if (items.length === 0) return null;

  return (
    <div className="noticia-media-gallery">
      {items.map((item, i) => {
        if (item.type === "video") {
          const yt = getYouTubeEmbedUrl(item.url);
          const vimeo = getVimeoEmbedUrl(item.url);
          const direct = isDirectVideoUrl(item.url);

          if (yt || vimeo) {
            return (
              <div key={i} className="noticia-video-wrapper">
                <iframe
                  src={yt || vimeo}
                  title={`Video ${i + 1}`}
                  allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                  allowFullScreen
                  className="noticia-video-iframe"
                />
              </div>
            );
          }
          if (direct) {
            return (
              <div key={i} className="noticia-video-wrapper">
                <video
                  src={item.url}
                  controls
                  className="noticia-video-tag"
                  playsInline
                >
                  Tu navegador no soporta video.
                </video>
              </div>
            );
          }
          return (
            <div key={i} className="noticia-video-wrapper">
              <a href={item.url} target="_blank" rel="noopener noreferrer" className="noticia-video-link">
                Ver video
              </a>
            </div>
          );
        }

        if (item.type === "pdf") {
          return (
            <div key={i} className="noticia-pdf-wrapper">
              <PdfViewer url={item.url} title={title} />
            </div>
          );
        }

        return (
          <div key={i} className="noticia-image-wrapper">
            <Image
              src={item.url}
              alt={title ? `${title} - Imagen ${i + 1}` : `Imagen ${i + 1}`}
              width={900}
              height={500}
              className="noticia-image"
            />
          </div>
        );
      })}
    </div>
  );
}
