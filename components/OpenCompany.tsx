import Image from "next/image";
import { Button } from "./ui/button";

import chineseStatue from "@/public/chineseStatue.png";

export default function OpenCompany() {
  return (
    <section className="w-full flex items-center border-0 px-8 py-12 sm:px-2 max-sm:px-4 bg-blue-50 pb-12">
      <div className="flex flex-row max-sm:flex-col-reverse space-x-4 mx-auto justify-between px-4 w-full sm:px-6 lg:px-8 text-center items-center border-0">
        <div>
          <Image
            src={chineseStatue}
            placeholder="blur"
            alt="shop-with-us"
            height={300}
            width={500}
          />
        </div>

        <div className="w-1/2 max-sm:w-full py-8 items-center flex flex-col border-0 space-y-4">
          <h1 className="font-bold text-3xl w-96 max-sm:w-80 sm:w-80 text-center">
            Open Company in China
          </h1>

          <p className="lg:text-lg leading-8 sm:text-base text-left max-sm:text-center w-full">
            Looking to enter the Chinese market? We make the process simple and
            efficient, from registration to full setup.
          </p>

          <Button
            variant="outline"
            className="text-white bg-blue-950 self-start"
          >
            Get Started
          </Button>
        </div>
      </div>
    </section>
  );
}
