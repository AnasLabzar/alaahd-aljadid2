'use client';
import React, { useState } from "react";
import { useRouter } from "next/navigation";
import axios from "axios";
import AuthenticatedLayout from "@/components/AuthenticatedLayout";

// Example usage after successful registration:
const registerUser = async (username: string, email: string, password: string, role: string, phone: string) => {
  try {
    const response = await axios.post("https://backendalaahd.onrender.com/api/auth/register/", {
      username,
      email,
      password,
      role,
      phone,
    });

    return response.data;
  } catch (error) {
    if (axios.isAxiosError(error)) {
      console.error("Échec de l'inscription :", error.response ? error.response.data : error.message);
    } else {
      console.error("Erreur inattendue :", error);
    }
    throw new Error("Erreur lors de l'inscription");
  }
};

export default function RegisterUser() {
  const [username, setUsername] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [role, setRole] = useState("custom");
  const [phone, setPhone] = useState("");
  const [error, setError] = useState("");
  const [darkMode, setDarkMode] = useState(false); // State for dark mode toggle
  const router = useRouter();
  const [isRegistered, setIsRegistered] = useState(false); // Local state to control the redirect

  // Handle form submission
  const handleRegister = async () => {
    setError("");

    if (!username || !email || !password || !phone) {
      setError("Tous les champs sont requis");
      return;
    }

    try {
      await registerUser(username, email, password, role, phone);
      setIsRegistered(true); // Set the registered state to true
    } catch (err) {
      setError("Erreur lors de l'inscription");
    }
  };

  // Toggle dark mode
  const toggleDarkMode = () => {
    setDarkMode((prev) => !prev);
    if (typeof window !== "undefined") {
      document.documentElement.classList.toggle("dark", darkMode);
    }
  };

  // Conditional render based on `isRegistered`
  if (isRegistered) {
    return <AuthenticatedLayout />; // This will render the AuthenticatedLayout after registration
  }

  return (
    <div className={`${darkMode ? 'bg-gray-900' : 'bg-gray-100'} min-h-screen flex items-center justify-center transition-all`}>
      <div className={`w-full max-w-lg p-8 rounded-lg shadow-lg ${darkMode ? 'bg-gray-800 text-white' : 'bg-white text-gray-900'}`}>
        <div className="my-6 flex items-center justify-center">
          <span className="block h-px w-full bg-stroke dark:bg-dark-3"></span>
          <div className="block w-full min-w-fit bg-white px-3 text-center font-medium dark:bg-gray-dark">
            Ajouter un nouvel utilisateur
          </div>
          <span className="block h-px w-full bg-stroke dark:bg-dark-3"></span>
        </div>

        <form onSubmit={(e) => { e.preventDefault(); handleRegister(); }}>
          <div className="mb-4">
            <label htmlFor="username" className={`block text-sm font-medium ${darkMode ? 'text-gray-300' : 'text-gray-700'}`}>Nom d'utilisateur</label>
            <input
              type="text"
              id="username"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              className={`mt-1 p-3 w-full border ${darkMode ? 'border-gray-600' : 'border-gray-300'} rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500`}
              required
            />
          </div>
          <div className="mb-4">
            <label htmlFor="email" className={`block text-sm font-medium ${darkMode ? 'text-gray-300' : 'text-gray-700'}`}>Email</label>
            <input
              type="email"
              id="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className={`mt-1 p-3 w-full border ${darkMode ? 'border-gray-600' : 'border-gray-300'} rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500`}
              required
            />
          </div>
          <div className="mb-4">
            <label htmlFor="password" className={`block text-sm font-medium ${darkMode ? 'text-gray-300' : 'text-gray-700'}`}>Mot de passe</label>
            <input
              type="password"
              id="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className={`mt-1 p-3 w-full border ${darkMode ? 'border-gray-600' : 'border-gray-300'} rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500`}
              required
            />
          </div>
          <div className="mb-4">
            <label htmlFor="phone" className={`block text-sm font-medium ${darkMode ? 'text-gray-300' : 'text-gray-700'}`}>Téléphone</label>
            <input
              type="text"
              id="phone"
              value={phone}
              onChange={(e) => setPhone(e.target.value)}
              className={`mt-1 p-3 w-full border ${darkMode ? 'border-gray-600' : 'border-gray-300'} rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500`}
              required
            />
          </div>
          <div className="mb-4">
            <label htmlFor="role" className={`block text-sm font-medium ${darkMode ? 'text-gray-300' : 'text-gray-700'}`}>Rôle</label>
            <select
              id="role"
              value={role}
              onChange={(e) => setRole(e.target.value)}
              className={`mt-1 p-3 w-full border ${darkMode ? 'border-gray-600' : 'border-gray-300'} rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500`}
            >
              <option value="fourn">Fournisseur</option>
              <option value="admin">Admin</option>
              <option value="custom">Client</option>
              <option value="moder">Modérateur</option>
            </select>
          </div>

          <button
            type="submit"
            className={`w-full p-3 rounded-lg ${darkMode ? 'bg-blue-600 hover:bg-blue-700' : 'bg-blue-500 hover:bg-blue-600'} text-white focus:outline-none focus:ring-2 focus:ring-blue-500`}
          >
            S'inscrire
          </button>
        </form>

        {/* Error message */}
        {error && <div className="text-red-500 text-center mt-2">{error}</div>}
      </div>
    </div>
  );
}
