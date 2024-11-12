"use client"

// components/AuthenticatedLayout.tsx
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

  if (!isAuthRoute) {
    return (
      <AuthLayout>
        <SignIn />
      </AuthLayout>
    );
  } else {
    return (
      <DefaultLayout>
        <ECommerce />
      </DefaultLayout>
    );
  }
};

export default AuthenticatedLayout;
