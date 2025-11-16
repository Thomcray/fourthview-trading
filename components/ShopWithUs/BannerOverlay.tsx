"use client";

import Image, { StaticImageData } from "next/image";
import Link from "next/link";
import { useApp } from "../AppContext";

export default function BannerOverlay() {
  const { allProducts: products } = useApp();

  const menType = products
    .filter((item) => item.target.toLowerCase() === "men")
    .slice(0, 4);
  const womenType = products
    .filter((item) => item.target.toLowerCase() === "women")
    .slice(0, 4);
  const kidsType = products
    .filter((item) => item.target.toLowerCase() === "kids")
    .slice(0, 4);

  return (
    <div
      className="lg:-mt-40 flex-1 sm:-mt-40 z-10 px-4 w-full sm:px-6 lg:px-8 md:px-8 md:grid-cols-3 grid place-items-center
        lg:grid-cols-3 sm:grid-cols-2 max-sm:grid-cols-1 max-sm:w-full md-w-full sm:w-full border-0 h-96 border-black gap-4"
    >
      {menType.length > 0 && (
        <Link href="/shop/men" className="w-full">
          <div className="flex items-center flex-col bg-white rounded-xl h-fit text-center px-4 max-sm:w-full max-sm:px-0 py-2 w-fit lg:w-full space-y-2 border">
            <h2 className="font-semibold text-lg w-full max-sm:w-80 text-center text-blue-950 ">
              Men
            </h2>

            <div className="max-sm:w-full max-sm:px-4 grid grid-cols-2 place-items-center gap-4 mb-4">
              {menType.map((item) => (
                <div
                  key={item.id}
                  className="relative aspect-square lg:w-32 lg:h-32 md:w-24 md:h-24 max-sm:w-full border rounded-md"
                >
                  <Image
                    src={item.imageUrl[0]}
                    alt={item.name}
                    fill
                    className="object-cover"
                  />
                </div>
              ))}
            </div>
          </div>
        </Link>
      )}

      {womenType.length > 0 && (
        <Link href="/shop/women" className="w-full">
          <div className="flex items-center flex-col bg-white rounded-xl h-fit text-center px-8 max-sm:w-full max-sm:px-0 py-2 w-fit lg:w-full space-y-2 border">
            <h2 className="font-semibold text-lg w-full max-sm:w-80 text-center text-blue-950">
              Women
            </h2>

            <div className="max-sm:w-full max-sm:px-4 grid grid-cols-2 place-items-center gap-4 h-full border-0 mb-4">
              {womenType.map((item) => (
                <div
                  key={item.id}
                  className="relative aspect-square lg:w-32 lg:h-32 md:w-24 md:h-24 max-sm:w-full"
                >
                  <Image
                    src={item.imageUrl[0]}
                    alt={item.name}
                    fill
                    className="object-cover"
                  />
                </div>
              ))}
            </div>
          </div>
        </Link>
      )}

      {kidsType.length > 0 && (
        <div className="flex items-center flex-col bg-white rounded-xl h-fit text-center px-8 max-sm:w-full max-sm:px-0 py-2 w-fit lg:w-full space-y-2 border">
          <h2 className="font-semibold text-lg w-full max-sm:w-80 text-center text-blue-950">
            Kids
          </h2>

          {/* <div className="max-sm:w-full max-sm:px-4 grid grid-cols-2 place-items-center gap-4 h-full border-0 mb-4">
          {items.categories.kids.map((item) => (
            <div
              key={item.id}
              className="border-0 lg:w-32 lg:h-32 md:w-24 md:h-24 max-sm:w-full"
            >
              <Image
                src={item.image}
                alt={item.itemName}
                className="w-full h-full object-cover"
              />
            </div>
          ))}
        </div> */}
        </div>
      )}
    </div>
  );
}
