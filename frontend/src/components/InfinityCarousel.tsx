
import img1 from "../assets/img1.png";
import img2 from "../assets/img2.jpeg";
import img3 from "../assets/img3.jpeg";
import prod1 from "../assets/prod1.jpg";
import prod2 from "../assets/prod2.jpg";
import prod3 from "../assets/prod3.jpg";

import React, { useState, useEffect } from "react";

// Image sources array
const images: string[] = [img1, img2, img3, prod1, prod2, prod3];

// Function to get a random image different from the current ones
const getRandomImage = (excludedImages: string[]) => {
  let newImage;
  do {
    newImage = images[Math.floor(Math.random() * images.length)];
  } while (excludedImages.includes(newImage));
  return newImage;
};

const InfiniteCarousel: React.FC = () => {
  
  // Check screen size & set the number of images accordingly (4 for desktop, 2 for mobile)
  const getInitialImages = () => {
    return window.innerWidth < 768 ? images.slice(0, 2) : images.slice(0, 4);
  };

  const [currentImages, setCurrentImages] = useState<string[]>(getInitialImages);
  const [fadeOutIndex, setFadeOutIndex] = useState<number | null>(null);

  useEffect(() => {
    const handleResize = () => {
      setCurrentImages(getInitialImages());
    };

    window.addEventListener("resize", handleResize);

    // Start changing images after a delay of 10s, then every 3s
    const interval = setTimeout(() => {
      setInterval(() => {
        const randomIndex = Math.floor(Math.random() * currentImages.length); // Pick a random index
        setFadeOutIndex(randomIndex); // Trigger fade-out effect

        setTimeout(() => {
          setCurrentImages((prev) => {
            const newImages = [...prev];
            newImages[randomIndex] = getRandomImage(newImages); // Replace only one image
            return [...newImages];
          });
          setFadeOutIndex(null); // Reset fade effect after changing the image
        }, 500); // Wait for fade-out to complete before changing the image
      }, 3000);
    }, 5000);

    return () => {
      clearTimeout(interval);
      window.removeEventListener("resize", handleResize);
    };
  }, []);

  return (
    <div className="mt-4 flex justify-center items-center w-screen gap-4">
      {currentImages.map((src, index) => (
        <img
          key={index}
          src={src}
          alt={`carousel-img-${index}`}
          className={`w-1/2 md:w-1/4 h-[60vh] object-cover rounded-lg transition-opacity duration-500 ${
            fadeOutIndex === index ? "opacity-0" : "opacity-100"
          }`}
        />
      ))}
    </div>
  );
};

export default InfiniteCarousel;
