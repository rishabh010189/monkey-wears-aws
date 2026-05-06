export interface IProduct {
  id: string;
  name: string;
  category: string;
  type: string;
  brand: string;
  currency: string;
  isTrending: boolean;
  description: string;
  rating: number;
  gender: string;
  productCategory: string;
  tags: string[];
  variants: Variant[];
}

export interface Variant {
  id: string;
  sku: string;
  color: string;
  size: string;
  stock: number;
  modelName: string;
  originalPrice: number;
  price: number;
  images: string[];
}
