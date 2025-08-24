// app/layout.tsx
import type { Metadata } from "next";
import { Inter } from "next/font/google"; // <-- 1. Import the font
import "./globals.css";
import AuthContext from "./components/AuthContext";
import { Toaster } from "react-hot-toast";

const inter = Inter({ subsets: ["latin"] }); // <-- 2. Initialize the font

export const metadata: Metadata = {
  title: "FixIt Hostel",
  description: "AI-Powered Hostel Maintenance System",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body className={inter.className}> {/* <-- This will now work */}
        <AuthContext>
          <Toaster />
          {children}
        </AuthContext>
      </body>
    </html>
  );
}