import React from "react";
import "../Features/InfiniteCarousel.css";
import Image from 'next/image';

const InfiniteCarousel: React.FC = () => {
  return (
    <div className="slider relative w-full h-[150px] md:h-[150px] overflow-hidden bg-white dark:bg-[#111928]">
      {/* Left gradient */}
      <div className="absolute inset-y-0 left-0 w-[200px] bg-gradient-to-r z-10"></div>

      {/* Right gradient */}
      <div className="absolute inset-y-0 right-0 w-[200px] bg-gradient-to-l z-10"></div>

      {/* Slider track */}
      <div className="slide-track flex animate-scroll">
        {Array(3)
          .fill([
            "https://imgix.datadoghq.com/img/dd_logo_n_70x75.png?ch=Width,DPR&fit=max&auto=format&w=70&h=75&dpr=2",
            "https://img.icons8.com/?size=100&id=wU62u24brJ44&format=png&color=000000",
            "https://img.icons8.com/?size=100&id=24662&format=png&color=228BE6",
            "https://img.icons8.com/?size=96&id=fpGM2cINbbu4&format=png",
            "https://img.icons8.com/?size=100&id=12599&format=png&color=228BE6",
            "https://img.icons8.com/?size=160&id=RduYmqw5H7xm&format=png",
            "https://img.icons8.com/?size=100&id=uVERmCBZZACL&format=png&color=228BE6",
            "https://img.icons8.com/?size=100&id=fUGx53gD9Jof&format=png&color=000000"
          ])
          .flat()
          .map((src, index) => (
            <div key={index} className="slide flex-shrink-0 w-[200px] h-[150px] flex items-center justify-center">
              <Image src={src} alt={`Slide ${index + 1}`} className="w-full h-[90px] object-contain" width={500} height={300} />
            </div>
          ))}
      </div>
    </div>
  );
};

export default InfiniteCarousel;
