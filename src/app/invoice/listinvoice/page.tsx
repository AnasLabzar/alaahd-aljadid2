import Breadcrumb from "@/components/Breadcrumbs/Breadcrumb";
import { Metadata } from "next";
import DefaultLayout from "@/components/Layouts/DefaultLaout";
import ListInvoice from "@/components/ListInvoice";

export const metadata: Metadata = {
  title: "Next.js Profile Page | NextAdmin - Next.js Dashboard Kit",
  description: "This is Next.js Profile page for NextAdmin Dashboard Kit",
};

const ListInvoicePage = () => {
  return (
    <DefaultLayout>
      <div className="mx-auto w-full max-w-full">
        <Breadcrumb pageName="Liste Facturations" />

        <ListInvoice />
      </div>
    </DefaultLayout>
  );
};

export default ListInvoicePage;
