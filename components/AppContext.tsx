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
  compareAtPrice?: number; // Original price before discount (MSRP)
  discount?: number;
  discountType?: string;
  target: string | null;
  imageUrl: string[];
  productType: string;
  colours: string[];
  sizes: string[];
  weight: string;
  shippingCost: number;
  // Derived at load time — never stored in DB
  slug: string;
};

type Categories = {
  id: number;
  created_at: string;
  name: string;
  image_url: string;
};

type ChildrenProp = {
  children: React.ReactNode;
  products: Omit<Products, "slug">[];
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
  size?: string | null;
  shippingCost?: number;
  productSizes?: string[];
};

interface AppContextType {
  cart: Cart[];
  addToCart: (item: Cart) => Promise<void>;
  updateSize: (itemName: string, size: string) => Promise<void>;
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

// Derives a URL-safe slug for every product once at load time.
// Fashion items  → target:       "Men"              → "men"
// Other items    → productType:  "Washing Machine"  → "washing-machine"
function deriveSlug(product: Omit<Products, "slug">): string {
  const source = product.target ?? product.productType;
  return source.toLowerCase().replace(/\s+/g, "-");
}

function normaliseProducts(raw: Omit<Products, "slug">[]): Products[] {
  return raw.map((p) => ({ ...p, slug: deriveSlug(p) }));
}

function AppProvider({ children, products, categories }: ChildrenProp) {
  const [cart, setCart] = useState<Cart[]>([]);
  const [allProducts, setAllProducts] = useState<Products[]>(
    normaliseProducts(products),
  );
  const [allCategories, setAllCategories] = useState<Categories[]>(categories);
  const [isLoading, setIsLoading] = useState(true);

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
              ? { ...i, quantity: (i.quantity || 1) + 1, size: item.size }
              : i,
          );
        }

        return [...prev, { ...item, quantity: 1 }];
      });

      const response = await fetch("/api/cart/add", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(item),
      });

      if (!response.ok) throw new Error("Failed to add item");

      const data = await response.json();
      setCart(data.cart);
    } catch (error) {
      console.error("Failed to add to cart: ", error);
    }
  };

  const updateSize = async (itemName: string, size: string) => {
    try {
      setCart((prev) =>
        prev.map((i) => (i.itemName === itemName ? { ...i, size } : i)),
      );

      const response = await fetch("/api/cart/update-size", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ itemName, size }),
      });

      if (!response.ok) throw new Error("Failed to update size");
    } catch (error) {
      console.error("Failed to update size: ", error);
    }
  };

  const removeFromCart = async (itemName: string) => {
    try {
      const previousCart = [...cart];
      setCart((prev) => prev.filter((i) => i.itemName !== itemName));

      const response = await fetch("/api/cart/remove", {
        method: "DELETE",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ itemName }),
      });

      if (!response.ok) {
        setCart(previousCart);
        throw new Error("Failed to remove item");
      }
    } catch (error) {
      console.error("Failed to remove from cart: ", error);
    }
  };

  const updateQuantity = async (itemName: string, quantity: number) => {
    try {
      setCart((prev) =>
        prev.map((i) => (i.itemName === itemName ? { ...i, quantity } : i)),
      );

      const response = await fetch("/api/cart/update", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ itemName, quantity }),
      });

      if (!response.ok) throw new Error("Failed to update quantity");
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

      if (!response.ok) throw new Error("Failed to clear cart");
    } catch (error) {
      console.error("Failed to clear cart: ", error);
    }
  };

  return (
    <AppContext.Provider
      value={{
        cart,
        addToCart,
        updateSize,
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
export type { AppContextType, Products, Categories };
