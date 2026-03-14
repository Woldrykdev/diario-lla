import { redirect } from "next/navigation";
import Link from "next/link";
import { supabase } from "@/lib/supabase";
import MediaGallery from "@/components/MediaGallery";

export const dynamic = "force-dynamic";

export default async function NoticiaPage({ searchParams }) {
  const params = typeof searchParams?.then === "function" ? await searchParams : searchParams;
  const slug = typeof params?.slug === "string" ? params.slug.trim() : null;

  if (!slug) {
    redirect("/");
  }

  const { data: article, error } = await supabase
    .from("news")
    .select("*")
    .eq("slug", slug)
    .maybeSingle();

  if (error || !article) {
    redirect("/");
  }

  const formattedDate = article.created_at
    ? new Date(article.created_at).toLocaleDateString("es-AR", {
        day: "2-digit",
        month: "2-digit",
        year: "numeric",
      })
    : null;

  const content = article.content || "";
  const isHtml = /<[a-z][\s\S]*>/i.test(content);

  return (
    <div className="noticia-container">
      <Link href="/" className="noticia-back">
        ← Volver a noticias
      </Link>

      <article className="noticia-article">
        <MediaGallery
          media={article.media}
          imageUrlFallback={article.image_url}
          title={article.title}
        />
        {formattedDate && <p className="noticia-date">{formattedDate}</p>}
        <h1 className="noticia-title">{article.title}</h1>
        <div
          className="noticia-body"
          {...(isHtml ? { dangerouslySetInnerHTML: { __html: content } } : {})}
        >
          {!isHtml && content}
        </div>
      </article>

      <style>{`
        .noticia-container {
          max-width: 720px;
          margin: 40px auto;
          padding: 0 20px;
        }
        .noticia-back {
          display: inline-block;
          margin-bottom: 24px;
          color: #0070f3;
          text-decoration: none;
          font-size: 15px;
          font-weight: 500;
        }
        .noticia-back:hover {
          text-decoration: underline;
        }
        .noticia-article {
          margin-bottom: 60px;
        }
        .noticia-media-gallery {
          display: flex;
          flex-direction: column;
          gap: 20px;
          margin-bottom: 24px;
        }
        .noticia-image-wrapper {
          width: 100%;
          border-radius: 14px;
          overflow: hidden;
          box-shadow: 0 8px 24px rgba(0,0,0,0.08);
        }
        .noticia-image {
          width: 100%;
          height: auto;
          display: block;
        }
        .noticia-video-wrapper {
          width: 100%;
          border-radius: 14px;
          overflow: hidden;
          box-shadow: 0 8px 24px rgba(0,0,0,0.08);
          aspect-ratio: 16 / 9;
          background: #111;
        }
        .noticia-video-iframe {
          width: 100%;
          height: 100%;
          border: 0;
        }
        .noticia-video-tag {
          width: 100%;
          height: 100%;
          object-fit: contain;
        }
        .noticia-video-link {
          display: flex;
          align-items: center;
          justify-content: center;
          width: 100%;
          min-height: 200px;
          color: #fff;
          text-decoration: none;
          font-size: 18px;
        }
        .noticia-pdf-wrapper {
          width: 100%;
          border-radius: 14px;
          overflow: hidden;
          box-shadow: 0 8px 24px rgba(0,0,0,0.08);
          background: #f5f5f5;
          margin-bottom: 8px;
        }
        .noticia-pdf-link {
          display: inline-block;
          padding: 10px 16px;
          background: #0F2A79;
          color: white;
          text-decoration: none;
          font-size: 14px;
          font-weight: 600;
          border-radius: 8px;
          margin: 12px 0 12px 12px;
        }
        .noticia-pdf-link:hover {
          opacity: 0.9;
        }
        .noticia-pdf-iframe {
          width: 100%;
          height: 600px;
          border: 0;
          display: block;
        }
        @media (max-width: 768px) {
          .noticia-pdf-iframe {
            height: 400px;
          }
        }
        .noticia-date {
          font-size: 14px;
          color: #777;
          margin: 0 0 8px 0;
        }
        .noticia-title {
          font-size: 28px;
          font-weight: 700;
          line-height: 1.3;
          margin: 0 0 20px 0;
          color: #111;
        }
        .noticia-body {
          font-size: 17px;
          line-height: 1.75;
          color: #333;
          white-space: pre-wrap;
        }
        .noticia-body p {
          margin: 0 0 1em 0;
        }
        .noticia-body p:last-child {
          margin-bottom: 0;
        }
        @media (max-width: 768px) {
          .noticia-title {
            font-size: 22px;
          }
          .noticia-body {
            font-size: 16px;
          }
        }
      `}</style>
    </div>
  );
}
