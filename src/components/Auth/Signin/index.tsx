"use client";
import React, { useState, FormEvent } from "react";
import Link from "next/link";
import GoogleSigninButton from "../GoogleSigninButton";
import SigninWithPassword from "../SigninWithPassword";
import axios, { AxiosError } from "axios";

// API login call function using axios
const loginUser = async (email: string, password: string) => {
  try {
    const response = await axios.post("https://backendalaahd.onrender.com/api/auth/login/", {
      email,
      password,
    });

    // Assuming session token is returned
    const { sessionToken } = response.data.authentication;

    // Store session token in cookies or localStorage
    document.cookie = `ANAS-AUTH=${sessionToken}; path=/; secure; HttpOnly`; // Secure and HttpOnly flags for cookies

    return response.data; // Return the user data
  } catch (error: unknown) {
    // Type guard: Check if the error is an instance of AxiosError
    if (axios.isAxiosError(error)) {
      console.error("Login failed:", error.response ? error.response.data : error.message);
    } else {
      console.error("Unexpected error:", error);
    }
    throw new Error("Invalid credentials or error during login");
  }
};

export default function Signin() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");

  // Handle form submission
  const handleLogin = async (e: FormEvent) => {
    e.preventDefault();

    if (!email || !password) {
      setError("Email and password are required");
      return;
    }

    try {
      const user = await loginUser(email, password);

      // Optionally, redirect the user after successful login
      window.location.href = "/dashboard"; // Example redirect to a dashboard
    } catch (err) {
      setError("Invalid credentials or error during login");
    }
  };

  return (
    <>
      <GoogleSigninButton text="Se connecter" />

      <div className="my-6 flex items-center justify-center">
        <span className="block h-px w-full bg-stroke dark:bg-dark-3"></span>
        <div className="block w-full min-w-fit bg-white px-3 text-center font-medium dark:bg-gray-dark">
          Ou connectez-vous avec votre email
        </div>
        <span className="block h-px w-full bg-stroke dark:bg-dark-3"></span>
      </div>

      <div>
        {/* Pass onSubmit prop */}
        <SigninWithPassword onSubmit={handleLogin} />

        {/* Error message */}
        {error && <div className="text-red-500 text-center mt-2">{error}</div>}
      </div>

      <div className="mt-6 text-center">
        <p>
          Vous n'avez pas de compte ?{" "}
          <Link href="/auth/signup" className="text-primary">
            Inscrivez-vous
          </Link>
        </p>
      </div>
    </>
  );
}
