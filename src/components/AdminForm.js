"use client";

import { useState } from "react";
import { supabase } from "@/lib/supabase";

const MEDIA_IMAGE = "image";
const MEDIA_VIDEO = "video";

export default function AdminForm() {
  const [title, setTitle] = useState("");
  const [slugInput, setSlugInput] = useState("");
  const [category, setCategory] = useState("");
  const [content, setContent] = useState("");
  const [imageFiles, setImageFiles] = useState([]);
  const [videoEntries, setVideoEntries] = useState([]);
  const [videoUrlInput, setVideoUrlInput] = useState("");
  const [isFeatured, setIsFeatured] = useState(false);
  const [loading, setLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");
  const [successMessage, setSuccessMessage] = useState("");

  const addImageFiles = (e) => {
    const files = Array.from(e.target.files || []);
    setImageFiles((prev) => [...prev, ...files]);
    e.target.value = "";
  };

  const removeImage = (index) => {
    setImageFiles((prev) => prev.filter((_, i) => i !== index));
  };

  const addVideoFile = (e) => {
    const file = e.target.files?.[0];
    if (file) {
      setVideoEntries((prev) => [...prev, { type: "file", file }]);
      e.target.value = "";
    }
  };

  const addVideoUrl = () => {
    const url = videoUrlInput.trim();
    if (url) {
      setVideoEntries((prev) => [...prev, { type: "url", url }]);
      setVideoUrlInput("");
    }
  };

  const removeVideo = (index) => {
    setVideoEntries((prev) => prev.filter((_, i) => i !== index));
  };

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

      const media = [];
      let imageUrl = null;

      for (const file of imageFiles) {
        const fileName = `img-${Date.now()}-${Math.random().toString(36).slice(2)}-${file.name}`;
        const { error: uploadError } = await supabase.storage
          .from("news-images")
          .upload(fileName, file);

        if (uploadError) throw new Error(uploadError.message);

        const { data } = supabase.storage.from("news-images").getPublicUrl(fileName);
        const url = data.publicUrl;
        media.push({ type: MEDIA_IMAGE, url });
        if (!imageUrl) imageUrl = url;
      }

      for (const entry of videoEntries) {
        if (entry.type === "url") {
          media.push({ type: MEDIA_VIDEO, url: entry.url });
        } else {
          const file = entry.file;
          const ext = (file.name.split(".").pop() || "mp4").toLowerCase();
          const fileName = `vid-${Date.now()}-${Math.random().toString(36).slice(2)}.${ext}`;
          const { error: uploadError } = await supabase.storage
            .from("news-images")
            .upload(fileName, file);

          if (uploadError) throw new Error(uploadError.message);

          const { data } = supabase.storage.from("news-images").getPublicUrl(fileName);
          media.push({ type: MEDIA_VIDEO, url: data.publicUrl });
        }
      }

      if (isFeatured) {
        await supabase
          .from("news")
          .update({ is_featured: false })
          .eq("is_featured", true)
          .eq("user_id", user.id);
      }

      const payload = {
        title,
        content,
        slug,
        category: (category && category.trim()) ? category.trim() : "general",
        image_url: imageUrl,
        is_featured: isFeatured,
        published: true,
        user_id: user.id,
      };

      if (media.length > 0) {
        payload.media = media;
      }

      const { error: insertError } = await supabase.from("news").insert([payload]);

      if (insertError) {
        throw new Error(insertError.message);
      }

      setSuccessMessage("Noticia publicada correctamente ✅");
      setTitle("");
      setSlugInput("");
      setCategory("");
      setContent("");
      setImageFiles([]);
      setVideoEntries([]);
      setVideoUrlInput("");
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

        <div style={styles.label}>
          <span style={{ marginBottom: 6, display: "block", fontWeight: 600 }}>Fotos (podés subir varias)</span>
          <input
            type="file"
            accept="image/*"
            multiple
            onChange={addImageFiles}
          />
          {imageFiles.length > 0 && (
            <ul style={styles.mediaList}>
              {imageFiles.map((file, i) => (
                <li key={i} style={styles.mediaItem}>
                  {file.name}
                  <button type="button" onClick={() => removeImage(i)} style={styles.removeBtn}>
                    Quitar
                  </button>
                </li>
              ))}
            </ul>
          )}
        </div>

        <div style={styles.label}>
          <span style={{ marginBottom: 6, display: "block", fontWeight: 600 }}>Videos (opcional)</span>
          <p style={{ fontSize: 13, color: "#666", marginBottom: 8 }}>
            Subí un archivo de video o pegá una URL (YouTube, Vimeo o enlace directo .mp4).
          </p>
          <div style={{ display: "flex", gap: 8, flexWrap: "wrap", alignItems: "center", marginBottom: 8 }}>
            <input
              type="file"
              accept="video/*"
              onChange={addVideoFile}
            />
            <input
              type="url"
              placeholder="https://youtube.com/... o URL del video"
              value={videoUrlInput}
              onChange={(e) => setVideoUrlInput(e.target.value)}
              style={{ ...styles.input, flex: 1, minWidth: 200 }}
            />
            <button type="button" onClick={addVideoUrl} style={styles.addUrlBtn}>
              Añadir URL
            </button>
          </div>
          {videoEntries.length > 0 && (
            <ul style={styles.mediaList}>
              {videoEntries.map((entry, i) => (
                <li key={i} style={styles.mediaItem}>
                  {entry.type === "file" ? entry.file.name : entry.url}
                  <button type="button" onClick={() => removeVideo(i)} style={styles.removeBtn}>
                    Quitar
                  </button>
                </li>
              ))}
            </ul>
          )}
        </div>

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
  mediaList: {
    listStyle: "none",
    padding: 0,
    margin: "8px 0 0 0",
  },
  mediaItem: {
    display: "flex",
    alignItems: "center",
    justifyContent: "space-between",
    padding: "8px 10px",
    background: "#f5f5f5",
    borderRadius: 6,
    marginBottom: 6,
    fontSize: 14,
  },
  removeBtn: {
    background: "#dc2626",
    color: "white",
    border: "none",
    padding: "4px 10px",
    borderRadius: 4,
    cursor: "pointer",
    fontSize: 12,
  },
  addUrlBtn: {
    background: "#0F2A79",
    color: "white",
    border: "none",
    padding: "12px 16px",
    borderRadius: 6,
    cursor: "pointer",
    fontSize: 14,
    fontWeight: 600,
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
