import { StaticImageData } from "next/image";
import hatImage from "@/public/hatImage.png";

interface Category {
  id: number;
  itemName: string;
  image: StaticImageData;
}

type Categories = {
  categories: {
    caps: Array<Category>;
    shoes: Array<Category>;
    bags: Array<Category>;
    slippers: Array<Category>;
    shirts: Array<Category>;
    trousers: Array<Category>;
    jewelry: Array<Category>;
    jackets: Array<Category>;
    belts: Array<Category>;
  };
};

const categories: Categories = {
  categories: {
    caps: [
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
    shoes: [
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
    bags: [
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
    slippers: [
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
    shirts: [
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
    trousers: [
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
    jewelry: [
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
    jackets: [
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
    belts: [
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

export default categories;
export type { Categories };
