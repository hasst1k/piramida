import { brands } from "../config/categories";

export default function BrandTicker() {
  const items = [...brands, ...brands]; // дубль для бесшовной прокрутки
  return (
    <div className="ticker">
      <div className="ticker-track">
        {items.map((b, i) => (
          <span key={i} className="ticker-item">{b}</span>
        ))}
      </div>
    </div>
  );
}