"use client"

import React, { useEffect, useState } from "react";
import { isAuthenticated } from "@/components/utils/auth";
import DefaultLayout from "@/components/Layouts/DefaultLaout";
import AuthLayout from "@/components/Layouts/AuthLaout";
import SignIn from "@/app/auth/signin/page";
import ECommerce from "@/components/Dashboard/E-commerce";

const AuthenticatedLayout: React.FC = () => {
  const [isAuthRoute, setIsAuthRoute] = useState(false);

  useEffect(() => {
    const authStatus = isAuthenticated();
    setIsAuthRoute(authStatus);
  }, []);

  // If authenticated, render ECommerce, otherwise show SignIn
  return (
    <>
      {isAuthRoute ? (
        <DefaultLayout>
          <ECommerce />
        </DefaultLayout>
      ) : (
        <AuthLayout>
          <SignIn />
        </AuthLayout>
      )}
    </>
  );
};

export default AuthenticatedLayout;
