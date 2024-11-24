// src/app/page.tsx
import { Metadata } from "next";
import AuthenticatedLayout from "@/components/AuthenticatedLayout"; // Import the new component

export const metadata: Metadata = {
  title: "Alaahd Aljadid Aluminum - Backoffice",
  description: "Alaahd Aljadid Aluminum - Backoffice",
};

export default function Home() {
  return (
    <AuthenticatedLayout />
  );
}
