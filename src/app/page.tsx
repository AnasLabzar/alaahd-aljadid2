// src/app/page.tsx
import { Metadata } from "next";
import AuthenticatedLayout from "@/components/AuthenticatedLayout"; // Import the new component

export const metadata: Metadata = {
  title: "Next.js E-commerce Dashboard Page | NextAdmin - Next.js Dashboard Kit",
  description: "This is Next.js Home page for NextAdmin Dashboard Kit",
};

export default function Home() {
  return (
    <AuthenticatedLayout />
  );
}
