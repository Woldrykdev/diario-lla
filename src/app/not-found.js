import Link from "next/link";

export default function NotFound() {
  return (
    <div style={styles.container}>
      <h1 style={styles.title}>404</h1>
      <p style={styles.text}>Página no encontrada</p>
      <Link href="/" style={styles.link}>
        Volver al inicio
      </Link>
    </div>
  );
}

const styles = {
  container: {
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
    justifyContent: "center",
    minHeight: "60vh",
    textAlign: "center",
    padding: "20px",
  },
  title: {
    fontSize: "4rem",
    margin: "0",
    color: "#333",
  },
  text: {
    fontSize: "1.2rem",
    color: "#666",
    marginBottom: "20px",
  },
  link: {
    color: "#7c3aed",
    textDecoration: "none",
    fontWeight: "500",
  },
};
