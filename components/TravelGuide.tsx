"use client";

import Image from "next/image";
import { Button } from "./ui/button";

import factoryImage from "@/public/factoryImage.png";
import { useRouter } from "next/navigation";

export default function TravelGuide() {
  const router = useRouter();
  return (
    <section className="w-full flex items-center border-0 px-8 sm:px-2 max-sm:px-4 bg-blue-50">
      <div className="flex flex-row max-sm:flex-col-reverse mx-auto justify-between sm:space-x-4 px-4 w-full sm:px-6 lg:px-8 text-center items-center border-0">
        <div>
          <Image
            src={factoryImage}
            placeholder="blur"
            alt="shop-with-us"
            height={300}
            width={500}
          />
        </div>

        <div className="w-1/2 max-sm:w-full py-8 items-center flex flex-col border-0 space-y-4">
          <h1 className="font-bold text-3xl w-96 max-sm:w-80 text-center text-blue-950">
            Travel Guide/ Factory Visit
          </h1>

          <p className="lg:text-lg leading-8 sm:text-base text-left max-sm:text-center w-full">
            Our platform connects you with unique, immersive factory visit
            experiences that reveal the artistry innovation behind modern
            manufacturing.
          </p>

          <Button
            variant="outline"
            className="text-white bg-blue-950 self-start"
            onClick={() => {
              router.push("/travel");
            }}
          >
            Get Started
          </Button>
        </div>
      </div>
    </section>
  );
}
