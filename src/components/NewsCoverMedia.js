import Image from "next/image";
import { getCoverPreview } from "@/lib/media";

export default function NewsCoverMedia({
  news,
  classNameImage = "news-card-image",
  width = 600,
  height = 350,
  imageStyle,
  featured = false,
}) {
  const preview = getCoverPreview(news);
  if (!preview) return null;

  const alt = news?.title || "Noticia";
  const videoWrapClass = featured ? "news-cover-video news-cover-video--featured" : "news-cover-video";

  if (preview.type === "image") {
    return (
      <Image
        src={preview.url}
        alt={alt}
        width={width}
        height={height}
        className={classNameImage}
        style={imageStyle}
      />
    );
  }

  if (preview.type === "video_embed") {
    return (
      <div className={videoWrapClass}>
        <Image
          src={preview.thumbnailUrl}
          alt={alt}
          width={width}
          height={height}
          className={classNameImage}
          style={imageStyle}
        />
        <span className="news-cover-play" aria-hidden>
          ▶
        </span>
      </div>
    );
  }

  if (preview.type === "video_direct") {
    return (
      <div className={videoWrapClass}>
        <video
          src={preview.videoUrl}
          muted
          playsInline
          preload="metadata"
          className={classNameImage}
          style={imageStyle}
        />
        <span className="news-cover-play" aria-hidden>
          ▶
        </span>
      </div>
    );
  }

  return (
    <div
      className={`news-cover-placeholder ${featured ? "news-cover-placeholder--featured" : ""} ${classNameImage}`.trim()}
      style={imageStyle}
    >
      <span className="news-cover-play" aria-hidden>
        ▶
      </span>
      <span className="news-cover-placeholder-label">Video</span>
    </div>
  );
}
