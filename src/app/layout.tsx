import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import { CartProvider } from "@/context/CartContext";
import FooterWrapper from "@/components/FooterWrapper"; 
import { Toaster } from 'react-hot-toast';

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "Central Melon - Premium Farm",
  description: "Supply Chain Melon Premium",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className={inter.className}>
        <CartProvider>
          <div className="min-h-screen">
            {children}
          </div>

          <FooterWrapper />
          <Toaster position="top-center" /> 

        </CartProvider>
      </body>
    </html>
  );
}