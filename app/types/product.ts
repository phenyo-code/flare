// types.ts
export interface ProductWithSizes {
  id: string;
  name: string;
  price: number;
  Originalprice: number;
  category: string;
  filter: string;
  images: string[];
  isRecommended: boolean;
  reviews: any[];
  createdAt: Date;
  updatedAt: Date;
  sizes: { id: string; size: string; quantity: number; measurement: string }[];
  style: string | null;
  brandName?: string;
  type: string | null;
  matchesWith: string[];
}
