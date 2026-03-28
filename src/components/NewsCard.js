import Link from "next/link";
import NewsCoverMedia from "@/components/NewsCoverMedia";
import { getPublicationDateValue } from "@/lib/media";

export default function NewsCard({ news }) {
  const pub = getPublicationDateValue(news);
  const formattedDate = pub
    ? new Date(pub).toLocaleDateString("es-AR", {
        day: "2-digit",
        month: "2-digit",
        year: "numeric",
      })
    : null;

  const hasSlug = !!(news?.slug && news.slug.trim());

  return (
    <div className="news-card">
      <NewsCoverMedia news={news} />

      <div className="news-card-content">
        {formattedDate && <p className="news-card-date">{formattedDate}</p>}
        <h2 className="news-card-title">{news.title || "Sin título"}</h2>
        <p className="news-card-excerpt">
          {(news.content || "").trim() ? `${(news.content || "").substring(0, 160)}...` : "Sin descripción"}
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
