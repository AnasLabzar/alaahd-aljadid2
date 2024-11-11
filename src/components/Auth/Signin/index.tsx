'use client';
import React, { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import GoogleSigninButton from "../GoogleSigninButton";
import SigninWithPassword from "../SigninWithPassword";
import axios, { AxiosError } from "axios";

// Fonction d'appel API pour la connexion utilisateur avec axios
const loginUser = async (email: string, password: string) => {
  try {
    const response = await axios.post("https://backendalaahd.onrender.com/api/auth/login/", {
      email,
      password,
    });

    const { sessionToken } = response.data.authentication;
    // Récupérer les données de l'utilisateur avec l'objet d'authentification
    const user = response.data;  // Supposons que l'utilisateur fasse partie de la réponse

    // Stocker l'objet utilisateur complet dans sessionStorage
    sessionStorage.setItem('user-info', JSON.stringify(user));  // Stocker l'objet utilisateur complet

    // Stocker le jeton de session dans sessionStorage
    sessionStorage.setItem('ANAS-AUTH', sessionToken);

    // Afficher dans la console pour vérifier si c'est stocké
    console.log('Jeton de session stocké dans sessionStorage:', sessionStorage.getItem('ANAS-AUTH'));
    
    return response.data;
  } catch (error: unknown) {
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

  // Gérer la soumission du formulaire
  const handleLogin = async (email: string, password: string) => {
    setError("");

    if (!email || !password) {
      setError("L'email et le mot de passe sont requis");
      return;
    }

    try {
      await loginUser(email, password);

      // Après une connexion réussie, rafraîchir la page actuelle (Accueil)
      router.push("/"); // Cela déclenche le rechargement du composant Accueil
    } catch (err) {
      setError("Identifiants invalides ou erreur lors de la connexion");
    }
  };

  // Utiliser useEffect pour mettre à jour la classe du corps pour le mode sombre
  useEffect(() => {
    if (darkMode) {
      document.body.classList.add("dark");
    } else {
      document.body.classList.remove("dark");
    }
  }, [darkMode]);

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
