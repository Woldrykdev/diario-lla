-- Ejecutá este script en el SQL Editor de Supabase para permitir
-- la categoría "geraldine" (y asegurar que todas las del sitio estén permitidas).

ALTER TABLE news DROP CONSTRAINT IF EXISTS news_category_check;

ALTER TABLE news ADD CONSTRAINT news_category_check
  CHECK (category IN (
    'general',
    'proyectos',
    'visitas',
    'juventud',
    'formacion',
    'purpura',
    'geraldine'
  ));
