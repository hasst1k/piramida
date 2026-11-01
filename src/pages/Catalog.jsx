import { tiles } from "../data/tiles";
import TileCard from "../components/TileCard";

export default function Catalog() {
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