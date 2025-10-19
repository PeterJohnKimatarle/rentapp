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
      "https://images.unsplash.com/photo-1560448204-e02f11c3d0e2?w=800&h=600&fit=crop",
      "https://images.unsplash.com/photo-1560448204-603b3fc33ddc?w=800&h=600&fit=crop",
      "https://images.unsplash.com/photo-1560448204-5e3c8b3b3b3b?w=800&h=600&fit=crop",
      "https://images.unsplash.com/photo-1560448204-6e3c8b3b3b3b?w=800&h=600&fit=crop",
      "https://images.unsplash.com/photo-1560448204-7e3c8b3b3b3b?w=800&h=600&fit=crop"
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
      "https://images.unsplash.com/photo-1570129477492-45c003edd2be?w=800&h=600&fit=crop",
      "https://images.unsplash.com/photo-1570129477492-45c003edd2be?w=800&h=600&fit=crop",
      "https://images.unsplash.com/photo-1570129477492-45c003edd2be?w=800&h=600&fit=crop",
      "https://images.unsplash.com/photo-1570129477492-45c003edd2be?w=800&h=600&fit=crop"
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
      "https://images.unsplash.com/photo-1613490493576-7fde63acd811?w=800&h=600&fit=crop",
      "https://images.unsplash.com/photo-1613490493576-7fde63acd811?w=800&h=600&fit=crop",
      "https://images.unsplash.com/photo-1613490493576-7fde63acd811?w=800&h=600&fit=crop",
      "https://images.unsplash.com/photo-1613490493576-7fde63acd811?w=800&h=600&fit=crop",
      "https://images.unsplash.com/photo-1613490493576-7fde63acd811?w=800&h=600&fit=crop",
      "https://images.unsplash.com/photo-1613490493576-7fde63acd811?w=800&h=600&fit=crop"
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
      "https://images.unsplash.com/photo-1522708323590-d24dbb6b0267?w=800&h=600&fit=crop",
      "https://images.unsplash.com/photo-1522708323590-d24dbb6b0267?w=800&h=600&fit=crop",
      "https://images.unsplash.com/photo-1522708323590-d24dbb6b0267?w=800&h=600&fit=crop"
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
      "https://images.unsplash.com/photo-1564013799919-ab600027ffc6?w=800&h=600&fit=crop",
      "https://images.unsplash.com/photo-1564013799919-ab600027ffc6?w=800&h=600&fit=crop",
      "https://images.unsplash.com/photo-1564013799919-ab600027ffc6?w=800&h=600&fit=crop",
      "https://images.unsplash.com/photo-1564013799919-ab600027ffc6?w=800&h=600&fit=crop",
      "https://images.unsplash.com/photo-1564013799919-ab600027ffc6?w=800&h=600&fit=crop"
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
      "https://images.unsplash.com/photo-1545324418-cc1a3fa10c00?w=800&h=600&fit=crop",
      "https://images.unsplash.com/photo-1545324418-cc1a3fa10c00?w=800&h=600&fit=crop",
      "https://images.unsplash.com/photo-1545324418-cc1a3fa10c00?w=800&h=600&fit=crop",
      "https://images.unsplash.com/photo-1545324418-cc1a3fa10c00?w=800&h=600&fit=crop",
      "https://images.unsplash.com/photo-1545324418-cc1a3fa10c00?w=800&h=600&fit=crop",
      "https://images.unsplash.com/photo-1545324418-cc1a3fa10c00?w=800&h=600&fit=crop",
      "https://images.unsplash.com/photo-1545324418-cc1a3fa10c00?w=800&h=600&fit=crop"
    ],
    bedrooms: 3,
    bathrooms: 3,
    area: 180
  },
  {
    id: "7",
    title: "Townhouse in Arusha",
    location: "Sakina, Arusha",
    description: "Modern townhouse with garage and small garden. Close to Mount Meru.",
    price: 1100000,
    images: [
      "https://images.unsplash.com/photo-1600596542815-ffad4c1539a9?w=800&h=600&fit=crop",
      "https://images.unsplash.com/photo-1600596542815-ffad4c1539a9?w=800&h=600&fit=crop",
      "https://images.unsplash.com/photo-1600596542815-ffad4c1539a9?w=800&h=600&fit=crop",
      "https://images.unsplash.com/photo-1600596542815-ffad4c1539a9?w=800&h=600&fit=crop"
    ],
    bedrooms: 3,
    bathrooms: 2,
    area: 140
  },
  {
    id: "8",
    title: "Beach House in Tanga",
    location: "Pangani, Tanga",
    description: "Charming beach house with direct beach access. Perfect for weekend getaways.",
    price: 1500000,
    images: [
      "https://images.unsplash.com/photo-1600607687939-ce8a6c25118c?w=800&h=600&fit=crop",
      "https://images.unsplash.com/photo-1600607687939-ce8a6c25118c?w=800&h=600&fit=crop",
      "https://images.unsplash.com/photo-1600607687939-ce8a6c25118c?w=800&h=600&fit=crop",
      "https://images.unsplash.com/photo-1600607687939-ce8a6c25118c?w=800&h=600&fit=crop",
      "https://images.unsplash.com/photo-1600607687939-ce8a6c25118c?w=800&h=600&fit=crop"
    ],
    bedrooms: 2,
    bathrooms: 2,
    area: 100
  },
  {
    id: "9",
    title: "Apartment in Morogoro",
    location: "Mazimbu, Morogoro",
    description: "Comfortable apartment near university. Great for students and young professionals.",
    price: 600000,
    images: [
      "https://images.unsplash.com/photo-1600607687644-c7171b42498b?w=800&h=600&fit=crop",
      "https://images.unsplash.com/photo-1600607687644-c7171b42498b?w=800&h=600&fit=crop",
      "https://images.unsplash.com/photo-1600607687644-c7171b42498b?w=800&h=600&fit=crop"
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
      "https://images.unsplash.com/photo-1600585154340-be6161a56a0c?w=800&h=600&fit=crop",
      "https://images.unsplash.com/photo-1600585154340-be6161a56a0c?w=800&h=600&fit=crop",
      "https://images.unsplash.com/photo-1600585154340-be6161a56a0c?w=800&h=600&fit=crop",
      "https://images.unsplash.com/photo-1600585154340-be6161a56a0c?w=800&h=600&fit=crop",
      "https://images.unsplash.com/photo-1600585154340-be6161a56a0c?w=800&h=600&fit=crop",
      "https://images.unsplash.com/photo-1600585154340-be6161a56a0c?w=800&h=600&fit=crop",
      "https://images.unsplash.com/photo-1600585154340-be6161a56a0c?w=800&h=600&fit=crop",
      "https://images.unsplash.com/photo-1600585154340-be6161a56a0c?w=800&h=600&fit=crop"
    ],
    bedrooms: 5,
    bathrooms: 4,
    area: 250
  }
];

