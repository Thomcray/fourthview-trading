"use client";

export const dynamic = "force-dynamic";

import {
  createContext,
  SetStateAction,
  useContext,
  useEffect,
  useState,
} from "react";

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
  weight: string;
  shippingCost: number;
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
  productId?: number;
  itemName: string;
  image?: string;
  price?: number;
  discount?: number;
  quantity?: number;
  description?: string;
};

interface AppContextType {
  cart: Cart[];
  addToCart: (item: Cart) => Promise<void>;
  removeFromCart: (itemName: string) => Promise<void>;
  updateQuantity: (itemName: string, quantity: number) => Promise<void>;
  clearCart: () => Promise<void>;
  allProducts: Products[];
  allCategories: Categories[];
  setAllProducts: React.Dispatch<SetStateAction<Products[]>>;
  setAllCategories: React.Dispatch<SetStateAction<Categories[]>>;
  isLoading: boolean;
}

const AppContext = createContext<AppContextType | undefined>(undefined);

function AppProvider({ children, products, categories }: ChildrenProp) {
  const [cart, setCart] = useState<Cart[]>([]);
  const [allProducts, setAllProducts] = useState<Products[]>(products);
  const [allCategories, setAllCategories] = useState<Categories[]>(categories);
  const [isLoading, setIsLoading] = useState(true);

  // Get cart and fetch items from cart at page load
  useEffect(() => {
    const fetchCart = async () => {
      try {
        const response = await fetch("/api/cart");
        if (response.ok) {
          const data = await response.json();
          setCart(data.cart || []);
        }
      } catch (error) {
        console.error("Failed to fetch cart:", error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchCart();
  }, []);

  const addToCart = async (item: Cart) => {
    try {
      setCart((prev) => {
        const existingItem = prev.find((i) => i.itemName === item.itemName);

        if (existingItem) {
          return prev.map((i) =>
            i.itemName === item.itemName
              ? { ...i, quantity: (i.quantity || 1) + 1 }
              : i
          );
        }

        return [...prev, { ...item, quantity: 1 }];
      });

      // Save to DB
      const response = await fetch("/api/cart/add", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(item),
      });

      if (!response.ok) {
        throw new Error("Failed to add item");
      }

      const data = await response.json();
      // Update with server response in case of any server-side changes
      setCart(data.cart);
    } catch (error) {
      console.error("Failed to add to cart: ", error);
      // Revert to optimistic update on error
      // Might want to fetch cart again here
    }
  };

  const removeFromCart = async (itemName: string) => {
    try {
      const response = await fetch("/api/cart/remove", {
        method: "DELETE",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ itemName }),
      });

      // Optimistic update
      const previousCart = [...cart];
      setCart((prev) => prev.filter((i) => i.itemName !== itemName));

      if (!response.ok) {
        // Revert on error
        setCart(previousCart);
        throw new Error("Failed to remove item");
      }
    } catch (error) {
      console.error("Failed to remove from cart: ", error);
    }
  };

  const updateQuantity = async (itemName: string, quantity: number) => {
    try {
      // Optimistic update
      setCart((prev) =>
        prev.map((i) => (i.itemName === itemName ? { ...i, quantity } : i))
      );

      const response = await fetch("/api/cart/update", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ itemName, quantity }),
      });

      if (!response.ok) {
        throw new Error("Failed to update quantity");
      }
    } catch (error) {
      console.error("Failed to update quantity: ", error);
    }
  };

  const clearCart = async () => {
    try {
      setCart([]);

      const response = await fetch("/api/cart/clear", {
        method: "DELETE",
      });

      if (!response.ok) {
        throw new Error("Failed to clear cart");
      }
    } catch (error) {
      console.error("Failed to clear cart: ", error);
    }
  };

  return (
    <AppContext.Provider
      value={{
        cart,
        addToCart,
        removeFromCart,
        updateQuantity,
        clearCart,
        allProducts,
        setAllProducts,
        allCategories,
        setAllCategories,
        isLoading,
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
