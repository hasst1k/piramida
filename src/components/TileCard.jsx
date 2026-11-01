import { Link } from "react-router-dom";

export default function TileCard({ tile }) {
  return (
    <Link to={`/catalog/${tile.id}`} className="card">
      <img src={tile.image} alt={tile.name} />
      <h3>{tile.name}</h3>
      <p className="muted">{tile.collection} · {tile.size} см</p>
      <p className="price">{tile.price} за м²</p>
    </Link>
  );
}