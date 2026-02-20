import { supabase } from "@/lib/supabase";

export const dynamic = "force-dynamic";

export default async function SobreNosotros() {
  const { data: personas, error } = await supabase
    .from("personas")
    .select("*")
    .order("created_at", { ascending: false });

  if (error) {
    console.error(error);
    return <p>Error cargando el equipo</p>;
  }

  return (
    <>
      <div className="container">
        <h1 className="title">Sobre nosotros</h1>

        <p className="lead">
          La Libertad Avanza Saladillo es un espacio político que nace para
          defender la libertad, el esfuerzo individual y el respeto por el
          trabajo de cada vecino. Creemos en un Estado que no asfixie, en
          instituciones transparentes y en una política al servicio de la gente,
          no de los privilegios.
        </p>

        <p className="lead">
          Desde Saladillo trabajamos para construir una alternativa clara,
          firme y coherente, con ideas que promuevan el desarrollo local,
          el crecimiento económico y la igualdad ante la ley. Nos mueve la
          convicción de que el cambio es posible si se dice la verdad, se
          actúa con coraje y se pone a la libertad en el centro de todas
          las decisiones.
        </p>

        <p className="lead">
          Somos vecinos comprometidos con nuestra comunidad, que creemos
          que otra forma de hacer política es posible.
          <br />
          <strong>Porque donde hay libertad, hay futuro.</strong>
        </p>

        <h2 className="sectionTitle">Nuestro equipo</h2>

        <div className="peopleGrid">
          {personas?.map((persona, index) => (
            <div
              key={persona.id}
              className={`card ${index === 0 ? "featuredCard" : ""}`}
            >
              <div className="imageWrapper">
                <img
                  src={persona.imagen}
                  alt={persona.nombre}
                  className="image"
                />
              </div>

              <div className="cardContent">
                <h3 className="name">{persona.nombre}</h3>
                <p className="role">{persona.rol}</p>
              </div>
            </div>
          ))}
        </div>
      </div>

      <style>{`
        .container {
          max-width: 1100px;
          margin: 40px auto;
          padding: 30px 20px;
          text-align: left;
        }

        .title {
          font-size: 32px;
          font-weight: 800;
          margin-bottom: 20px;
        }

        .lead {
          font-size: 16px;
          line-height: 1.8;
          color: #444;
          margin-bottom: 20px;
        }

        .sectionTitle {
          font-size: 24px;
          font-weight: 700;
          margin: 40px 0 20px;
        }

        .peopleGrid {
          display: grid;
          grid-template-columns: repeat(3, 1fr);
          gap: 20px;
        }

        .card {
          background-color: white;
          border-radius: 12px;
          overflow: hidden;
          box-shadow: 0 6px 18px rgba(0,0,0,0.08);
          display: flex;
          flex-direction: column;
        }

        .featuredCard {
          grid-column: span 2;
        }

        /* 🖥️ Desktop (como antes) */
        .imageWrapper {
          width: 100%;
          height: 260px;
          overflow: hidden;
        }

        .image {
          width: 100%;
          height: 100%;
          object-fit: cover;
          object-position: center 10%;
        }

        .cardContent {
          padding: 20px;
          text-align: left;
        }

        .name {
          font-size: 20px;
          font-weight: 700;
          margin-bottom: 6px;
        }

        .role {
          font-size: 15px;
          color: #666;
        }

        @media (max-width: 768px) {
          .peopleGrid {
            grid-template-columns: 1fr;
          }

          .featuredCard {
            grid-column: span 1;
          }

          .imageWrapper {
            height: auto;
            aspect-ratio: 4 / 5;
          }

          .image {
            object-position: center;
          }
        }
      `}</style>
    </>
  );
}
