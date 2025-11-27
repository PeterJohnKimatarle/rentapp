# Rentapp - Tanzania's #1 Renting Platform

A modern, responsive web application built with Next.js 14, TypeScript, and Tailwind CSS for finding rental properties across Tanzania.

## 🏠 Project Overview

**Rentapp** is Tanzania's premier rental platform focused exclusively on house rentals. The platform features a clean, Booking.com-inspired design with a 3-panel responsive layout.

### Key Features

- **3-Panel Layout**: Navigation, property listings, and insights/promotions
- **Property Listings**: 10 mock rental properties with detailed information
- **Image Lightbox**: Interactive image gallery with navigation
- **Responsive Design**: Works seamlessly on desktop, tablet, and mobile
- **Modern UI**: Clean, professional design with Booking.com styling

## 🚀 Getting Started

### Prerequisites

- Node.js 18+ 
- npm or yarn

### Installation

1. Clone the repository:
```bash
git clone <repository-url>
cd rentappofficialv3
```

2. Install dependencies:
```bash
npm install
```

3. Run the development server:
```bash
npm run dev
```

4. Open [http://localhost:3000](http://localhost:3000) in your browser

## 🛠 Tech Stack

- **Framework**: Next.js 14 (App Router)
- **Language**: TypeScript
- **Styling**: Tailwind CSS
- **Icons**: Lucide React
- **Font**: Inter (Google Fonts)

## 📱 Features

### Layout
- **Left Panel**: Navigation with logo, menu items, and contact info
- **Center Panel**: Main property listings with search functionality
- **Right Panel**: Placeholder for insights and promotions

### Property Cards
- High-quality property images
- Detailed property information (bedrooms, bathrooms, area)
- Pricing in Tanzanian Shillings (TZS)
- Location with map pin icon
- Image count indicator

### Image Lightbox
- Full-screen image viewing
- Navigation between multiple images
- Image counter (e.g., "1 of 10")
- Keyboard navigation (arrow keys, escape)
- Thumbnail navigation dots

### Responsive Design
- Desktop: 3-panel side-by-side layout
- Mobile/Tablet: Stacked layout with proper spacing
- Optimized for all screen sizes

## 🎨 Design System

- **Primary Color**: #0071c2 (Booking.com blue)
- **Typography**: Inter font family
- **Spacing**: Consistent padding and margins
- **Shadows**: Subtle shadows for depth
- **Borders**: Clean, minimal borders

## 📁 Project Structure

```
src/
├── app/
│   ├── globals.css
│   ├── layout.tsx
│   └── page.tsx
├── components/
│   ├── Layout.tsx
│   ├── Navigation.tsx
│   ├── PropertyCard.tsx
│   ├── ImageLightbox.tsx
│   └── Footer.tsx
└── data/
    └── properties.ts
```

## 🚀 Deployment

### Vercel (Recommended)

1. Push your code to GitHub
2. Connect your repository to Vercel
3. Deploy with zero configuration

### Manual Deployment

```bash
npm run build
npm start
```

## 📞 Contact Information

- **Official Contact**: 0755-123-500
- **Founder**: Peter
- **Platform**: Tanzania's #1 Renting Platform

## 🔮 Future Enhancements

- Backend integration with Supabase
- User authentication and accounts
- Advanced search and filtering
- Property management dashboard
- Payment integration
- Real-time chat support

## 📄 License

© 2024 Rentapp Limited. All rights reserved.

---

**Rentapp Minimal Edition build is complete and production-ready.**
