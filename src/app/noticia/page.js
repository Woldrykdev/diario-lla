 "use client";

import { useEffect, useState } from "react";
import { useSearchParams } from "next/navigation";
import Image from "next/image";
import { supabase } from "@/lib/supabase";

export default function NewsPage() {
  const searchParams = useSearchParams();
  const slug = (searchParams.get("slug") || "").toString().trim();

  const [news, setNews] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    async function load() {
      try {
        setLoading(true);
        setError("");

        if (!slug) {
          setError("Enlace inválido. Falta el slug de la noticia.");
          setLoading(false);
          return;
        }

        const { data, error } = await supabase
          .from("news")
          .select("*")
          .eq("slug", slug)
          .order("created_at", { ascending: false })
          .limit(1);

        if (error) {
          console.error("Error cargando noticia por slug:", slug, error);
          setError("Error cargando la noticia.");
          setLoading(false);
          return;
        }

        const item = Array.isArray(data) ? data[0] : null;
        if (!item) {
          setError(`Noticia no encontrada para el enlace: ${slug}`);
          setLoading(false);
          return;
        }

        setNews(item);
      } catch (e) {
        console.error("Error inesperado cargando noticia:", e);
        setError("Error inesperado cargando la noticia.");
      } finally {
        setLoading(false);
      }
    }

    load();
  }, [slug]);

  if (loading) {
    return (
      <div style={styles.container}>
        <p>Cargando noticia...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div style={styles.container}>
        <p>{error}</p>
      </div>
    );
  }

  const formattedDate = news?.created_at
    ? new Date(news.created_at).toLocaleDateString("es-AR", {
        day: "2-digit",
        month: "2-digit",
        year: "numeric",
      })
    : null;

  return (
    <div style={styles.container}>
      <h1 style={styles.title}>{news.title}</h1>

      {formattedDate && <p style={styles.date}>{formattedDate}</p>}

      {news.image_url && (
        <Image
          src={news.image_url}
          width={900}
          height={500}
          alt={news.title}
          style={styles.image}
        />
      )}

      <p style={styles.content}>{news.content}</p>
    </div>
  );
}

const styles = {
  container: {
    maxWidth: "900px",
    margin: "40px auto",
    padding: "30px 20px",
    backgroundColor: "white",
    borderRadius: "10px",
    boxShadow: "0 8px 24px rgba(0,0,0,0.06)",
    boxSizing: "border-box",
  },
  title: {
    fontSize: "32px",
    fontWeight: "800",
    marginBottom: "12px",
    wordBreak: "break-word",
  },
  date: {
    fontSize: "14px",
    color: "#777",
    marginBottom: "16px",
  },
  image: {
    width: "100%",
    height: "auto",
    maxHeight: "460px",
    objectFit: "contain",
    borderRadius: "8px",
    marginBottom: "20px",
  },
  content: {
    fontSize: "18px",
    lineHeight: "1.7",
    color: "#222",
    whiteSpace: "pre-line",
    wordBreak: "break-word",
  },
};

