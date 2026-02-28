"use client";

import Link from "next/link";
import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";

export default function Home() {
  const { data: session } = useSession();
  const router = useRouter();

  if (!session) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-500 to-blue-700">
        <div className="bg-white rounded-lg shadow-lg p-8 max-w-md w-full">
          <h1 className="text-3xl font-bold text-center mb-2 text-gray-800">
            Gestion des Étudiants
          </h1>
          <p className="text-center text-gray-600 mb-8">
            Bienvenue dans l'application de gestion des étudiants
          </p>
          <Link
            href="/auth/signin"
            className="block w-full bg-blue-600 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded-lg text-center transition"
          >
            Se connecter
          </Link>
          <div className="mt-4 pt-4 border-t border-gray-200">
            <p className="text-sm text-gray-600 text-center mb-3">
              Nouveau administrateur?
            </p>
            <Link
              href="/auth/register"
              className="block w-full bg-green-600 hover:bg-green-700 text-white font-bold py-2 px-4 rounded-lg text-center transition"
            >
              S'enregistrer
            </Link>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-100">
      <nav className="bg-white shadow-md p-4">
        <div className="container mx-auto flex justify-between items-center">
          <h1 className="text-2xl font-bold text-blue-600">
            Gestion des Étudiants
          </h1>
          <div className="flex gap-4 items-center">
            <span className="text-gray-700">
              Bienvenue, {session.user?.name}
            </span>
            <Link
              href="/api/auth/signout?callbackUrl=/"
              className="bg-red-600 hover:bg-red-700 text-white font-bold py-2 px-4 rounded transition"
            >
              Déconnexion
            </Link>
          </div>
        </div>
      </nav>

      <div className="container mx-auto p-8">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          <div className="bg-white rounded-lg shadow-lg p-6 hover:shadow-xl transition">
            <h2 className="text-2xl font-bold mb-4 text-gray-800">
              Gestion des Étudiants
            </h2>
            <p className="text-gray-600 mb-4">
              Consultez, créez, modifiez ou supprimez les profils des
              étudiants.
            </p>
            <Link
              href="/dashboard/students"
              className="inline-block bg-blue-600 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded transition"
            >
              Accéder à la gestion
            </Link>
          </div>

          <div className="bg-white rounded-lg shadow-lg p-6 hover:shadow-xl transition">
            <h2 className="text-2xl font-bold mb-4 text-gray-800">
              Statistiques
            </h2>
            <p className="text-gray-600 mb-4">
              Consultez les statistiques et informations sur les étudiants.
            </p>
            <Link
              href="/dashboard/stats"
              className="inline-block bg-green-600 hover:bg-green-700 text-white font-bold py-2 px-4 rounded transition"
            >
              Voir les stats
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
