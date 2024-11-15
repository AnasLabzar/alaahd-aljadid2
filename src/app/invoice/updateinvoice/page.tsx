import { Metadata } from "next";
import DefaultLayout from "@/components/Layouts/DefaultLaout";
import Breadcrumb from "@/components/Breadcrumbs/Breadcrumb";
import AddInvoice from "@/components/AddInvoice";

export const metadata: Metadata = {
  title: "Alaahd Aljadid Aluminium | Backoffice",
  description:
    "This is Alaahd Aljadid backoffice page for Administration Aluminium",
  // other metadata
};

const InvoicePage = () => {
  return (
    <DefaultLayout>
      <div className="mx-auto max-w-full">
        <Breadcrumb pageName="Crée nouveau facture" />

        <AddInvoice />
      </div>
    </DefaultLayout>
  );
};

export default InvoicePage;
