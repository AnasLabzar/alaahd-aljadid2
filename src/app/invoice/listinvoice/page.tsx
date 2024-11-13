import Breadcrumb from "@/components/Breadcrumbs/Breadcrumb";
import { Metadata } from "next";
import DefaultLayout from "@/components/Layouts/DefaultLaout";
import ListInvoice from "@/components/ListInvoice";

export const metadata: Metadata = {
  title: "Alaahd Aljadid Aluminum - Backoffice",
  description: "Alaahd Aljadid Aluminum - Backoffice",
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
