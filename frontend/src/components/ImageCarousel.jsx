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
          <button type="button" className="carousel-btn carousel-btn-left" onClick={handlePrev} aria-label="Previous image">
            <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><polyline points="15 18 9 12 15 6"/></svg>
          </button>
          <button type="button" className="carousel-btn carousel-btn-right" onClick={handleNext} aria-label="Next image">
            <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><polyline points="9 18 15 12 9 6"/></svg>
          </button>
          <div className="carousel-dots">
            {normalizedImages.map((_img, i) => (
              <button
                key={i}
                type="button"
                className={`carousel-dot ${i === index ? "is-active" : ""}`}
                onClick={() => setIndex(i)}
                aria-label={`Go to image ${i + 1}`}
              />
            ))}
          </div>
        </>
      ) : null}
    </div>
  );
}

export default ImageCarousel;
