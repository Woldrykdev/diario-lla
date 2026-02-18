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
    <div style={styles.card}>
      {news.image_url && (
        <Image
          src={news.image_url}
          alt={news.title}
          width={600}
          height={350}
          style={styles.image}
        />
      )}

      <div style={styles.content}>
        {formattedDate && <p style={styles.date}>{formattedDate}</p>}
        <h2 style={styles.title}>{news.title}</h2>
        <p style={styles.excerpt}>
          {(news.content || "").substring(0, 160)}...
        </p>

        {hasSlug ? (
          <Link
            href={`/noticia?slug=${encodeURIComponent(news.slug)}`}
            style={styles.button}
          >
            Leer más
          </Link>
        ) : (
          <span style={styles.noLink}>Completar enlace en el panel de admin</span>
        )}
      </div>
    </div>
  );
}

const styles = {
  card: {
    backgroundColor: "white",
    borderRadius: "8px",
    overflow: "hidden",
    boxShadow: "0 4px 10px rgba(0,0,0,0.05)",
    display: "flex",
    flexDirection: "column",
    height: "100%",
  },
  image: {
    width: "100%",
    height: "220px",
    objectFit: "cover",
  },
  content: {
    padding: "20px",
    display: "flex",
    flexDirection: "column",
    height: "100%",
  },
  date: {
    fontSize: "12px",
    color: "#777",
    marginBottom: "6px",
  },
  title: {
    fontSize: "20px",
    fontWeight: "700",
    marginBottom: "10px",
  },
  excerpt: {
    fontSize: "14px",
    color: "#555",
    marginBottom: "15px",
    overflow: "hidden",
    display: "-webkit-box",
    WebkitLineClamp: 3,
    WebkitBoxOrient: "vertical",
    wordWrap: "break-word",
  },
  button: {
    backgroundColor: "#0F2A79",
    color: "white",
    padding: "8px 14px",
    borderRadius: "4px",
    fontSize: "14px",
    alignSelf: "flex-start",
    marginTop: "auto",
  },
  noLink: {
    fontSize: "12px",
    color: "#999",
    marginTop: "auto",
  },
};
