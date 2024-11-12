'use client';
import React, { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import GoogleSigninButton from "../GoogleSigninButton";
import SigninWithPassword from "../SigninWithPassword";
import axios from "axios";
import AuthenticatedLayout from "@/components/AuthenticatedLayout";

// Updated cookie-setting function without HttpOnly
const setCookie = (name: string, value: string, days: number) => {
  const date = new Date();
  date.setTime(date.getTime() + days * 24 * 60 * 60 * 1000); // Set cookie expiry date
  const expires = `expires=${date.toUTCString()}`;
  document.cookie = `${name}=${value}; ${expires}; path=/; secure`; // Secure for HTTPS, removed HttpOnly
};

// Function to store user data in cookies
const setUserInfoInCookies = (userData: any, sessionToken: string) => {
  // Store user object in cookie (serialized to a JSON string)
  setCookie('user-info', JSON.stringify(userData), 1);  // Expiry of 1 day
  console.log("User added to cookie:", userData);

  // Store session token in cookie
  setCookie('ANAS-AUTH', sessionToken, 1);  // Expiry of 1 day
  console.log("Session token added to cookie:", sessionToken);
};

// Example usage after successful login:
const loginUser = async (email: string, password: string) => {
  try {
    const response = await axios.post("https://backendalaahd.onrender.com/api/auth/login/", {
      email,
      password,
    });

    // Assuming response contains the user object and sessionToken
    const { sessionToken } = response.data.authentication;
    const userData = response.data;

    console.log("user", response.data);

    // Store the data in cookies
    setUserInfoInCookies(userData, sessionToken);

    return response.data;
  } catch (error) {
    if (axios.isAxiosError(error)) {
      console.error("Échec de la connexion :", error.response ? error.response.data : error.message);
    } else {
      console.error("Erreur inattendue :", error);
    }
    throw new Error("Identifiants invalides ou erreur lors de la connexion");
  }
};

export default function Signin() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [darkMode, setDarkMode] = useState(false); // État pour gérer le mode sombre
  const router = useRouter();
  const [isLoggedIn, setIsLoggedIn] = useState(false); // Local state to control the redirect

  // Gérer la soumission du formulaire
  const handleLogin = async (email: string, password: string) => {
    setError("");

    if (!email || !password) {
      setError("L'email et le mot de passe sont requis");
      return;
    }

    try {
      await loginUser(email, password);
      setIsLoggedIn(true); // Set the logged-in state to true
    } catch (err) {
      setError("Identifiants invalides ou erreur lors de la connexion");
    }
  };

  // Use useEffect to perform the redirection after login
  // Use useEffect to refresh the page after login
  useEffect(() => {
    if (isLoggedIn) {
      // After login, reload the current page to update the layout
      window.location.reload(); // Reloads the page to reflect changes
    }
  }, [isLoggedIn]); // Only run the effect when `isLoggedIn` changes

  // Utiliser useEffect pour mettre à jour la classe du corps pour le mode sombre
  useEffect(() => {
    if (darkMode) {
      document.body.classList.add("dark");
    } else {
      document.body.classList.remove("dark");
    }
  }, [darkMode]);

  // Conditional render based on `isLoggedIn`
  if (isLoggedIn) {
    return <AuthenticatedLayout />; // This will render the AuthenticatedLayout after login
  }

  return (
    <>
      <div className="flex justify-between items-center mb-6">
        {/* Basculement entre le mode clair/sombre */}
        <button
          onClick={() => setDarkMode(!darkMode)}
          className="p-2 bg-gray-300 rounded-full dark:bg-gray-700 dark:text-white"
        >
          {darkMode ? 'Mode Clair' : 'Mode Sombre'}
        </button>
      </div>

      <div className="my-6 flex items-center justify-center">
        <span className="block h-px w-full bg-stroke dark:bg-dark-3"></span>
        <div className="block w-full min-w-fit bg-white px-3 text-center font-medium dark:bg-gray-dark">
          Ou connectez-vous avec votre email
        </div>
        <span className="block h-px w-full bg-stroke dark:bg-dark-3"></span>
      </div>

      <div>
        {/* Passer l'email et le mot de passe à SigninWithPassword */}
        <SigninWithPassword onSubmit={handleLogin} />

        {/* Message d'erreur */}
        {error && <div className="text-red-500 text-center mt-2">{error}</div>}
      </div>

      <div className="mt-6 text-center">
        <p>
          Vous n'avez pas de compte ? Contactez...{" "}
          <Link href="mailto:alaahdaljadid@gmail.com" className="text-primary">
            alaahdaljadid@gmail.com
          </Link>
        </p>
      </div>
    </>
  );
}
