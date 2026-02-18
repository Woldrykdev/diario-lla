"use client";

import Link from "next/link";
import Image from "next/image";
import { useSearchParams, useRouter } from "next/navigation";
import { useState, useRef, useEffect } from "react";

const categories = [
  { value: "", label: "Todas las noticias" },
  { value: "general", label: "Información general" },
  { value: "proyectos", label: "Proyectos del Concejo Deliberante" },
  { value: "visitas ", label: "Visitas institucionales" },
  { value: "juventud", label: "Juventud" },
  { value: "formacion", label: "Escuela de formación, debate y análisis" },
  { value: "purpura", label: "La Purpura" },
  { value: "geraldine", label: "Geraldine Calvella" },
];

export default function Navbar() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const currentCategoria = searchParams.get("categoria") || "";

  const [open, setOpen] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const dropdownRef = useRef(null);
  const mobileMenuRef = useRef(null);

  const handleCategoriaClick = (value) => {
    setOpen(false);
    setMobileMenuOpen(false);

    if (!value) {
      router.push("/");
    } else {
      router.push(`/?categoria=${value}`);
    }
  };

  useEffect(() => {
    function handleClickOutside(event) {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setOpen(false);
      }
      if (mobileMenuRef.current && !mobileMenuRef.current.contains(event.target)) {
        setMobileMenuOpen(false);
      }
    }

    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  return (
    <header className="navbar-header">
      <div className="navbar-container">
        <Link href="/" className="navbar-logo">
          <Image src="/icon.webp" width={40} height={40} alt="Logo" />
          <span className="navbar-logo-text">La Libertad Avanza Saladillo</span>
        </Link>

        {/* Desktop Nav */}
        <nav className="navbar-desktop">
          <Link href="/" className="navbar-link">Inicio</Link>
          <Link href="/sobre-nosotros" className="navbar-link">Sobre nosotros</Link>

          <div className="navbar-dropdown" ref={dropdownRef}>
            <button onClick={() => setOpen(!open)} className="navbar-dropdown-btn">
              Categorías ▾
            </button>

            {open && (
              <div className="navbar-dropdown-menu">
                {categories.map((cat) => (
                  <button
                    key={cat.value || "all"}
                    onClick={() => handleCategoriaClick(cat.value)}
                    className={`navbar-dropdown-item ${currentCategoria === cat.value ? "active" : ""}`}
                  >
                    {cat.label}
                  </button>
                ))}
              </div>
            )}
          </div>
        </nav>

        {/* Mobile Hamburger */}
        <button
          className="navbar-hamburger"
          onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
          aria-label="Menú"
        >
          <span className={`hamburger-line ${mobileMenuOpen ? "open" : ""}`}></span>
          <span className={`hamburger-line ${mobileMenuOpen ? "open" : ""}`}></span>
          <span className={`hamburger-line ${mobileMenuOpen ? "open" : ""}`}></span>
        </button>
      </div>

      {/* Mobile Menu */}
      {mobileMenuOpen && (
        <nav className="navbar-mobile" ref={mobileMenuRef}>
          <Link href="/" className="navbar-mobile-link" onClick={() => setMobileMenuOpen(false)}>Inicio</Link>
          <Link href="/sobre-nosotros" className="navbar-mobile-link" onClick={() => setMobileMenuOpen(false)}>Sobre nosotros</Link>
          <div className="navbar-mobile-divider"></div>
          <p className="navbar-mobile-title">Categorías</p>
          {categories.map((cat) => (
            <button
              key={cat.value || "all"}
              onClick={() => handleCategoriaClick(cat.value)}
              className={`navbar-mobile-link ${currentCategoria === cat.value ? "active" : ""}`}
            >
              {cat.label}
            </button>
          ))}
        </nav>
      )}
    </header>
  );
}
