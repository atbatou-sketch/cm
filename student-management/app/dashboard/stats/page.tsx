"use client";

import { useEffect, useState } from "react";
import { useSession } from "next-auth/react";
import Link from "next/link";
import { useRouter } from "next/navigation";

interface Student {
  id: number;
  status: string;
}

export default function StatsPage() {
  const { data: session, status } = useSession();
  const router = useRouter();
  const [stats, setStats] = useState({
    total: 0,
    active: 0,
    inactive: 0,
    graduated: 0,
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (status === "unauthenticated") {
      router.push("/auth/signin");
    } else if (status === "authenticated") {
      fetchStats();
    }
  }, [status]);

  async function fetchStats() {
    try {
      setLoading(true);
      const res = await fetch("/api/students");
      if (res.ok) {
        const data: Student[] = await res.json();
        setStats({
          total: data.length,
          active: data.filter((s) => s.status === "active").length,
          inactive: data.filter((s) => s.status === "inactive").length,
          graduated: data.filter((s) => s.status === "graduated").length,
        });
      }
    } catch (err) {
      console.error("Erreur:", err);
    } finally {
      setLoading(false);
    }
  }

  if (status === "loading" || loading) {
    return <div className="text-center py-10">Chargement...</div>;
  }

  return (
    <div className="min-h-screen bg-gray-100">
      <nav className="bg-white shadow-md p-4">
        <div className="container mx-auto flex justify-between items-center">
          <Link href="/" className="text-2xl font-bold text-blue-600">
            Statistiques
          </Link>
          <div>
            <Link
              href="/dashboard/students"
              className="bg-blue-600 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded mr-2"
            >
              Gestion des Étudiants
            </Link>
            <Link
              href="/"
              className="bg-gray-600 hover:bg-gray-700 text-white font-bold py-2 px-4 rounded mr-2"
            >
              Accueil
            </Link>
            <Link
              href="/api/auth/signout?callbackUrl=/"
              className="bg-red-600 hover:bg-red-700 text-white font-bold py-2 px-4 rounded"
            >
              Déconnexion
            </Link>
          </div>
        </div>
      </nav>

      <div className="container mx-auto p-8">
        <h1 className="text-3xl font-bold mb-8 text-gray-800">
          Statistiques des Étudiants
        </h1>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          <div className="bg-blue-500 text-white rounded-lg shadow-lg p-6">
            <h2 className="text-xl font-bold mb-2">Total Étudiants</h2>
            <p className="text-4xl font-bold">{stats.total}</p>
          </div>

          <div className="bg-green-500 text-white rounded-lg shadow-lg p-6">
            <h2 className="text-xl font-bold mb-2">Actifs</h2>
            <p className="text-4xl font-bold">{stats.active}</p>
          </div>

          <div className="bg-yellow-500 text-white rounded-lg shadow-lg p-6">
            <h2 className="text-xl font-bold mb-2">Inactifs</h2>
            <p className="text-4xl font-bold">{stats.inactive}</p>
          </div>

          <div className="bg-purple-500 text-white rounded-lg shadow-lg p-6">
            <h2 className="text-xl font-bold mb-2">Diplômés</h2>
            <p className="text-4xl font-bold">{stats.graduated}</p>
          </div>
        </div>

        {stats.total === 0 && (
          <div className="mt-8 bg-yellow-100 border border-yellow-400 text-yellow-700 px-4 py-3 rounded">
            Aucun étudiant enregistré pour le moment.
          </div>
        )}
      </div>
    </div>
  );
}
