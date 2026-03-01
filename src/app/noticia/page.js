import { redirect } from "next/navigation";
import Image from "next/image";
import Link from "next/link";
import { supabase } from "@/lib/supabase";

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
        {article.image_url && (
          <div className="noticia-image-wrapper">
            <Image
              src={article.image_url}
              alt={article.title}
              width={900}
              height={500}
              className="noticia-image"
            />
          </div>
        )}
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
        .noticia-image-wrapper {
          width: 100%;
          border-radius: 14px;
          overflow: hidden;
          margin-bottom: 20px;
          box-shadow: 0 8px 24px rgba(0,0,0,0.08);
        }
        .noticia-image {
          width: 100%;
          height: auto;
          display: block;
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
