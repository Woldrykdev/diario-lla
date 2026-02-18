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
      <h1 style={styles.heading}>Últimas Noticias</h1>
      <p style={{ marginBottom: "16px", color: "#555", fontSize: "14px" }}>
        Mostrando: <strong>{categoriaLabel}</strong>
      </p>

      {featured && (
        <section style={styles.featuredSection}>
          <div style={styles.featuredImageWrapper}>
            {featured.image_url && (
              <Image
                src={featured.image_url}
                alt={featured.title}
                width={900}
                height={500}
                style={styles.featuredImage}
              />
            )}
          </div>

          <div style={styles.featuredContent}>
            {formattedFeaturedDate && (
              <p style={styles.featuredDate}>{formattedFeaturedDate}</p>
            )}
            <h2 style={styles.featuredTitle}>{featured.title}</h2>
            <p style={styles.featuredExcerpt}>
              {featured.content?.substring(0, 260)}...
            </p>
            <Link
              href={`/noticia?slug=${encodeURIComponent(featured.slug)}`}
              style={styles.featuredButton}
            >
              Leer noticia
            </Link>
          </div>
        </section>
      )}

      <div style={styles.grid}>
        {others?.map((item) => (
          <NewsCard key={item.id} news={item} />
        ))}
      </div>
    </>
  );
}

const styles = {
  heading: {
    fontSize: "32px",
    fontWeight: "800",
    marginBottom: "10px",
  },
  featuredSection: {
    display: "grid",
    gridTemplateColumns: "minmax(0, 2fr) minmax(0, 3fr)",
    gap: "24px",
    alignItems: "stretch",
    marginBottom: "30px",
  },
  featuredImageWrapper: {
    borderRadius: "10px",
    overflow: "hidden",
  },
  featuredImage: {
    width: "100%",
    height: "100%",
    objectFit: "cover",
  },
  featuredContent: {
    backgroundColor: "white",
    borderRadius: "10px",
    padding: "24px",
    boxShadow: "0 8px 24px rgba(0,0,0,0.08)",
    display: "flex",
    flexDirection: "column",
    gap: "12px",
    justifyContent: "center",
    wordWrap: "break-word",
  },
  featuredDate: {
    fontSize: "13px",
    color: "#777",
  },
  featuredTitle: {
    fontSize: "26px",
    fontWeight: "800",
  },
  featuredExcerpt: {
    fontSize: "15px",
    color: "#444",
  },
  featuredButton: {
    alignSelf: "flex-start",
    marginTop: "8px",
    backgroundColor: "#0F2A79",
    color: "white",
    padding: "10px 18px",
    borderRadius: "4px",
    fontSize: "14px",
  },
  grid: {
    display: "grid",
    gridTemplateColumns: "repeat(auto-fit, minmax(300px, 1fr))",
    gap: "25px",
  },
};


