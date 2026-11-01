import { useParams, Link } from "react-router-dom";
import { tiles } from "../data/tiles";

export default function ProductPage() {
  const { id } = useParams();
  const tile = tiles.find((t) => t.id === Number(id));

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