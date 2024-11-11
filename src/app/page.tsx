'use client';
import { useEffect } from "react";
import { useRouter } from "next/navigation";
import ECommerce from "@/components/Dashboard/E-commerce";
import DefaultLayout from "@/components/Layouts/DefaultLaout";
import { isAuthenticated } from "@/components/utils/auth";

export default function Home() {
  const router = useRouter();

  useEffect(() => {
    const session = isAuthenticated();
    if (!session) {
      // If not authenticated, push to signin page
      router.push("/auth/signin");
    }
  }, [router]);

  if (!isAuthenticated()) return null; // Don't render until the user is authenticated

  return (
    <DefaultLayout>
      <ECommerce />
    </DefaultLayout>
  );
}
