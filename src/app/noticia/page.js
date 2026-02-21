import { supabase } from "@/lib/supabase";
import NewsList from "@/components/NewsList";

export const dynamic = "force-dynamic";

export default async function Home() {
  const { data: news, error } = await supabase
    .from("news")
    .select("*")
    .order("created_at", { ascending: false });

  if (error) {
    console.error(error);
    return <p>Error cargando noticias</p>;
  }

  const styles = {
    container: { maxWidth: 1200, margin: "40px auto", padding: "0 20px" },
    mapSection: { marginTop: 120 },
    mapTitle: { fontSize: 26, fontWeight: 700, marginBottom: 20 },
    mapWrapper: { width: "100%", height: 450, borderRadius: 14, overflow: "hidden", boxShadow: "0 8px 24px rgba(0,0,0,0.1)" },
    iframe: { width: "100%", height: "100%", border: 0 },
    mapSectionMobile: { marginTop: 80 },
    mapWrapperMobile: { height: 300 },
    mapTitleMobile: { fontSize: 22 },
  };

  const isMobile = typeof window !== "undefined" && window.innerWidth <= 768;

  return (
    <div style={styles.container}>
      <NewsList news={news || []} />

      <section style={isMobile ? { ...styles.mapSection, ...styles.mapSectionMobile } : styles.mapSection}>
        <h2 style={isMobile ? { ...styles.mapTitle, ...styles.mapTitleMobile } : styles.mapTitle}>
          Dónde encontrarnos
        </h2>

        <div style={isMobile ? { ...styles.mapWrapper, ...styles.mapWrapperMobile } : styles.mapWrapper}>
          <iframe
            src="https://www.google.com/maps/embed?pb=!1m17!1m12!1m3!1d3242.4451544414574!2d-59.78692672421405!3d-35.641402572600114!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m2!1m1!2zMzXCsDM4JzI5LjEiUyA1OcKwNDcnMDMuNyJX!5e0!3m2!1ses-419!2sar!4v1771519412367!5m2!1ses-419!2sar"
            loading="lazy"
            allowFullScreen
            referrerPolicy="no-referrer-when-downgrade"
            style={styles.iframe}
          ></iframe>
        </div>
      </section>
    </div>
  );
}