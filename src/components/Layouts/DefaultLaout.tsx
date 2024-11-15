"use client";
import React, { useState, ReactNode, useEffect } from "react";
import Sidebar from "@/components/Sidebar";
import Header from "@/components/Header";
import AuthLayout from "./AuthLaout";
import SignIn from "@/app/auth/signin/page";
import { isAuthenticated } from "../utils/auth";

export default function DefaultLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [isAuthRoute, setIsAuthRoute] = useState(false);

  useEffect(() => {
    const authStatus = isAuthenticated();
    setIsAuthRoute(authStatus);
  }, []);

  return (
    <>
  {isAuthRoute ? (

      <div className="flex h-screen overflow-hidden">
        <Sidebar sidebarOpen={sidebarOpen} setSidebarOpen={setSidebarOpen} />
        <div className="relative flex flex-1 flex-col overflow-y-auto overflow-x-hidden">
          {/* <!-- ===== Header Star ===== --> */}
          <Header sidebarOpen={sidebarOpen} setSidebarOpen={setSidebarOpen} />
          {/* <!-- ===== Header End ===== --> */}

          {/* <!-- ===== Main Content Star ===== --> */}
          <main>
            <div className="mx-auto max-w-screen-2xl p-4 md:p-6 2xl:p-10">
              {children}
            </div>
          </main>
          {/* <!-- ===== Main Content End ===== --> */}
        </div>
      </div>
    ) : (
      <AuthLayout>
        <SignIn />
      </AuthLayout>
    )}
    </>
  );
}
