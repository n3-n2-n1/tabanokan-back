// src/types/Product.ts
export interface Product {
  id: string;
  name: string;
  description: string;
  price: number;
  images: string[];
  collection: string;
  stock: number;
  keywords?: string[];
}
