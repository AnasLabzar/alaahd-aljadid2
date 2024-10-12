import { Metadata } from "next";
import DefaultLayout from "@/components/Layouts/DefaultLaout";
import Breadcrumb from "@/components/Breadcrumbs/Breadcrumb";
import DetailInvoice from "@/components/Showinvoice";

export const metadata: Metadata = {
  title: "Next.js Calender Page | NextAdmin - Next.js Dashboard Kit",
  description:
    "This is Next.js Calender page for NextAdmin  Tailwind CSS Admin Dashboard Kit",
  // other metadata
};

const DetailPage = () => {
  return (
    <DefaultLayout>
      <div className="mx-auto max-w-full">
        <Breadcrumb pageName="Details Facture" />

        <DetailInvoice />
      </div>
    </DefaultLayout>
  );
};

export default DetailPage;
