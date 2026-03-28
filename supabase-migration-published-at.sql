-- Fecha de publicación real (independiente de cuándo se subió la noticia).
-- Ejecutá este script en el SQL Editor de Supabase si la columna aún no existe.

ALTER TABLE news ADD COLUMN IF NOT EXISTS published_at timestamptz DEFAULT now();

UPDATE news
SET published_at = COALESCE(published_at, created_at)
WHERE published_at IS NULL;
