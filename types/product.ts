export type Product = {
  id: number;
  created_at: string;
  name: string;
  description: string;
  categoryId: number;
  price: number;
  compareAtPrice?: number;
  discount: number | null;
  discountType: string | null;
  target: string | null;
  imageUrl: string[];
  productType: string;
  colours: string[];
  sizes: string[];
  weight: string;
  shippingCost: number;
};

export type NormalizedProduct = Product & {
  slug: string;
  _groupKeys: {
    byProductType: string;
    byTarget: string;
  };
};
