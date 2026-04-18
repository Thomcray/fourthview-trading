"use client";

import {
  createContext,
  SetStateAction,
  useContext,
  useEffect,
  useState,
  useCallback,
} from "react";
import { toast } from "react-toastify";

type Products = {
  id: number;
  created_at: string;
  name: string;
  description: string;
  categoryId: number;
  price: number;
  compareAtPrice?: number;
  discount?: number;
  discountType?: string;
  target: string | null;
  imageUrl: string[];
  productType: string;
  colours: string[];
  sizes: string[];
  weight: string;
  shippingCost: number;
  slug: string;
};

type Categories = {
  id: number;
  created_at: string;
  name: string;
  slug: string;
  image_url: string;
};

type ChildrenProp = {
  children: React.ReactNode;
  products: Omit<Products, "slug">[];
  categories: Categories[];
};

type Cart = {
  id?: number;
  productId?: number;
  itemName: string;
  image?: string;
  price?: number;
  discount?: number;
  quantity?: number;
  description?: string;
  size?: string | null;
  colour?: string | null;
  shippingCost?: number;
  productSizes?: string[];
  productColours?: string[];
};

interface AppContextType {
  cart: Cart[];
  addToCart: (item: Cart) => Promise<void>;
  updateSize: (id: number, size: string) => Promise<void>;
  updateColour: (id: number, colour: string) => Promise<void>;
  removeFromCart: (id: number) => Promise<void>;
  updateQuantity: (id: number, quantity: number) => Promise<void>;
  clearCart: () => Promise<void>;
  // NEW: Update variant without flash
  updateVariant: (
    id: number,
    updates: { colour?: string; size?: string },
    productId: number,
  ) => Promise<void>;
  allProducts: Products[];
  allCategories: Categories[];
  setAllProducts: React.Dispatch<SetStateAction<Products[]>>;
  setAllCategories: React.Dispatch<SetStateAction<Categories[]>>;
  isLoading: boolean;
  updatingItems: Set<number>;
}

const AppContext = createContext<AppContextType | undefined>(undefined);

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
  const [updatingItems, setUpdatingItems] = useState<Set<number>>(new Set());

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
      throw error;
    }
  };

  // NEW: Update variant in place - no flash
  const updateVariant = async (
    id: number,
    updates: { colour?: string; size?: string },
    productId: number,
  ) => {
    setUpdatingItems((prev) => new Set(prev).add(id));
    const previousCart = [...cart];

    // Optimistic update - modify in place
    setCart((prev) =>
      prev.map((item) => (item.id === id ? { ...item, ...updates } : item)),
    );

    try {
      const response = await fetch("/api/cart/update-variant", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ id, ...updates, productId }),
      });

      if (!response.ok) {
        const errorData = await response.json();
        if (response.status === 409) {
          toast.info("This variant is already in your cart");
        } else {
          throw new Error(errorData.error || "Failed to update variant");
        }
        setCart(previousCart);
        return;
      }

      const data = await response.json();
      setCart(data.cart);
    } catch (error) {
      setCart(previousCart);
      console.error("Failed to update variant:", error);
      throw error;
    } finally {
      setUpdatingItems((prev) => {
        const newSet = new Set(prev);
        newSet.delete(id);
        return newSet;
      });
    }
  };

  const updateSize = async (id: number, size: string) => {
    setUpdatingItems((prev) => new Set(prev).add(id));
    const previousCart = [...cart];

    try {
      setCart((prev) => prev.map((i) => (i.id === id ? { ...i, size } : i)));

      const response = await fetch("/api/cart/update-size", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ id, size }),
      });

      if (!response.ok) {
        setCart(previousCart);
        throw new Error("Failed to update size");
      }
    } catch (error) {
      setCart(previousCart);
      console.error("Failed to update size: ", error);
      throw error;
    } finally {
      setUpdatingItems((prev) => {
        const newSet = new Set(prev);
        newSet.delete(id);
        return newSet;
      });
    }
  };

  const updateColour = async (id: number, colour: string) => {
    setUpdatingItems((prev) => new Set(prev).add(id));
    const previousCart = [...cart];

    try {
      setCart((prev) => prev.map((i) => (i.id === id ? { ...i, colour } : i)));

      const response = await fetch("/api/cart/update-colour", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ id, colour }),
      });

      if (!response.ok) {
        setCart(previousCart);
        throw new Error("Failed to update colour");
      }
    } catch (error) {
      setCart(previousCart);
      console.error("Failed to update colour: ", error);
      throw error;
    } finally {
      setUpdatingItems((prev) => {
        const newSet = new Set(prev);
        newSet.delete(id);
        return newSet;
      });
    }
  };

  const removeFromCart = async (id: number) => {
    const previousCart = [...cart];
    setCart((prev) => prev.filter((i) => i.id !== id));

    try {
      const response = await fetch("/api/cart/remove", {
        method: "DELETE",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ id }),
      });

      if (!response.ok) {
        setCart(previousCart);
        throw new Error("Failed to remove item");
      }
    } catch (error) {
      setCart(previousCart);
      console.error("Failed to remove from cart: ", error);
      throw error;
    }
  };

  const updateQuantity = async (id: number, quantity: number) => {
    setUpdatingItems((prev) => new Set(prev).add(id));
    const previousCart = [...cart];

    try {
      setCart((prev) =>
        prev.map((i) => (i.id === id ? { ...i, quantity } : i)),
      );

      const response = await fetch("/api/cart/update", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ id, quantity }),
      });

      if (!response.ok) {
        setCart(previousCart);
        throw new Error("Failed to update quantity");
      }
    } catch (error) {
      setCart(previousCart);
      console.error("Failed to update quantity: ", error);
      throw error;
    } finally {
      setUpdatingItems((prev) => {
        const newSet = new Set(prev);
        newSet.delete(id);
        return newSet;
      });
    }
  };

  const clearCart = async () => {
    const previousCart = [...cart];
    try {
      setCart([]);

      const response = await fetch("/api/cart/clear", {
        method: "DELETE",
      });

      if (!response.ok) {
        setCart(previousCart);
        throw new Error("Failed to clear cart");
      }
    } catch (error) {
      setCart(previousCart);
      console.error("Failed to clear cart: ", error);
      throw error;
    }
  };

  return (
    <AppContext.Provider
      value={{
        cart,
        addToCart,
        updateSize,
        updateColour,
        removeFromCart,
        updateQuantity,
        clearCart,
        updateVariant,
        allProducts,
        setAllProducts,
        allCategories,
        setAllCategories,
        isLoading,
        updatingItems,
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
export type { AppContextType, Products, Categories, Cart };
