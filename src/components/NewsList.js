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

  // OBJETOS DE ESTILO
  const styles = {
    heading: {
      fontSize: "28px",
      fontWeight: 700,
      marginBottom: "15px",
    },
    filterText: {
      fontSize: "16px",
      marginBottom: "25px",
    },
    categoryBanner: {
      margin: "25px 0 35px 0",
      width: "100%",
      borderRadius: "14px",
      overflow: "hidden",
    },
    bannerImage: {
      width: "100%",
      height: "320px",
      objectFit: "cover",
    },
    bannerInicio: {
      objectPosition: "center 50%",
    },
    bannerProyectos: {
      objectPosition: "center 20%",
    },
    categoriaTexto: {
      margin: "25px 0 35px 0",
      padding: "20px",
      backgroundColor: "#f5f5f5",
      borderRadius: "12px",
      fontWeight: 600,
      fontSize: "16px",
    },
    categoriaTextoP: {
      margin: "6px 0",
    },
    featuredSection: {
      display: "flex",
      flexDirection: "column",
      marginBottom: "40px",
      gap: "20px",
    },
    featuredContent: {
      display: "flex",
      flexDirection: "column",
      gap: "10px",
    },
    featuredDate: {
      fontSize: "14px",
      color: "#777",
    },
    featuredTitle: {
      fontSize: "22px",
      fontWeight: "700",
    },
    featuredExcerpt: {
      fontSize: "16px",
      color: "#333",
    },
    featuredButton: {
      padding: "10px 16px",
      backgroundColor: "#0070f3",
      color: "white",
      borderRadius: "6px",
      textDecoration: "none",
      width: "fit-content",
      display: "inline-block",
    },
    newsGrid: {
      display: "grid",
      gridTemplateColumns: "repeat(auto-fit, minmax(280px, 1fr))",
      gap: "20px",
    },
  };

  return (
    <>
      <h1 style={styles.heading}>Últimas Noticias</h1>

      <p style={styles.filterText}>
        Mostrando: <strong>{categoriaLabel}</strong>
      </p>

      {!categoria && (
        <div style={styles.categoryBanner}>
          <img
            src="/inicioimg.jpeg"
            alt="Inicio"
            style={{ ...styles.bannerImage, ...styles.bannerInicio }}
          />
        </div>
      )}

      {categoria === "proyectos" && (
        <div style={styles.categoryBanner}>
          <img
            src="/proyectos.jpeg"
            alt="Proyectos"
            style={{ ...styles.bannerImage, ...styles.bannerProyectos }}
          />
        </div>
      )}

      {categoria === "formacion" && (
        <div style={styles.categoriaTexto}>
          Directora de EFDAP, Sandra Analia Cabali.
        </div>
      )}

      {categoria === "juventud" && (
        <div style={styles.categoriaTexto}>
          <p style={styles.categoriaTextoP}>Coordinador: Juan Manuel Gimenez Giribone</p>
          <p style={styles.categoriaTextoP}>SubCoordinador: Santino Valverde</p>
        </div>
      )}

      {featured && (
        <section style={styles.featuredSection}>
          {featured.image_url && (
            <div style={{ borderRadius: "14px", overflow: "hidden" }}>
              <Image
                src={featured.image_url}
                alt={featured.title}
                width={900}
                height={500}
                style={{ width: "100%", height: "auto", objectFit: "cover" }}
              />
            </div>
          )}

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

      <div style={styles.newsGrid}>
        {others?.map((item) => (
          <NewsCard key={item.id} news={item} />
        ))}
      </div>
    </>
  );
}