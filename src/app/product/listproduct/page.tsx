import Breadcrumb from "@/components/Breadcrumbs/Breadcrumb";
import { Metadata } from "next";
import DefaultLayout from "@/components/Layouts/DefaultLaout";
import ProfileBox from "@/components/List";

export const metadata: Metadata = {
  title: "Alaahd Aljadid Aluminum - Backoffice",
  description: "Alaahd Aljadid Aluminum - Backoffice",
};

const ListProductPage = () => {
  return (
    <DefaultLayout>
      <div className="mx-auto w-full max-w-full">
        <Breadcrumb pageName="Liste Produits" />

        <ProfileBox />
      </div>
    </DefaultLayout>
  );
};

export default ListProductPage;
