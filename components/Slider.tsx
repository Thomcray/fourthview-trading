"use client";

import Autoplay from "embla-carousel-autoplay";
import { useState } from "react";
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
  type CarouselApi,
} from "@/components/ui/carousel";
import Image from "next/image";
import { Pause, Play } from "lucide-react";

import slideImage1 from "@/public/slides/slideImage1.jpg";
import slideImage2 from "@/public/slides/slideImage2.jpg";
import slideImage3 from "@/public/slides/slideImage3.jpg";
import slideImage4 from "@/public/slides/slideImage4.jpg";
import slideImage5 from "@/public/slides/slideImage5.jpg";
import slideImage6 from "@/public/slides/slideImage6.jpg";

const slides = [
  {
    image: slideImage1,
    title: "Welcome to Fourthview",
    subtitle: "Your trusted partner",
  },
  {
    image: slideImage2,
    title: "Factory Visits",
    subtitle: "See how things are made",
  },
  {
    image: slideImage3,
    title: "Latest Fashion",
    subtitle: "Trendy outfits & accessories",
  },
  {
    image: slideImage4,
    title: "Global Trade",
    subtitle: "Import & export services",
  },
  {
    image: slideImage5,
    title: "Travel Guide",
    subtitle: "Explore with experts",
  },
  {
    image: slideImage6,
    title: "Currency Exchange",
    subtitle: "Best rates guaranteed",
  },
];

export default function AppCarousel() {
  const [isPlaying, setIsPlaying] = useState(true);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [carouselApi, setCarouselApi] = useState<CarouselApi | null>(null);

  const autoplayPlugin = Autoplay({
    delay: 4000,
    stopOnInteraction: false,
    stopOnMouseEnter: true,
  });

  const handlePlayPause = () => {
    if (isPlaying) {
      autoplayPlugin.stop();
    } else {
      autoplayPlugin.play();
    }
    setIsPlaying(!isPlaying);
  };

  const handleDotClick = (index: number) => {
    if (carouselApi) {
      carouselApi.scrollTo(index);
    }
  };

  return (
    <div className="relative w-full">
      <Carousel
        className="w-full"
        plugins={[autoplayPlugin]}
        opts={{
          align: "center",
          loop: true,
        }}
        setApi={(api) => {
          setCarouselApi(api);
          if (api) {
            api.on("select", () => {
              setCurrentIndex(api.selectedScrollSnap());
            });
          }
        }}
      >
        <CarouselContent>
          {slides.map((slide, index) => (
            <CarouselItem key={index}>
              <div className="relative w-full h-[50vh] sm:h-[60vh] lg:h-[70vh] overflow-hidden">
                {/* Background Image */}
                <Image
                  src={slide.image}
                  alt={slide.title}
                  placeholder="blur"
                  fill
                  priority={index === 0}
                  className="object-cover object-center"
                  sizes="100vw"
                />

                {/* Dark Overlay for better text readability */}
                <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-black/30 to-transparent" />

                {/* Slide Content Overlay */}
                <div className="absolute inset-0 flex flex-col items-center justify-center text-center px-4">
                  <div className="max-w-3xl mx-auto">
                    <h2 className="text-3xl sm:text-4xl lg:text-5xl font-bold text-white mb-3 drop-shadow-lg">
                      {slide.title}
                    </h2>
                    <p className="text-base sm:text-lg lg:text-xl text-white/90 drop-shadow-md">
                      {slide.subtitle}
                    </p>
                  </div>
                </div>
              </div>
            </CarouselItem>
          ))}
        </CarouselContent>

        {/* Custom Navigation Buttons */}
        <CarouselPrevious className="left-4 sm:left-8 bg-white/80 hover:bg-white text-gray-800 border-0 shadow-md" />
        <CarouselNext className="right-4 sm:right-8 bg-white/80 hover:bg-white text-gray-800 border-0 shadow-md" />

        {/* Play/Pause Button */}
        <button
          onClick={handlePlayPause}
          className="absolute bottom-4 right-4 z-10 p-2 bg-white/80 hover:bg-white rounded-full shadow-md transition-all duration-200"
          aria-label={isPlaying ? "Pause slideshow" : "Play slideshow"}
        >
          {isPlaying ? (
            <Pause className="w-4 h-4 text-gray-700" />
          ) : (
            <Play className="w-4 h-4 text-gray-700" />
          )}
        </button>
      </Carousel>

      {/* Custom Dots Indicator */}
      <div className="absolute bottom-4 left-1/2 transform -translate-x-1/2 flex gap-2 z-10">
        {slides.map((_, index) => (
          <button
            key={index}
            onClick={() => handleDotClick(index)}
            className={`h-2 rounded-full transition-all duration-300 ${
              currentIndex === index
                ? "w-8 bg-white"
                : "w-2 bg-white/50 hover:bg-white/70"
            }`}
            aria-label={`Go to slide ${index + 1}`}
          />
        ))}
      </div>
    </div>
  );
}
