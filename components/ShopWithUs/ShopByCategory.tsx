import { ChevronRight } from "lucide-react";
import Image from "next/image";

import shoeImage from "@/public/shoeImage.png";

export default function ShopByCategory() {
  return (
    <div className="border-0 px-8 py-4 w-full">
      <div className="bg-[#334EAC] rounded-md px-4 py-2 flex flex-row justify-between">
        <h1 className="font-normal text-md w-96 max-sm:w-80 text-white">
          Shop by Categories
        </h1>

        <ChevronRight
          color="white"
          strokeWidth={1.5}
          className="cursor-pointer"
        />
      </div>

      <div className="w-full h-fit flex flex-row items-center max-sm:space-x-4 md:space-x-4 py-2 px-4 max-sm:px-2 border-0">
        {["Bags", "Shoes", "Socks", "Caps"].map((item, index) => (
          <div
            className="w-full h-full max-sm:w-full space-x-4 border max-sm:border-0 px-4 max-sm:px-0 py-4 max-sm:py-0 rounded-md"
            key={index}
          >
            <Image
              src={shoeImage}
              alt="item-image"
              className="max-sm:w-40 max-sm:h-20 h-40 w-full object-cover rounded-md max-sm:rounded-none"
            />
            <p className="w-full px-2 py-2 max-sm:px-0 text-blue-950 font-semibold">
              {item}
            </p>
          </div>
        ))}
      </div>
    </div>
  );
}
