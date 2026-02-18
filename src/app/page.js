import { supabase } from "@/lib/supabase";
import NewsList from "@/components/NewsList";

export const dynamic = "force-dynamic";

export default async function Home() {
  const { data: news, error } = await supabase
    .from("news")
    .select("*")
    .order("created_at", { ascending: false });

  if (error) {
    console.error(error);
    return <p>Error cargando noticias</p>;
  }

  return (
    <div style={styles.container}>
      <NewsList news={news || []} />
    </div>
  );
}

const styles = {
  container: {
    maxWidth: "1200px",
    margin: "40px auto",
    padding: "0 20px",
  },
};
