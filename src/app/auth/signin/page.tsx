import React from "react";
import Link from "next/link";
import Image from "next/image";
import Signin from "@/components/Auth/Signin";

const SignIn: React.FC = () => {
  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100 dark:bg-gray-900">
      <div className="rounded-[10px] bg-white shadow-1 dark:bg-gray-dark p-6 max-w-md w-full">
        <div className="flex flex-col items-center">
          <Link href="/">
            <Image
              src="/images/logo/logo-horizontal.png"
              alt="Logo"
              width={176}
              height={32}
              className="dark:hidden"
            />
            <Image
              src="/images/logo/logo-horizontal-light.png"
              alt="Logo"
              width={176}
              height={32}
              className="hidden dark:block"
            />
          </Link>
          
          <h1 className="text-2xl font-bold text-dark dark:text-white mt-4">
            Bienvenue !
          </h1>
          <p className="text-md font-medium text-dark dark:text-dark-6 mt-2">
            Connectez-vous à votre compte
          </p>
          
          <div className="mt-6 w-full">
            <Signin />
          </div>
        </div>
      </div>
    </div>
  );
};

export default SignIn;
