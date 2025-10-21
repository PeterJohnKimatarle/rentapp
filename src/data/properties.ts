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
      "https://images.unsplash.com/photo-1522708323590-d24dbb6b0267?w=800&h=600&fit=crop",
      "https://images.unsplash.com/photo-1501183638710-841dd1904471?auto=format&fit=crop&w=800&q=60",
      "https://images.unsplash.com/photo-1521782462922-9318be1d0af0?auto=format&fit=crop&w=800&q=60",
      "https://images.unsplash.com/photo-1501045661006-fcebe0257c3f?auto=format&fit=crop&w=800&q=60"
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
      "https://images.unsplash.com/photo-1600596542815-ffad4c1539a9?w=800&h=600&fit=crop",
      "https://images.unsplash.com/photo-1600585154340-be6161a56a0c?w=800&h=600&fit=crop",
      "https://images.unsplash.com/photo-1564013799919-ab600027ffc6?w=800&h=600&fit=crop"
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
      "https://images.unsplash.com/photo-1600607687939-ce8a6c25118c?w=800&h=600&fit=crop",
      "https://images.unsplash.com/photo-1600607687644-c7171b42498b?w=800&h=600&fit=crop",
      "https://images.unsplash.com/photo-1600607687920-4e2a09cf159d?w=800&h=600&fit=crop"
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
      "https://images.unsplash.com/photo-1522708323590-d24dbb6b0267?w=800&h=600&fit=crop",
      "https://images.unsplash.com/photo-1545324418-cc1a3fa10c00?w=800&h=600&fit=crop",
      "https://images.unsplash.com/photo-1570129477492-45c003edd2be?w=800&h=600&fit=crop"
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
      "https://images.unsplash.com/photo-1613490493576-7fde63acd811?w=800&h=600&fit=crop",
      "https://images.unsplash.com/photo-1501183638710-841dd1904471?auto=format&fit=crop&w=800&q=60",
      "https://images.unsplash.com/photo-1521782462922-9318be1d0af0?auto=format&fit=crop&w=800&q=60"
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
      "https://images.unsplash.com/photo-1545324418-cc1a3fa10c00?w=800&h=600&fit=crop",
      "https://images.unsplash.com/photo-1600607687644-c7171b42498b?w=800&h=600&fit=crop",
      "https://images.unsplash.com/photo-1600607687920-4e2a09cf159d?w=800&h=600&fit=crop",
      "https://images.unsplash.com/photo-1613490493576-7fde63acd811?w=800&h=600&fit=crop",
      "https://images.unsplash.com/photo-1522708323590-d24dbb6b0267?w=800&h=600&fit=crop",
      "https://images.unsplash.com/photo-1564013799919-ab600027ffc6?w=800&h=600&fit=crop"
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
      "https://images.unsplash.com/photo-1501183638710-841dd1904471?auto=format&fit=crop&w=800&q=60",
      "https://images.unsplash.com/photo-1521782462922-9318be1d0af0?auto=format&fit=crop&w=800&q=60",
      "https://images.unsplash.com/photo-1501045661006-fcebe0257c3f?auto=format&fit=crop&w=800&q=60",
      "https://images.unsplash.com/photo-1600596542815-ffad4c1539a9?w=800&h=600&fit=crop",
      "https://images.unsplash.com/photo-1600585154340-be6161a56a0c?w=800&h=600&fit=crop"
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
      "https://images.unsplash.com/photo-1600596542815-ffad4c1539a9?w=800&h=600&fit=crop",
      "https://images.unsplash.com/photo-1600607687939-ce8a6c25118c?w=800&h=600&fit=crop",
      "https://images.unsplash.com/photo-1564013799919-ab600027ffc6?w=800&h=600&fit=crop",
      "https://images.unsplash.com/photo-1570129477492-45c003edd2be?w=800&h=600&fit=crop",
      "https://images.unsplash.com/photo-1545324418-cc1a3fa10c00?w=800&h=600&fit=crop"
    ],
    bedrooms: 5,
    bathrooms: 4,
    area: 250
  }
];

