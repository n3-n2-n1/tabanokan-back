export interface MerchantOrder {
  id: string;
  fullName: string;
  email: string;
  phone: string;
  shipping: {
    province: string;
    city: string;
    street: string;
    streetNumber: string;
    floor?: string;
    apartment?: string;
    postalCode: string;
  };
  products: Array<{
    quantity: number;
    total: number;
    id: string;
    name: string;
    description: string;
    price: number;
    images: string[];
    collection: string;
    stock: number;
    keywords?: string[];
  }>;
  netAmount: number;
  status: "pending" | "approved" | "sent";
}
