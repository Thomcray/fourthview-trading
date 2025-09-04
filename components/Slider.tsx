"use client";

import Autoplay from "embla-carousel-autoplay";

import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from "@/components/ui/carousel";
import { Card } from "./ui/card";

import Image from "next/image";

import slideImage1 from "@/public/slides/slideImage1.jpg";
import slideImage2 from "@/public/slides/slideImage2.jpg";
import slideImage3 from "@/public/slides/slideImage3.jpg";
import slideImage4 from "@/public/slides/slideImage4.jpg";
import slideImage5 from "@/public/slides/slideImage5.jpg";
import slideImage6 from "@/public/slides/slideImage6.jpg";

export default function AppCarousel() {
  const images = [
    slideImage1,
    slideImage2,
    slideImage3,
    slideImage4,
    slideImage5,
    slideImage6,
  ];
  return (
    <div className="w-full flex items-center border-0 px-4">
      <Carousel
        className="w-full border-0"
        plugins={[Autoplay({ delay: 3000 })]}
      >
        <CarouselContent className="border-0">
          {images.map((image, index) => (
            <CarouselItem key={index}>
              <div className="p-1">
                <Card className="relative w-full h-96 p-0">
                  <Image
                    src={image}
                    alt="carousel-images"
                    placeholder="blur"
                    fill
                    className={`${
                      image.src.includes("slideImage1")
                        ? "w-full h-full object-top object-cover"
                        : "w-full h-full object-center object-cover"
                    }`}
                  />
                </Card>
              </div>
            </CarouselItem>
          ))}
        </CarouselContent>
        <CarouselPrevious className="max-sm:hidden" />
        <CarouselNext className="max-sm:hidden" />
      </Carousel>
    </div>
  );
}
