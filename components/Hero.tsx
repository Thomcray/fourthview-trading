import Image from "next/image";
import { Menu } from "lucide-react";
import { Button } from "./ui/button";

import heroImage from "@/public/heroImage.png";

export default function Hero() {
  return (
    <section className="w-full border-0 flex flex-col">
      <div className="relative flex flex-col mx-auto py-12 px-4 w-full sm:px-6 lg:px-8 text-center items-center border-0 space-y-6">
        <Image src={heroImage} fill placeholder="blur" alt="hero-image" />

        <p className="lg:w-2xl mx-sm:w-full mt-6 text-lg leading-8 text-blue-950 opacity-80 font-semibold">
          From the latest fashionable outfits to shoes and accessories, import
          to export of goods, factory visits, travel, guide, and currency
          exchange
        </p>

        <h1 className="max-sm:text-4xl font-extrabold text-blue-950 sm:text-5xl lg:text-5xl">
          Fourth View has you covered
        </h1>

        <Button
          variant="outline"
          className="absolute top-4 left-4 bg-blue-950 text-white flex items-center cursor-pointer hover:text-blue-950"
        >
          All Categories
          <Menu className="ml-2 text-white" strokeWidth={2} size={20} />
        </Button>
      </div>

      <div className="bg-blue-950 text-white text-center py-8 px-4 sm:px-6 lg:px-8 space-y-2">
        <p className="lg:text-xl font-normal">
          Our platform delivers a smooth, seamless experience
        </p>
        <h1 className="max-sm:text-2xl text-4xl font-bold">
          Even for first time users
        </h1>
      </div>
    </section>
  );
}
