export default function Footer() {
  return (
    <footer className="footer">
      <div className="footer-container">
        <p className="footer-text">
          © {new Date().getFullYear()} La Libertad Avanza Saladillo
        </p>

        <div className="footer-socials">
          <a
            href="https://facebook.com"
            target="_blank"
            rel="noopener noreferrer"
          >
            <img src="/facebook.svg" alt="Facebook" />
          </a>

          <a
            href="https://instagram.com"
            target="_blank"
            rel="noopener noreferrer"
          >
            <img src="/instagram.svg" alt="Instagram" />
          </a>

          <a
            href="https://wa.me/5490000000000"
            target="_blank"
            rel="noopener noreferrer"
          >
            <img src="/whatsapp.svg" alt="WhatsApp" />
          </a>
        </div>
      </div>
    </footer>
  );
}
