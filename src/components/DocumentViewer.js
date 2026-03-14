"use client";

import { useEffect, useRef, useState } from "react";
import dynamic from "next/dynamic";

const PdfViewer = dynamic(() => import("@/components/PdfViewer"), { ssr: false });

export default function DocumentViewer({ type, url }) {
  const containerRef = useRef(null);
  const [status, setStatus] = useState("loading");
  const [textContent, setTextContent] = useState("");
  const [error, setError] = useState(false);

  useEffect(() => {
    if (!url) return;
    if (type === "docx") {
      let cancelled = false;
      (async () => {
        try {
          const res = await fetch(url, { mode: "cors" });
          if (!res.ok) throw new Error("No se pudo cargar el documento");
          const blob = await res.blob();
          if (cancelled) return;
          const { renderAsync } = await import("docx-preview");
          if (!containerRef.current) return;
          containerRef.current.innerHTML = "";
          await renderAsync(blob, containerRef.current, null, {
            className: "docx-preview-wrapper",
          });
          if (cancelled) return;
          setStatus("ready");
        } catch (e) {
          if (!cancelled) {
            setError(true);
            setStatus("error");
          }
        }
      })();
      return () => { cancelled = true; };
    }
    if (type === "text") {
      let cancelled = false;
      fetch(url, { mode: "cors" })
        .then((r) => (r.ok ? r.text() : Promise.reject(new Error("No se pudo cargar"))))
        .then((text) => {
          if (!cancelled) {
            setTextContent(text);
            setStatus("ready");
          }
        })
        .catch(() => {
          if (!cancelled) {
            setError(true);
            setStatus("error");
          }
        });
      return () => { cancelled = true; };
    }
  }, [url, type]);

  if (type === "pdf") {
    return <PdfViewer url={url} />;
  }

  if (type === "doc" || type === "document") {
    const viewerUrl = `https://docs.google.com/viewer?url=${encodeURIComponent(url)}&embedded=true`;
    return (
      <div className="noticia-doc-viewer">
        <iframe
          src={viewerUrl}
          title="Visor de documento"
          className="noticia-doc-iframe"
        />
        <a href={url} target="_blank" rel="noopener noreferrer" className="noticia-pdf-link">
          Abrir documento en nueva pestaña
        </a>
      </div>
    );
  }

  if (type === "docx") {
    if (error) {
      return (
        <div className="noticia-pdf-fallback">
          <p>No se pudo cargar el documento Word.</p>
          <a href={url} target="_blank" rel="noopener noreferrer" className="noticia-pdf-link">
            Abrir en nueva pestaña
          </a>
        </div>
      );
    }
    return (
      <div className="noticia-docx-viewer">
        {status === "loading" && <div className="noticia-pdf-loading">Cargando documento…</div>}
        <div ref={containerRef} className="noticia-docx-container" />
        <a href={url} target="_blank" rel="noopener noreferrer" className="noticia-pdf-link">
          Abrir documento en nueva pestaña
        </a>
      </div>
    );
  }

  if (type === "text") {
    if (error) {
      return (
        <div className="noticia-pdf-fallback">
          <p>No se pudo cargar el archivo de texto.</p>
          <a href={url} target="_blank" rel="noopener noreferrer" className="noticia-pdf-link">
            Abrir en nueva pestaña
          </a>
        </div>
      );
    }
    return (
      <div className="noticia-text-viewer">
        {status === "loading" && <div className="noticia-pdf-loading">Cargando texto…</div>}
        {status === "ready" && (
          <pre className="noticia-text-content">{textContent}</pre>
        )}
        <a href={url} target="_blank" rel="noopener noreferrer" className="noticia-pdf-link">
          Abrir archivo en nueva pestaña
        </a>
      </div>
    );
  }

  return null;
}
