-- Ejecutá este script en el SQL Editor de Supabase para asegurar
-- que todas las categorías del sitio estén permitidas.

ALTER TABLE news DROP CONSTRAINT IF EXISTS news_category_check;

ALTER TABLE news ADD CONSTRAINT news_category_check
  CHECK (category IN (
    'general',
    'informacion_general',
    'proyectos',
    'visitas',
    'juventud',
    'formacion',
    'purpura',
    'geraldine'
  ));
