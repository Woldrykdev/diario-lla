"use client";

import Link from "next/link";
import Image from "next/image";
import { useSearchParams, useRouter } from "next/navigation";
import { useState, useRef, useEffect } from "react";

const categories = [
  { value: "", label: "Todas las noticias" },
  { value: "politica", label: "Política" },
  { value: "economia", label: "Economía" },
  // { value: "sociedad", label: "Sociedad" },
  // { value: "deportes", label: "Deportes" },
];

export default function Navbar() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const currentCategoria = searchParams.get("categoria") || "";

  const [open, setOpen] = useState(false);
  const dropdownRef = useRef(null);

  const handleCategoriaClick = (value) => {
    setOpen(false);

    if (!value) {
      router.push("/");
    } else {
      router.push(`/?categoria=${value}`);
    }
  };

  // Cerrar dropdown si clickea afuera
  useEffect(() => {
    function handleClickOutside(event) {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setOpen(false);
      }
    }

    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  return (
    <header style={styles.header}>
      <div style={styles.container}>
        <Link href="/" style={styles.logoContainer}>
          <Image src="/icon.webp" width={45} height={45} alt="Logo" />
          <span style={styles.logoText}>
            La Libertad Avanza Saladillo
          </span>
        </Link>

        <nav style={styles.nav}>
          <Link href="/" style={styles.navLink}>
            Inicio
          </Link>

          <Link href="/sobre-nosotros" style={styles.navLink}>
            Sobre nosotros
          </Link>

          {/* Dropdown Categorías */}
          <div style={styles.dropdown} ref={dropdownRef}>
            <button
              onClick={() => setOpen(!open)}
              style={styles.dropdownButton}
            >
              Categorías ▾
            </button>

            {open && (
              <div style={styles.dropdownMenu}>
                {categories.map((cat) => (
                  <button
                    key={cat.value || "all"}
                    onClick={() => handleCategoriaClick(cat.value)}
                    style={{
                      ...styles.dropdownItem,
                      backgroundColor:
                        currentCategoria === cat.value
                          ? "rgba(15,42,121,0.1)"
                          : "white",
                    }}
                  >
                    {cat.label}
                  </button>
                ))}
              </div>
            )}
          </div>
        </nav>
      </div>
    </header>
  );
}

const styles = {
  header: {
    backgroundColor: "#0F2A79",
    padding: "16px 0",
    color: "white",
    position: "sticky",
    top: 0,
    zIndex: 1000,
  },
  container: {
    maxWidth: "1200px",
    margin: "0 auto",
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
    padding: "0 20px",
  },
  logoContainer: {
    display: "flex",
    alignItems: "center",
    gap: "10px",
    fontWeight: "700",
    fontSize: "18px",
    color: "white",
    textDecoration: "none",
  },
  logoText: {
    color: "white",
  },
  nav: {
    display: "flex",
    alignItems: "center",
    gap: "30px",
    fontWeight: "600",
  },
  navLink: {
    color: "white",
    textDecoration: "none",
    fontSize: "15px",
  },
  dropdown: {
    position: "relative",
  },
  dropdownButton: {
    background: "none",
    border: "none",
    color: "white",
    fontSize: "15px",
    fontWeight: "600",
    cursor: "pointer",
  },
  dropdownMenu: {
    position: "absolute",
    top: "35px",
    right: 0,
    backgroundColor: "white",
    borderRadius: "8px",
    boxShadow: "0 8px 20px rgba(0,0,0,0.15)",
    overflow: "hidden",
    minWidth: "220px",
  },
  dropdownItem: {
    width: "100%",
    textAlign: "left",
    padding: "10px 14px",
    border: "none",
    background: "white",
    cursor: "pointer",
    fontSize: "14px",
    color: "#111827",
  },
};
