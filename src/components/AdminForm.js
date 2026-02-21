"use client";

import { useState } from "react";
import { supabase } from "@/lib/supabase";

export default function AdminForm() {
  const [title, setTitle] = useState("");
  const [slugInput, setSlugInput] = useState("");
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
      const {
        data: { user },
      } = await supabase.auth.getUser();

      if (!user) {
        throw new Error("No estás logueado. Iniciá sesión para publicar.");
      }

      const baseForSlug = (slugInput || title).toString();

      const slug = baseForSlug
        .toLowerCase()
        .trim()
        .replace(/\s+/g, "-")
        .replace(/[^\w-]+/g, "");

      if (!slug) {
        throw new Error("El título es inválido para generar el enlace (slug).");
      }

      let imageUrl = null;

      if (image) {
        const fileName = `${Date.now()}-${image.name}`;

        const { error: uploadError } = await supabase.storage
          .from("news-images")
          .upload(fileName, image);

        if (uploadError) {
          throw new Error(uploadError.message);
        }

        const { data } = supabase.storage
          .from("news-images")
          .getPublicUrl(fileName);

        imageUrl = data.publicUrl;
      }

      if (isFeatured) {
        await supabase
          .from("news")
          .update({ is_featured: false })
          .eq("is_featured", true)
          .eq("user_id", user.id);
      }

      const { error: insertError } = await supabase.from("news").insert([
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
        throw new Error(insertError.message);
      }

      setSuccessMessage("Noticia publicada correctamente ✅");

      setTitle("");
      setSlugInput("");
      setCategory("");
      setContent("");
      setImage(null);
      setIsFeatured(false);
    } catch (err) {
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
            <option value="general">Información general</option>
            <option value="proyectos">Proyectos</option>
            <option value="visitas">Visitas institucionales</option>
            <option value="juventud">Juventud</option>
            <option value="formacion">EFDAP</option>
            <option value="purpura">La Purpura</option>
            <option value="geraldine">Geraldine Calvella</option>
          </select>
        </label>

        <label style={styles.label}>
          Slug (opcional)
          <input
            type="text"
            value={slugInput}
            onChange={(e) => setSlugInput(e.target.value)}
            style={styles.input}
          />
        </label>

        <label style={styles.label}>
          Contenido
          <textarea
            value={content}
            onChange={(e) => setContent(e.target.value)}
            style={styles.textarea}
            required
          />
        </label>

        <label style={styles.label}>
          Imagen
          <input
            type="file"
            accept="image/*"
            onChange={(e) => setImage(e.target.files[0])}
          />
        </label>

        <label style={styles.checkboxRow}>
          <input
            type="checkbox"
            checked={isFeatured}
            onChange={(e) => setIsFeatured(e.target.checked)}
          />
          Destacar noticia
        </label>

        <button type="submit" disabled={loading} style={styles.button}>
          {loading ? "Publicando..." : "Publicar"}
        </button>
      </form>

      <div style={{ marginTop: "30px", textAlign: "center" }}>
        <a href="/admin/messages" style={styles.viewButton}>
          Ver mensajes recibidos
        </a>
      </div>
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
    fontSize: "26px",
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
    minHeight: "120px",
  },
  checkboxRow: {
    display: "flex",
    alignItems: "center",
    gap: "8px",
  },
  button: {
    backgroundColor: "#0F2A79",
    color: "white",
    border: "none",
    borderRadius: "6px",
    padding: "14px",
    fontSize: "16px",
    fontWeight: "600",
    cursor: "pointer",
  },
  error: {
    color: "#b91c1c",
    backgroundColor: "#fee2e2",
    padding: "10px",
    borderRadius: "6px",
  },
  success: {
    color: "#166534",
    backgroundColor: "#dcfce7",
    padding: "10px",
    borderRadius: "6px",
  },
  viewButton: {
    display: "inline-block",
    backgroundColor: "#111827",
    color: "white",
    padding: "12px 20px",
    borderRadius: "8px",
    textDecoration: "none",
    fontWeight: "600",
    fontSize: "14px",
  },
};