import shopWithUsImage from "@/public/shopWith.png";
import Image from "next/image";
import { Button } from "./ui/button";

export default function ShopWithUs() {
  return (
    <section className="w-full flex items-center border-0 px-8 sm:px-2 py-12 max-sm:px-4 bg-blue-50">
      <div className="flex flex-row max-sm:flex-col sm:space-x-4 mx-auto justify-between px-4 w-full sm:px-6 lg:px-8 text-center items-center border-0">
        <div className="w-1/2 max-sm:w-full py-8 items-center flex flex-col border-0 space-y-4">
          <h1 className="font-bold text-3xl w-96 text-center text-blue-950">
            Shop with us
          </h1>

          <p className="lg:text-lg leading-8 sm:text-md text-left sm:text-base max-sm:text-center w-full">
            Whether you&apos;re hunting for everyday essentials or that one
            special find, our intuitive layout and smart search features ensure
            you get exactly what you need with minimal fuss. Dive in and explore
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
            src={shopWithUsImage}
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
