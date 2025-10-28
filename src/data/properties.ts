export interface Property {
  id: string;
  title: string;
  location: string;
  description: string;
  price: number;
  images: string[];
  bedrooms: number;
  bathrooms: number;
  area: number;
  plan: '3+' | '6+';
  updatedAt: string;
  status: 'available' | 'occupied';
}

export const properties: Property[] = [];

