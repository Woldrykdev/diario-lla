"use client";

import { useState } from "react";
import { Document, Page, pdfjs } from "react-pdf";
import "react-pdf/dist/Page/AnnotationLayer.css";
import "react-pdf/dist/Page/TextLayer.css";

pdfjs.GlobalWorkerOptions.workerSrc = `//unpkg.com/pdfjs-dist@${pdfjs.version}/build/pdf.worker.min.mjs`;

export default function PdfViewer({ url, title = "PDF" }) {
  const [numPages, setNumPages] = useState(null);
  const [error, setError] = useState(false);

  function onLoadSuccess({ numPages }) {
    setNumPages(numPages);
    setError(false);
  }

  function onLoadError() {
    setError(true);
  }

  if (error) {
    return (
      <div className="noticia-pdf-fallback">
        <p>No se pudo cargar el PDF.</p>
        <a href={url} target="_blank" rel="noopener noreferrer" className="noticia-pdf-link">
          Abrir PDF en nueva pestaña
        </a>
      </div>
    );
  }

  return (
    <div className="noticia-pdf-viewer">
      <Document
        file={url}
        onLoadSuccess={onLoadSuccess}
        onLoadError={onLoadError}
        loading={
          <div className="noticia-pdf-loading">Cargando PDF…</div>
        }
        options={{ standardFontDataUrl: undefined, cMapUrl: undefined, cMapPacked: false }}
      >
        {numPages != null &&
          Array.from(new Array(numPages), (_, i) => (
            <Page
              key={i}
              pageNumber={i + 1}
              width={700}
              renderTextLayer
              renderAnnotationLayer
              className="noticia-pdf-page"
            />
          ))}
      </Document>
      {numPages != null && numPages > 1 && (
        <p className="noticia-pdf-pagenum">{numPages} página{numPages !== 1 ? "s" : ""}</p>
      )}
      <a href={url} target="_blank" rel="noopener noreferrer" className="noticia-pdf-link">
        Abrir PDF en nueva pestaña
      </a>
    </div>
  );
}
