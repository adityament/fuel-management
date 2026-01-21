// app/layout.tsx
import type React from "react";
import type { Metadata } from "next";
import { Geist, Geist_Mono, Roboto } from "next/font/google";
import { AuthProvider } from "@/lib/auth-context";
import { ToastContainer } from "react-toastify";
import "./globals.css";

const roboto = Roboto({
  subsets: ["latin"],
  weight: ["100", "300", "400", "500", "700", "900"],
  display: "swap",
});

export const metadata: Metadata = {
  title: "FuelFlow - Petrol Pump Management System",
  description:
    "Modern petrol pump management system for sales, staff, and inventory tracking",
  generator: "v0.app",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body className={roboto.className}>
        <AuthProvider>{children}</AuthProvider>

         <ToastContainer
          position="top-right"
          autoClose={3000}
          newestOnTop
          closeOnClick
          pauseOnHover
        />
      </body>
    </html>
  );
}
