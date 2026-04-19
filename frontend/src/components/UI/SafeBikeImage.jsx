import React, { useEffect, useState } from "react";
import { FALLBACK_BIKE_IMAGE, getBikeImageUrl } from "../../utils/bikeData";

const SafeBikeImage = ({ bike, src, alt, className = "", ...props }) => {
  const resolved = src || getBikeImageUrl(bike);
  const [currentSrc, setCurrentSrc] = useState(resolved);

  useEffect(() => {
    setCurrentSrc(resolved);
  }, [resolved]);

  return (
    <img
      src={currentSrc}
      alt={alt || bike?.name || "Bike"}
      className={className}
      onError={(event) => {
        if (event.currentTarget.src.includes(FALLBACK_BIKE_IMAGE)) return;
        setCurrentSrc(FALLBACK_BIKE_IMAGE);
      }}
      {...props}
    />
  );
};

export default SafeBikeImage;
