import { useEffect, useState } from "react";
import { supabase } from "../lib/supabase";
import TileCard from "../components/TileCard";

export default function Catalog() {
  const [tiles, setTiles] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    supabase
      .from("tiles")
      .select("*")
      .order("name")
      .then(({ data, error }) => {
        if (error) setError(error.message);
        else setTiles(data);
        setLoading(false);
      });
  }, []);

  if (loading) return <p>Загрузка...</p>;
  if (error) return <p>Ошибка: {error}</p>;

  return (
    <>
      <h1>Каталог</h1>
      <div className="grid">
        {tiles.map((t) => (
          <TileCard key={t.id} tile={t} />
        ))}
      </div>
    </>
  );
}