import Link from "next/link";
import Image from "next/image";

export default function NewsCard({ news }) {
  const formattedDate = news?.created_at
    ? new Date(news.created_at).toLocaleDateString("es-AR", {
        day: "2-digit",
        month: "2-digit",
        year: "numeric",
      })
    : null;

  const hasSlug = !!(news?.slug && news.slug.trim());

  return (
    <div className="news-card">
      {news.image_url && (
        <Image
          src={news.image_url}
          alt={news.title}
          width={600}
          height={350}
          className="news-card-image"
        />
      )}

      <div className="news-card-content">
        {formattedDate && <p className="news-card-date">{formattedDate}</p>}
        <h2 className="news-card-title">{news.title}</h2>
        <p className="news-card-excerpt">
          {(news.content || "").substring(0, 160)}...
        </p>

        {hasSlug ? (
          <Link
            href={`/noticia?slug=${encodeURIComponent(news.slug)}`}
            className="news-card-button"
          >
            Leer más
          </Link>
        ) : (
          <span className="news-card-nolink">Completar enlace en el panel de admin</span>
        )}
      </div>
    </div>
  );
}
