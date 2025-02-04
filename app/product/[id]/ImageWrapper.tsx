"use client";

import Image from "next/image";
import { Swiper, SwiperSlide } from "swiper/react";
import { useState } from "react";
import "swiper/css";

type ImageWrapperProps = {
  images: string[];
};

export default function ImageWrapper({ images }: ImageWrapperProps) {
  const [activeIndex, setActiveIndex] = useState(0); // Track current image index

  return (
    <div className="w-full max-w-md relative">
      <Swiper
        spaceBetween={10}
        slidesPerView={1}
        onSlideChange={(swiper) => setActiveIndex(swiper.activeIndex)} // Update index on slide change
        className="w-full"
      >
        {images.map((image, index) => (
          <SwiperSlide key={index}>
            <Image
              src={image}
              alt={`Image ${index + 1}`}
              width={400}
              height={400}
              className="object-cover w-full"
            />
          </SwiperSlide>
        ))}
      </Swiper>

      {/* Image count display centered at the bottom */}
      <div className="absolute bottom-4 z-30 left-1/2 transform -translate-x-1/2 bg-black/60 text-white text-sm px-3 py-1 rounded-full">
        {activeIndex + 1} / {images.length}
      </div>
    </div>
  );
}
