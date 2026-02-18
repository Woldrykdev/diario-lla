"use client";

import { useState } from "react";
import { supabase } from "@/lib/supabase";

export default function AdminForm() {
  const [title, setTitle] = useState("");
  const [slugInput, setSlugInput] = useState(""); // slug opcional manual
  const [category, setCategory] = useState("");
  const [content, setContent] = useState("");
  const [image, setImage] = useState(null);
  const [isFeatured, setIsFeatured] = useState(false);
  const [loading, setLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");
  const [successMessage, setSuccessMessage] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();
    setErrorMessage("");
    setSuccessMessage("");
    setLoading(true);

    try {
      // 🔐 Verificar usuario logueado
      const {
        data: { user },
      } = await supabase.auth.getUser();

      if (!user) {
        throw new Error("No estás logueado. Iniciá sesión para publicar.");
      }

      // 🔥 Slug: si el usuario lo escribe, lo uso; si no, lo genero desde el título
      const baseForSlug = (slugInput || title).toString();

      const slug = baseForSlug
        .toLowerCase()
        .trim()
        .replace(/\s+/g, "-") // espacios -> guiones
        .replace(/[^\w-]+/g, ""); // limpia caracteres raros

      if (!slug) {
        throw new Error("El título es inválido para generar el enlace (slug).");
      }

      let imageUrl = null;

      // 📸 Subir imagen si existe
      if (image) {
        const fileName = `${Date.now()}-${image.name}`;

        const { error: uploadError } = await supabase.storage
          .from("news-images") // ⚠️ Asegurate que el bucket se llame así
          .upload(fileName, image);

        if (uploadError) {
          console.error("Storage error:", uploadError);
          alert(uploadError.message);
          setLoading(false);
          return;
        }

        const { data } = supabase.storage
          .from("news-images")
          .getPublicUrl(fileName);

        imageUrl = data.publicUrl;
      }

      // ⭐ Si esta noticia es destacada, desmarcamos cualquier otra destacada del mismo usuario.
      // Si falla este paso, solo lo registramos en consola y seguimos (no bloquea la publicación).
      if (isFeatured) {
        const { error: clearFeaturedError } = await supabase
          .from("news")
          .update({ is_featured: false })
          .eq("is_featured", true)
          .eq("user_id", user.id);

        if (clearFeaturedError) {
          console.error(
            "Error limpiando noticias destacadas (se continúa de todas formas):",
            clearFeaturedError
          );
        }
      }

      // 📰 Insertar noticia en la tabla
      const { error: insertError } = await supabase
        .from("news")
        .insert([
          {
            title,
            content,
            slug,
            category: category || null,
            image_url: imageUrl,
            is_featured: isFeatured,
            published: true,
            user_id: user.id,
          },
        ]);

      if (insertError) {
        console.error("Insert error:", insertError);
        throw new Error(insertError.message);
      }

      setSuccessMessage("Noticia publicada correctamente ✅");

      // 🔄 Resetear formulario
      setTitle("");
      setSlugInput("");
      setCategory("");
      setContent("");
      setImage(null);
      setIsFeatured(false);
    } catch (err) {
      console.error("Unexpected error:", err);
      setErrorMessage(err.message || "Error inesperado");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={styles.wrapper}>
      <h1 style={styles.heading}>Publicar noticia</h1>

      {errorMessage && <p style={styles.error}>{errorMessage}</p>}
      {successMessage && <p style={styles.success}>{successMessage}</p>}

      <form onSubmit={handleSubmit} style={styles.form}>
        <label style={styles.label}>
          Título
          <input
            type="text"
            placeholder="Título de la noticia"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            style={styles.input}
            required
          />
        </label>

        <label style={styles.label}>
          Categoría
          <select
            value={category}
            onChange={(e) => setCategory(e.target.value)}
            style={styles.input}
          >
            <option value="">Seleccionar categoría</option>
            <option value="politica">Política</option>
            <option value="economia">Economía</option>
          </select>
        </label>

        <label style={styles.label}>
          Slug (enlace) opcional
          <input
            type="text"
            placeholder="si lo dejas vacío se genera solo"
            value={slugInput}
            onChange={(e) => setSlugInput(e.target.value)}
            style={styles.input}
          />
          <span style={styles.helperText}>
            Ejemplo: <code>nueva-medida-en-saladillo</code>
          </span>
        </label>

        <label style={styles.label}>
          Contenido
          <textarea
            placeholder="Escribí el contenido de la noticia"
            value={content}
            onChange={(e) => setContent(e.target.value)}
            style={styles.textarea}
            rows={6}
            required
          />
        </label>

        <label style={styles.label}>
          Imagen principal (opcional)
          <input
            type="file"
            accept="image/*"
            onChange={(e) => setImage(e.target.files[0])}
            style={styles.fileInput}
          />
        </label>

        <label style={styles.checkboxRow}>
          <input
            type="checkbox"
            checked={isFeatured}
            onChange={(e) => setIsFeatured(e.target.checked)}
            style={styles.checkbox}
          />
          <span>Marcar como noticia destacada</span>
        </label>

        <button
          type="submit"
          disabled={loading}
          style={{
            ...styles.button,
            opacity: loading ? 0.7 : 1,
            cursor: loading ? "not-allowed" : "pointer",
          }}
        >
          {loading ? "Publicando..." : "Publicar"}
        </button>
      </form>
    </div>
  );
}

const styles = {
  wrapper: {
    maxWidth: "700px",
    margin: "40px auto",
    padding: "30px 16px",
    backgroundColor: "white",
    borderRadius: "8px",
    boxShadow: "0 4px 12px rgba(0,0,0,0.06)",
  },
  heading: {
    fontSize: "clamp(22px, 5vw, 28px)",
    fontWeight: "800",
    marginBottom: "20px",
  },
  form: {
    display: "flex",
    flexDirection: "column",
    gap: "16px",
  },
  label: {
    display: "flex",
    flexDirection: "column",
    gap: "6px",
    fontSize: "14px",
    fontWeight: "600",
  },
  input: {
    padding: "12px",
    borderRadius: "6px",
    border: "1px solid #ddd",
    fontSize: "16px",
  },
  textarea: {
    padding: "12px",
    borderRadius: "6px",
    border: "1px solid #ddd",
    fontSize: "16px",
    resize: "vertical",
    minHeight: "120px",
  },
  fileInput: {
    marginTop: "4px",
    fontSize: "14px",
  },
  checkboxRow: {
    display: "flex",
    alignItems: "center",
    gap: "8px",
    fontSize: "14px",
  },
  checkbox: {
    width: "18px",
    height: "18px",
  },
  button: {
    marginTop: "10px",
    backgroundColor: "#0F2A79",
    color: "white",
    border: "none",
    borderRadius: "6px",
    padding: "14px 16px",
    fontSize: "16px",
    fontWeight: "600",
  },
  error: {
    color: "#b91c1c",
    backgroundColor: "#fee2e2",
    borderRadius: "6px",
    padding: "10px 12px",
    fontSize: "14px",
    marginBottom: "10px",
  },
  success: {
    color: "#166534",
    backgroundColor: "#dcfce7",
    borderRadius: "6px",
    padding: "10px 12px",
    fontSize: "14px",
    marginBottom: "10px",
  },
  helperText: {
    fontSize: "12px",
    color: "#777",
  },
};
