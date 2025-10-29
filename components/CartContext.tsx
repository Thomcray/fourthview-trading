"use client";

import { createContext, SetStateAction, useContext, useState } from "react";

type ChildrenProp = {
  children: React.ReactNode;
};

type Cart = {
  itemName: string;
};

interface CartContextType {
  cart: Cart[];
  setCart: React.Dispatch<SetStateAction<Cart[]>>;
}

const CartContext = createContext<CartContextType | undefined>(undefined);

function CartProvider({ children }: ChildrenProp) {
  const [cart, setCart] = useState<Cart[] | []>([]);

  return (
    <CartContext.Provider value={{ cart, setCart }}>
      {children}
    </CartContext.Provider>
  );
}

function useCart() {
  const context = useContext(CartContext);

  if (!context) {
    throw new Error("Context was used outside of provider!");
  }

  return context;
}

export { CartProvider, useCart };
export type { CartContextType };
