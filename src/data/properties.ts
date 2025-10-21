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
}

export const properties: Property[] = [
  {
    id: "4",
    title: "Studio Apartment in Mwanza",
    location: "Ilemela, Mwanza",
    description: "Compact studio perfect for students or young professionals. Fully furnished.",
    price: 450000,
    images: [
      "/images/properties/property-4-image-1.jpg",
      "/images/properties/property-4-image-2.jpg",
      "/images/properties/property-4-image-3.jpg"
    ],
    bedrooms: 1,
    bathrooms: 1,
    area: 45
  },
  {
    id: "5",
    title: "Modern Family Home in Dar es Salaam",
    location: "Kinondoni, Dar es Salaam",
    description: "Beautiful modern family home with spacious living areas and a private garden. Perfect for families seeking comfort and style.",
    price: 1350000,
    images: [
      "/images/properties/property-5-image-1.jpg",
      "/images/properties/property-5-image-2.jpg",
      "/images/properties/property-5-image-3.jpg"
    ],
    bedrooms: 4,
    bathrooms: 3,
    area: 220
  },
  {
    id: "6",
    title: "Luxury Villa in Arusha",
    location: "Njiro, Arusha",
    description: "Stunning luxury villa with mountain views and premium amenities. Ideal for executives and high-end living.",
    price: 2200000,
    images: [
      "/images/properties/property-6-image-1.jpg",
      "/images/properties/property-6-image-2.jpg",
      "/images/properties/property-6-image-3.jpg"
    ],
    bedrooms: 5,
    bathrooms: 4,
    area: 350
  },
  {
    id: "7",
    title: "Cozy Bungalow in Mwanza",
    location: "Ilemela, Mwanza",
    description: "Charming bungalow with lake views and a peaceful atmosphere. Perfect for those seeking tranquility by the water.",
    price: 750000,
    images: [
      "/images/properties/property-7-image-1.jpg",
      "/images/properties/property-7-image-2.jpg",
      "/images/properties/property-7-image-3.jpg"
    ],
    bedrooms: 3,
    bathrooms: 2,
    area: 120
  },
  {
    id: "8",
    title: "Executive Townhouse in Dodoma",
    location: "Nala, Dodoma",
    description: "Modern executive townhouse with contemporary design and premium finishes. Located in a prestigious neighborhood.",
    price: 1650000,
    images: [
      "/images/properties/property-8-image-1.jpg",
      "/images/properties/property-8-image-2.jpg",
      "/images/properties/property-8-image-3.jpg"
    ],
    bedrooms: 4,
    bathrooms: 3,
    area: 180
  },
  {
    id: "9",
    title: "Penthouse in Dar es Salaam",
    location: "Oyster Bay, Dar es Salaam",
    description: "Luxurious penthouse with panoramic city and ocean views. Premium location.",
    price: 1800000,
    images: [
      "/images/properties/property-9-image-1.jpg",
      "/images/properties/property-9-image-2.jpg",
      "/images/properties/property-9-image-3.jpg"
    ],
    bedrooms: 3,
    bathrooms: 3,
    area: 180
  },
  {
    id: "9",
    title: "Apartment in Morogoro",
    location: "Mazimbu, Morogoro",
    description: "Comfortable apartment near university. Great for students and young professionals.",
    price: 600000,
    images: [
      "/images/properties/property-10-image-1.jpg",
      "/images/properties/property-10-image-2.jpg",
      "/images/properties/property-10-image-3.jpg"
    ],
    bedrooms: 2,
    bathrooms: 1,
    area: 80
  },
  {
    id: "10",
    title: "Executive House in Dar es Salaam",
    location: "Msasani, Dar es Salaam",
    description: "Executive family house with modern amenities. Gated community with security.",
    price: 2000000,
    images: [
      "/images/properties/property-11-image-1.jpg",
      "/images/properties/property-11-image-2.jpg",
      "/images/properties/property-11-image-3.jpg"
    ],
    bedrooms: 5,
    bathrooms: 4,
    area: 250
  }
];

