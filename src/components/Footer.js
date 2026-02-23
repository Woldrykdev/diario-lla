export default function Footer() {
  return (
    <footer className="footer">
      <div className="footer-container">
        <p className="footer-text">
          © {new Date().getFullYear()} La Libertad Avanza Saladillo
        </p>

        <div className="footer-socials">
          <a
            href="https://www.facebook.com/profile.php?id=61567696746604"
            target="_blank"
            rel="noopener noreferrer"
          >
            <img src="/facebook.svg" alt="Facebook" />
          </a>

          <a
            href="https://instagram.com/lalibertadavanzasaladillo"
            target="_blank"
            rel="noopener noreferrer"
          >
            <img src="/instagram.svg" alt="Instagram" />
          </a>

          <a
            href="https://wa.me/5492345416418"
            target="_blank"
            rel="noopener noreferrer"
          >
            <img src="/whatsapp.svg" alt="WhatsApp" />
          </a>
          <a
            href="https://www.tiktok.com/@juventudllasaladillo"
            target="_blank"
            rel="noopener noreferrer"
          >
            <img src="/tiktok.svg" alt="tiktok" />
          </a>
        </div>
      </div>
    </footer>
  );
}
