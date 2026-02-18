export default function SobreNosotros() {
  return (
    <div style={styles.container}>
      <h1 style={styles.title}>Sobre nosotros</h1>
      <p style={styles.lead}>
        “La Libertad Avanza Saladillo” es un portal digital pensado para
        acercar la información institucional y política de nuestra ciudad,
        con foco en la transparencia y el debate de ideas.
      </p>

      <div style={styles.grid}>
        <section style={styles.card}>
          <h2 style={styles.subtitle}>Nuestra misión</h2>
          <p style={styles.text}>
            Informar con claridad y responsabilidad sobre las propuestas,
            proyectos y acciones que impactan en la vida diaria de los vecinos
            de Saladillo, poniendo en primer plano la libertad, la
            independencia y el respeto por el ciudadano.
          </p>
        </section>

        <section style={styles.card}>
          <h2 style={styles.subtitle}>Qué vas a encontrar</h2>
          <p style={styles.text}>
            Noticias destacadas, análisis de coyuntura, comunicados oficiales,
            seguimiento de iniciativas locales y contenido enfocado en las
            áreas de política, economía y la realidad de nuestro municipio.
          </p>
        </section>
      </div>
    </div>
  );
}

const styles = {
  container: {
    maxWidth: "900px",
    margin: "40px auto",
    padding: "30px 20px",
  },
  title: {
    fontSize: "32px",
    fontWeight: "800",
    marginBottom: "16px",
  },
  lead: {
    fontSize: "16px",
    lineHeight: "1.7",
    color: "#444",
    marginBottom: "30px",
  },
  grid: {
    display: "grid",
    gridTemplateColumns: "repeat(auto-fit, minmax(260px, 1fr))",
    gap: "20px",
  },
  card: {
    backgroundColor: "white",
    borderRadius: "10px",
    padding: "20px",
    boxShadow: "0 6px 18px rgba(0,0,0,0.06)",
  },
  subtitle: {
    fontSize: "18px",
    fontWeight: "700",
    marginBottom: "10px",
  },
  text: {
    fontSize: "14px",
    lineHeight: "1.7",
    color: "#444",
  },
};

