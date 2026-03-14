-- Ejecutá este script en el SQL Editor de tu proyecto Supabase
-- para habilitar múltiples fotos y videos por publicación.

ALTER TABLE news
ADD COLUMN IF NOT EXISTS media jsonb DEFAULT '[]';

COMMENT ON COLUMN news.media IS 'Array de { type: "image"|"video", url: string } para fotos y videos de la noticia';
