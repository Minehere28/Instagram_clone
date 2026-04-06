import { useMemo, useState } from "react";

function ImageCarousel({ images = [], altPrefix = "post image" }) {
  const normalizedImages = useMemo(
    () =>
      images
        .map((item) => item?.image?.url || item?.image_url)
        .filter(Boolean),
    [images]
  );

  const [index, setIndex] = useState(0);

  if (!normalizedImages.length) {
    return null;
  }

  const isSingle = normalizedImages.length === 1;
  const current = normalizedImages[index];

  const handlePrev = () => {
    setIndex((prev) => (prev === 0 ? normalizedImages.length - 1 : prev - 1));
  };

  const handleNext = () => {
    setIndex((prev) => (prev + 1) % normalizedImages.length);
  };

  return (
    <div className="image-carousel">
      <img src={current} alt={`${altPrefix} ${index + 1}`} className="post-image" />

      {!isSingle ? (
        <>
          <button type="button" className="carousel-btn carousel-btn-left" onClick={handlePrev}>
            ‹
          </button>
          <button type="button" className="carousel-btn carousel-btn-right" onClick={handleNext}>
            ›
          </button>
          <div className="carousel-indicator">
            {index + 1} / {normalizedImages.length}
          </div>
        </>
      ) : null}
    </div>
  );
}

export default ImageCarousel;
