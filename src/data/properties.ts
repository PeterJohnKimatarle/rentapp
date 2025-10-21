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
    id: "1",
    title: "Modern Apartment in Dar es Salaam",
    location: "Masaki, Dar es Salaam",
    description: "Beautiful modern apartment with stunning ocean views. Perfect for professionals working in the city center.",
    price: 1200000,
    images: [
      "/images/properties/house-1.jpg",
      "/images/properties/house-2.jpg"
    ],
    bedrooms: 2,
    bathrooms: 2,
    area: 120
  },
  {
    id: "2",
    title: "Cozy House in Arusha",
    location: "Njiro, Arusha",
    description: "Charming family house with garden space. Close to schools and shopping centers.",
    price: 800000,
    images: [
      "/images/properties/house-3.jpg",
      "/images/properties/house-4.jpg"
    ],
    bedrooms: 3,
    bathrooms: 2,
    area: 150
  },
  {
    id: "3",
    title: "Luxury Villa in Zanzibar",
    location: "Stone Town, Zanzibar",
    description: "Exclusive beachfront villa with private pool and direct beach access.",
    price: 2500000,
    images: [
      "/images/properties/house-5.jpg",
      "/images/properties/house-6.jpg",
      "/images/properties/house-7.jpg"
    ],
    bedrooms: 4,
    bathrooms: 3,
    area: 300
  },
  {
    id: "4",
    title: "Studio Apartment in Mwanza",
    location: "Ilemela, Mwanza",
    description: "Compact studio perfect for students or young professionals. Fully furnished.",
    price: 450000,
    images: [
      "/images/properties/house-8.jpg",
      "/images/properties/house-9.jpg"
    ],
    bedrooms: 1,
    bathrooms: 1,
    area: 45
  },
  {
    id: "5",
    title: "Family House in Dodoma",
    location: "Nala, Dodoma",
    description: "Spacious family home with large backyard. Ideal for families with children.",
    price: 950000,
    images: [
      "/images/properties/house-10.jpg",
      "/images/properties/house-11.jpg"
    ],
    bedrooms: 4,
    bathrooms: 3,
    area: 200
  },
  {
    id: "6",
    title: "Penthouse in Dar es Salaam",
    location: "Oyster Bay, Dar es Salaam",
    description: "Luxurious penthouse with panoramic city and ocean views. Premium location.",
    price: 1800000,
    images: [
      "/images/properties/house-12.jpg",
      "/images/properties/house-13.jpg",
      "/images/properties/house-14.jpg"
    ],
    bedrooms: 3,
    bathrooms: 3,
    area: 180
  },
  {
    id: "7",
    title: "Executive House in Dar es Salaam",
    location: "Msasani, Dar es Salaam",
    description: "Executive family house with modern amenities. Gated community with security.",
    price: 2000000,
    images: [
      "/images/properties/house-15.jpg",
      "/images/properties/house-16.jpg"
    ],
    bedrooms: 5,
    bathrooms: 4,
    area: 250
  }
];

