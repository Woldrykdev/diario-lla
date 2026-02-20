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
    categoria === "general"
      ? "Información General"
      : categoria === "proyectos"
      ? "Proyectos del Concejo Deliberante"
      : categoria === "visitas"
      ? "Visitas institucionales"
      : categoria === "juventud"
      ? "Juventud"
      : categoria === "formacion"
      ? "EFDAP"
      : categoria === "purpura"
      ? "La Púrpura"
      : categoria === "geraldine"
      ? "Geraldine Calvella"
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

      {!categoria && (
        <div className="category-banner">
          <img
            src="/inicioimg.jpeg"
            alt="Inicio"
            className="category-banner-image banner-inicio"
          />
        </div>
      )}

      {categoria === "proyectos" && (
        <div className="category-banner">
          <img
            src="/proyectos.jpeg"
            alt="Proyectos"
            className="category-banner-image banner-proyectos"
          />
        </div>
      )}

      {categoria === "formacion" && (
        <div className="categoria-texto">
          Directora de EFDAP, Sandra Analia Cabali.
        </div>
      )}

      {categoria === "juventud" && (
        <div className="categoria-texto">
          <p>Coordinador: Juan Manuel Gimenez Giribone</p>
          <p>SubCoordinador: Santino Valverde</p>
        </div>
      )}

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

      <style jsx>{`
        .category-banner {
          margin: 25px 0 35px 0;
        }

        .category-banner-image {
          width: 100%;
          height: 320px;
          object-fit: cover;
          border-radius: 14px;
        }

        .banner-proyectos {
          object-position: center 20%;
        }

        .banner-inicio {
          object-position: center 50%;
        }

        .categoria-texto {
          margin: 25px 0 35px 0;
          padding: 20px;
          background: #f5f5f5;
          border-radius: 12px;
          font-weight: 600;
          font-size: 16px;
        }

        .categoria-texto p {
          margin: 6px 0;
        }

        @media (max-width: 768px) {
          .category-banner-image {
            height: 200px;
          }
        }

        .news-heading {
          font-size: 28px;
          font-weight: 700;
          margin-bottom: 15px;
        }

        .news-filter-text {
          font-size: 16px;
          margin-bottom: 25px;
        }

        .featured-section {
          display: flex;
          flex-direction: column;
          margin-bottom: 40px;
          gap: 20px;
        }

        .featured-image-wrapper {
          width: 100%;
          overflow: hidden;
          border-radius: 14px;
        }

        .featured-content {
          display: flex;
          flex-direction: column;
          gap: 10px;
        }

        .featured-date {
          font-size: 14px;
          color: #777;
        }

        .featured-title {
          font-size: 22px;
          font-weight: 700;
        }

        .featured-excerpt {
          font-size: 16px;
          color: #333;
        }

        .featured-button {
          padding: 10px 16px;
          background: #0070f3;
          color: white;
          border-radius: 6px;
          text-decoration: none;
          width: fit-content;
        }

        .news-grid {
          display: grid;
          grid-template-columns: repeat(auto-fit, minmax(280px, 1fr));
          gap: 20px;
        }
      `}</style>
    </>
  );
}