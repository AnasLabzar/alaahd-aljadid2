import { Metadata } from "next";
import DefaultLayout from "@/components/Layouts/DefaultLaout";
import Breadcrumb from "@/components/Breadcrumbs/Breadcrumb";
import AddInvoice from "@/components/AddInvoice";

export const metadata: Metadata = {
  title: "Next.js Calender Page | NextAdmin - Next.js Dashboard Kit",
  description:
    "This is Next.js Calender page for NextAdmin  Tailwind CSS Admin Dashboard Kit",
  // other metadata
};

const ProductPage = () => {
  return (
    <DefaultLayout>
      <div className="mx-auto max-w-7xl">
        <Breadcrumb pageName="produit" />

        <AddInvoice />
      </div>
    </DefaultLayout>
  );
};

export default ProductPage;
