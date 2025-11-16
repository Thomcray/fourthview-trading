"use client";

import { createContext, SetStateAction, useContext, useState } from "react";

type Products = {
  id: number;
  created_at: string;
  name: string;
  description: string;
  categoryId: number;
  price: number;
  discount?: number;
  discountType?: string;
  target: string;
  imageUrl: string[];
  productType: string;
  colours: string[];
};

type Categories = {
  id: number;
  created_at: string;
  name: string;
  image_url: string;
};

type ChildrenProp = {
  children: React.ReactNode;
  products: Products[];
  categories: Categories[];
};

type Cart = {
  itemName: string;
};

interface AppContextType {
  cart: Cart[];
  allProducts: Products[];
  allCategories: Categories[];
  setCart: React.Dispatch<SetStateAction<Cart[]>>;
  setAllProducts: React.Dispatch<SetStateAction<Products[]>>;
  setAllCategories: React.Dispatch<SetStateAction<Categories[]>>;
}

const AppContext = createContext<AppContextType | undefined>(undefined);

function AppProvider({ children, products, categories }: ChildrenProp) {
  const [cart, setCart] = useState<Cart[] | []>([]);
  const [allProducts, setAllProducts] = useState<Products[]>(products);
  const [allCategories, setAllCategories] = useState<Categories[]>(categories);

  return (
    <AppContext.Provider
      value={{
        cart,
        setCart,
        allProducts,
        setAllProducts,
        allCategories,
        setAllCategories,
      }}
    >
      {children}
    </AppContext.Provider>
  );
}

function useApp() {
  const context = useContext(AppContext);

  if (!context) {
    throw new Error("Context was used outside of provider!");
  }

  return context;
}

export { AppProvider, useApp };
export type { AppContextType };
