import Image, { StaticImageData } from "next/image";
import hatImage from "@/public/hatImage.png";
import Link from "next/link";

interface Item {
  id: number;
  itemName: string;
  image: StaticImageData;
}

type Items = {
  categories: {
    men: Array<Item>;
    women: Array<Item>;
    kids: Array<Item>;
  };
};
export default function BannerOverlay() {
  const items: Items = {
    categories: {
      men: [
        {
          id: 1,
          itemName: "hat-1",
          image: hatImage,
        },
        {
          id: 2,
          itemName: "hat-2",
          image: hatImage,
        },
        {
          id: 3,
          itemName: "hat-3",
          image: hatImage,
        },
        {
          id: 4,
          itemName: "hat-4",
          image: hatImage,
        },
      ],
      women: [
        {
          id: 1,
          itemName: "hat-5",
          image: hatImage,
        },
        {
          id: 2,
          itemName: "hat-6",
          image: hatImage,
        },
        {
          id: 3,
          itemName: "hat-7",
          image: hatImage,
        },
        {
          id: 4,
          itemName: "hat-8",
          image: hatImage,
        },
      ],
      kids: [
        {
          id: 1,
          itemName: "hat-9",
          image: hatImage,
        },
        {
          id: 2,
          itemName: "hat-10",
          image: hatImage,
        },
        {
          id: 3,
          itemName: "hat-11",
          image: hatImage,
        },
        {
          id: 4,
          itemName: "hat-12",
          image: hatImage,
        },
      ],
    },
  };
  return (
    <div
      className="lg:-mt-40 flex-1 sm:-mt-40 z-10 px-4 w-full sm:px-6 lg:px-8 md:px-8 md:grid-cols-3 grid place-items-center
        lg:grid-cols-3 sm:grid-cols-2 max-sm:grid-cols-1 max-sm:w-full md-w-full sm:w-full border-0 h-96 border-black gap-4"
    >
      <Link href="/shop/men" className="w-full">
        <div className="flex items-center flex-col bg-white rounded-xl h-fit text-center px-8 max-sm:w-full max-sm:px-0 py-2 w-fit lg:w-full space-y-2 border">
          <h2 className="font-semibold text-lg w-full max-sm:w-80 text-center text-blue-950 ">
            Men
          </h2>

          <div className="max-sm:w-full max-sm:px-4 grid grid-cols-2 place-items-center gap-4 h-full border-0 mb-4">
            {items.categories.men.map((item) => (
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

      <Link href="/shop/women" className="w-full">
        <div className="flex items-center flex-col bg-white rounded-xl h-fit text-center px-8 max-sm:w-full max-sm:px-0 py-2 w-fit lg:w-full space-y-2 border">
          <h2 className="font-semibold text-lg w-full max-sm:w-80 text-center text-blue-950">
            Women
          </h2>

          <div className="max-sm:w-full max-sm:px-4 grid grid-cols-2 place-items-center gap-4 h-full border-0 mb-4">
            {items.categories.women.map((item) => (
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

      <div className="flex items-center flex-col bg-white rounded-xl h-fit text-center px-8 max-sm:w-full max-sm:px-0 py-2 w-fit lg:w-full space-y-2 border">
        <h2 className="font-semibold text-lg w-full max-sm:w-80 text-center text-blue-950">
          Kids
        </h2>

        <div className="max-sm:w-full max-sm:px-4 grid grid-cols-2 place-items-center gap-4 h-full border-0 mb-4">
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
        </div>
      </div>
    </div>
  );
}
