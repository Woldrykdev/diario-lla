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

  return (
    <>
      <div className="container">
        <NewsList news={news || []} />

        <section className="mapSection">
          <h2 className="mapTitle">Dónde encontrarnos</h2>

          <div className="mapWrapper">
            <iframe
              src="https://www.google.com/maps/embed?pb=!1m17!1m12!1m3!1d3242.4451544414574!2d-59.78692672421405!3d-35.641402572600114!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m2!1m1!2zMzXCsDM4JzI5LjEiUyA1OcKwNDcnMDMuNyJX!5e0!3m2!1ses-419!2sar!4v1771519412367!5m2!1ses-419!2sar"
              loading="lazy"
              allowFullScreen
              referrerPolicy="no-referrer-when-downgrade"
            ></iframe>
          </div>
        </section>
      </div>

      <style>{`
        .container {
          max-width: 1200px;
          margin: 40px auto;
          padding: 0 20px;
        }

        .mapSection {
          margin-top: 120px;
        }

        .mapTitle {
          font-size: 26px;
          font-weight: 700;
          margin-bottom: 20px;
        }

        .mapWrapper {
          width: 100%;
          height: 450px;
          border-radius: 14px;
          overflow: hidden;
          box-shadow: 0 8px 24px rgba(0,0,0,0.1);
        }

        .mapWrapper iframe {
          width: 100%;
          height: 100%;
          border: 0;
        }

        /* 📱 Responsive */
        @media (max-width: 768px) {
          .mapSection {
            margin-top: 80px;
          }

          .mapWrapper {
            height: 300px;
          }

          .mapTitle {
            font-size: 22px;
          }
        }
      `}</style>
    </>
  );
}
