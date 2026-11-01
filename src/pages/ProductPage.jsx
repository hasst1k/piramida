import { useEffect, useState } from "react";
import { useParams, Link } from "react-router-dom";
import { supabase } from "../lib/supabase";

export default function ProductPage() {
  const { id } = useParams();
  const [tile, setTile] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    supabase
      .from("tiles")
      .select("*")
      .eq("id", id)
      .maybeSingle()
      .then(({ data }) => {
        setTile(data);
        setLoading(false);
      });
  }, [id]);

  if (loading) return <p>Загрузка...</p>;
  if (!tile) {
    return (
      <>
        <p>Товар не найден.</p>
        <Link to="/catalog">← Назад в каталог</Link>
      </>
    );
  }

  return (
    <>
      <Link to="/catalog">← Назад в каталог</Link>
      <div className="product">
        <img src={tile.image} alt={tile.name} />
        <div>
          <h1>{tile.name}</h1>
          <p className="muted">Коллекция: {tile.collection}</p>
          <p>Размер: {tile.size} см</p>
          <p className="price">{tile.price} за м²</p>
          <button className="button">Добавить в корзину</button>
        </div>
      </div>
    </>
  );
}