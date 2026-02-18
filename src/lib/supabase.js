import { createClient } from "@supabase/supabase-js";

// Cliente compartido para servidor y cliente usando la ANON KEY pública.
// Asegúrate de que tus políticas de RLS en Supabase estén bien configuradas.
export const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY
);
