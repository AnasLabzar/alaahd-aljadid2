import React from "react";
import DefaultLayout from "@/components/Layouts/DefaultLaout";
import Breadcrumb from "@/components/Breadcrumbs/Breadcrumb";
import RegisterUser from "@/components/Auth/Register";

const Register: React.FC = () => {
    return (
        <DefaultLayout>
          <div className="mx-auto max-w-full">
            <Breadcrumb pageName="Crée nouveau utilisateur" />
    
            <RegisterUser />
          </div>
        </DefaultLayout>
      );
    };

export default Register;
