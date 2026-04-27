import type { Metadata } from "next";
import { Outfit } from "next/font/google";
import Providers from "@/context/Providers";
import "./globals.css";

const outfit = Outfit({
  subsets: ["latin"],
  variable: "--font-outfit",
  weight: ["300", "400", "500", "600", "700", "800"],
});

export const metadata: Metadata = {
  title: "VIMS | Yantrik Vehicle Management",
  description: "Advanced Vehicle Inventory and Garage Management System",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className={`${outfit.variable} font-sans antialiased bg-background text-foreground min-h-screen`}>
        <Providers>
          {children}
        </Providers>
      </body>
    </html>
  );
}
