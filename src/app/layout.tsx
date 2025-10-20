import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "Rentapp - Tanzania's #1 Renting Platform",
  description: "Find your perfect rental home in Tanzania. Browse through our curated selection of properties across Dar es Salaam, Arusha, Zanzibar, and more.",
};
export const metadata = {
  title: "Rentapp",
  description: "Tanzania’s #1 Renting Platform",
  icons: {
    icon: "/icon.png",
  },
  manifest: "/manifest.json",
};


export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className="antialiased">
        {children}
      </body>
    </html>
  );
}
