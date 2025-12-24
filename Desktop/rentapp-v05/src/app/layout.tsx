import type { Metadata } from "next";
import "./globals.css";
import { Providers } from "@/components/providers";
import PWARegistration from "@/components/PWARegistration";

export const metadata: Metadata = {
  title: "Rentapp - Tanzania's #1 Renting Platform",
  description: "Find your perfect rental home in Tanzania. Browse through our curated selection of properties across Dar es Salaam, Arusha, Zanzibar, and more.",
  applicationName: "Rentapp",
  manifest: "/manifest.json",
  icons: {
    icon: "/icon.png",
    shortcut: "/icon.png",
    apple: "/icon.png",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className="antialiased">
        <Providers>
          {children}
        </Providers>
        <PWARegistration />
      </body>
    </html>
  );
}
