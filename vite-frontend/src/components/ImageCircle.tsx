import { FC } from "react";
import style from "./ImageCircle.module.css"; // Import the CSS module

interface ImageCircleProps {
  images: { src: string; alt?: string; url?: string }[]; // Define the type for the images prop
}

const ImageCircle: FC<ImageCircleProps> = ({ images }) => {
  const imageCount = images.length;
  const rotationAngle = 360 / imageCount; // Calculate the rotation angle for even spacing

  return (
    <div className={style.circleContainer}>
      {images.map((image, index) => (
        <a href={image.url} target="_blank">
          <img
            key={index}
            src={image.src}
            alt={image.alt ?? `Image ${index + 1}`}
            style={{
              transform: `rotate(${
                rotationAngle * index
              }deg) translate(100px) rotate(${rotationAngle * index}deg)`,
              animation: `${style.fadeIn} 1s ease-out forwards, ${
                style.rotateAroundCircle
              } ${imageCount * 2}s linear infinite`,
              animationDelay: `${index * 2 + 1}s`,
            }}
            className={style.circleImage}
          />
        </a>
      ))}
    </div>
  );
};

export default ImageCircle;
