import Image from "next/image";
import { Button } from "./ui/button";

import furnitureImage from "@/public/furnitureImage.png";

export default function FurnitureSection() {
  return (
    <section className="w-full flex items-center border-0 px-8 py-12 sm:px-2 max-sm:px-4 bg-blue-50">
      <div className="flex flex-row max-sm:flex-col mx-auto justify-between space-x-4 px-4 w-full sm:px-6 lg:px-8 text-center items-center border-0">
        <div className="w-1/2 max-sm:w-full py-8 items-center flex flex-col border-0 space-y-4">
          <h1 className="font-bold text-3xl w-96 max-sm:w-80 text-center">
            Furniture
          </h1>

          <p className="lg:text-lg sm:text-base leading-8 text-left max-sm:text-center w-full">
            From sleek contemporary pieces to timeless classics, we've got
            something for every aesthetic. Elevate your space with elegance and
            comfort.
          </p>

          <Button
            variant="outline"
            className="text-white bg-blue-950 self-start"
          >
            Get Started
          </Button>
        </div>

        <div>
          <Image
            src={furnitureImage}
            placeholder="blur"
            alt="shop-with-us"
            height={300}
            width={500}
          />
        </div>
      </div>
    </section>
  );
}
