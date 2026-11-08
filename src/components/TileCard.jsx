
import { useEffect, useState } from "react";
import { Link } from "react-router-dom";

const fallbackImages = {
  tile: "/images/placeholder-plitka.png",
  porcelain: "/images/placeholder-keramogranit.png",
  laminate: "/images/placeholder-laminat.png",
};

export default function TileCard({ tile }) {
  const fallbackImage =
    fallbackImages[tile.category] || fallbackImages.tile;

  const [imageSrc, setImageSrc] = useState(
    tile.image || fallbackImage
  );

  const [imageFailed, setImageFailed] = useState(false);

  useEffect(() => {
    setImageSrc(tile.image || fallbackImage);
    setImageFailed(false);
  }, [tile.image, fallbackImage]);

  function handleImageError() {
    if (imageSrc !== fallbackImage) {
      setImageSrc(fallbackImage);
    } else {
      setImageFailed(true);
    }
  }

  return (
    <Link to={`/product/${tile.id}`} className="card">
      <div className="card-image">
        {!imageFailed && (
          <img
            src={imageSrc}
            alt={tile.name}
            onError={handleImageError}
          />
        )}

        {(!tile.image || imageSrc === fallbackImage || imageFailed) && (
          <div className="card-image-label">
            Фото товара отсутствует
          </div>
        )}
      </div>

      <h3>{tile.name}</h3>

      <p className="muted">
        {tile.collection} · {tile.size} см
      </p>

      <p className="price">
        {tile.price} за м²
      </p>
    </Link>
  );
}
