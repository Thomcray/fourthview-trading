import React from "react";
import categories from "./categoryList";
import Link from "next/link";
import Image from "next/image";

export default function Category() {
  return (
    <div
      className="lg:-mt-40 flex-1 sm:-mt-40 z-10 px-4 w-full sm:px-6 lg:px-8 md:px-8 md:grid-cols-3 grid place-items-center
        lg:grid-cols-3 sm:grid-cols-2 max-sm:grid-cols-1 max-sm:w-full md-w-full sm:w-full border-0 h-96 border-black gap-4"
    >
      {Object.entries(categories.categories).map(([category, items]) => (
        <Link
          href={`/category/item?q=${category}`}
          className="w-full lg:w-md lg:px-12 border-0 mb-2"
          key={category}
        >
          <div className="flex items-center flex-col bg-white rounded-xl h-fit text-center md:px-2 max-sm:w-full max-sm:px-0 py-2 w-full lg:w-full border">
            <h2 className="font-semibold text-lg w-full max-sm:w-80 text-center text-blue-950 ">
              {category.charAt(0).toUpperCase() + category.slice(1)}
            </h2>

            <div className="max-sm:w-full max-sm:px-4 grid grid-cols-2 place-items-center gap-4 h-full border-0 mb-4">
              {items.map((item) => (
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
            </div>
          </div>
        </Link>
      ))}
    </div>
  );
}
