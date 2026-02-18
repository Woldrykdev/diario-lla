"use client";

import { useSearchParams } from "next/navigation";
import Link from "next/link";
import Image from "next/image";
import NewsCard from "@/components/NewsCard";

export default function NewsList({ news }) {
  const searchParams = useSearchParams();
  const categoria = searchParams.get("categoria");

  const byCategory =
    categoria && Array.isArray(news)
      ? news.filter((item) => item.category === categoria)
      : news;

  const featured = byCategory?.find((item) => item.is_featured);
  const others = featured
    ? byCategory.filter((item) => item.id !== featured.id)
    : byCategory;

  const categoriaLabel =
    categoria === "politica"
      ? "Política"
      : categoria === "economia"
      ? "Economía"
      : "Todas";

  const formattedFeaturedDate =
    featured?.created_at &&
    new Date(featured.created_at).toLocaleDateString("es-AR", {
      day: "2-digit",
      month: "2-digit",
      year: "numeric",
    });

  return (
    <>
      <h1 className="news-heading">Últimas Noticias</h1>
      <p className="news-filter-text">
        Mostrando: <strong>{categoriaLabel}</strong>
      </p>

      {featured && (
        <section className="featured-section">
          <div className="featured-image-wrapper">
            {featured.image_url && (
              <Image
                src={featured.image_url}
                alt={featured.title}
                width={900}
                height={500}
                className="featured-image"
              />
            )}
          </div>

          <div className="featured-content">
            {formattedFeaturedDate && (
              <p className="featured-date">{formattedFeaturedDate}</p>
            )}
            <h2 className="featured-title">{featured.title}</h2>
            <p className="featured-excerpt">
              {featured.content?.substring(0, 260)}...
            </p>
            <Link
              href={`/noticia?slug=${encodeURIComponent(featured.slug)}`}
              className="featured-button"
            >
              Leer noticia
            </Link>
          </div>
        </section>
      )}

      <div className="news-grid">
        {others?.map((item) => (
          <NewsCard key={item.id} news={item} />
        ))}
      </div>
    </>
  );
}

