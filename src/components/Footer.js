export default function Footer() {
  return (
    <footer style={styles.footer}>
      <div style={styles.container}>
        <p>© {new Date().getFullYear()} La Libertad Avanza Saladillo</p>
      </div>
    </footer>
  );
}

const styles = {
  footer: {
    backgroundColor: "#38195c",
    color: "white",
    padding: "30px 0",
    marginTop: "40px",
  },
  container: {
    maxWidth: "1200px",
    margin: "0 auto",
    textAlign: "center",
  },
};
