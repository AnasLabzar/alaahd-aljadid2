import Breadcrumb from "@/components/Breadcrumbs/Breadcrumb";
import { Metadata } from "next";
import DefaultLayout from "@/components/Layouts/DefaultLaout";
import UserTable from "@/components/ListUser";

export const metadata: Metadata = {
  title: "Alaahd Aljadid Aluminum - Backoffice",
  description: "Alaahd Aljadid Aluminum - Backoffice",
};

const ListUsers = () => {
  return (
    <DefaultLayout>
      <div className="mx-auto w-full max-w-full">
        <Breadcrumb pageName="Liste Utilisateur" />

        <UserTable />
      </div>
    </DefaultLayout>
  );
};

export default ListUsers;
