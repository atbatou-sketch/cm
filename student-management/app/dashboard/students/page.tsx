"use client";

import { useEffect, useState } from "react";
import { useSession } from "next-auth/react";
import Link from "next/link";
import { useRouter } from "next/navigation";

interface Student {
  id: number;
  firstName: string;
  lastName: string;
  email: string;
  phone?: string;
  studentId: string;
  status: string;
  createdAt: string;
}

export default function StudentsPage() {
  const { data: session, status } = useSession();
  const router = useRouter();
  const [students, setStudents] = useState<Student[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [showForm, setShowForm] = useState(false);
  const [editingId, setEditingId] = useState<number | null>(null);
  const [formData, setFormData] = useState({
    firstName: "",
    lastName: "",
    email: "",
    phone: "",
    studentId: "",
    status: "active",
  });

  useEffect(() => {
    if (status === "unauthenticated") {
      router.push("/auth/signin");
    } else if (status === "authenticated") {
      fetchStudents();
    }
  }, [status]);

  async function fetchStudents() {
    try {
      setLoading(true);
      const res = await fetch("/api/students");
      if (res.ok) {
        const data = await res.json();
        setStudents(data);
      } else {
        setError("Erreur lors du chargement des étudiants");
      }
    } catch (err) {
      setError("Une erreur s'est produite");
    } finally {
      setLoading(false);
    }
  }

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();

    if (editingId) {
      // Update
      try {
        const res = await fetch(`/api/students/${editingId}`, {
          method: "PUT",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(formData),
        });

        if (res.ok) {
          setShowForm(false);
          setEditingId(null);
          setFormData({
            firstName: "",
            lastName: "",
            email: "",
            phone: "",
            studentId: "",
            status: "active",
          });
          fetchStudents();
        } else {
          const data = await res.json();
          setError(data.error || "Erreur lors de la mise à jour");
        }
      } catch (err) {
        setError("Une erreur s'est produite");
      }
    } else {
      // Create
      try {
        const res = await fetch("/api/students", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(formData),
        });

        if (res.ok) {
          setShowForm(false);
          setFormData({
            firstName: "",
            lastName: "",
            email: "",
            phone: "",
            studentId: "",
            status: "active",
          });
          fetchStudents();
        } else {
          const data = await res.json();
          setError(data.error || "Erreur lors de la création");
        }
      } catch (err) {
        setError("Une erreur s'est produite");
      }
    }
  }

  async function handleDelete(id: number) {
    if (!confirm("Êtes-vous sûr de vouloir supprimer cet étudiant?")) return;

    try {
      const res = await fetch(`/api/students/${id}`, { method: "DELETE" });
      if (res.ok) {
        fetchStudents();
      } else {
        setError("Erreur lors de la suppression");
      }
    } catch (err) {
      setError("Une erreur s'est produite");
    }
  }

  function handleEdit(student: Student) {
    setFormData({
      firstName: student.firstName,
      lastName: student.lastName,
      email: student.email,
      phone: student.phone || "",
      studentId: student.studentId,
      status: student.status,
    });
    setEditingId(student.id);
    setShowForm(true);
  }

  if (status === "loading" || loading) {
    return <div className="text-center py-10">Chargement...</div>;
  }

  return (
    <div className="min-h-screen bg-gray-100">
      <nav className="bg-white shadow-md p-4">
        <div className="container mx-auto flex justify-between items-center">
          <Link href="/dashboard/students" className="text-2xl font-bold text-blue-600">
            Gestion des Étudiants
          </Link>
          <div>
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
        {error && (
          <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-4">
            {error}
          </div>
        )}

        <div className="mb-4">
          <button
            onClick={() => {
              setShowForm(!showForm);
              if (!showForm) {
                setEditingId(null);
                setFormData({
                  firstName: "",
                  lastName: "",
                  email: "",
                  phone: "",
                  studentId: "",
                  status: "active",
                });
              }
            }}
            className="bg-blue-600 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded"
          >
            {showForm ? "Annuler" : "Ajouter un nouvel étudiant"}
          </button>
        </div>

        {showForm && (
          <div className="bg-white rounded-lg shadow-lg p-6 mb-8">
            <h2 className="text-2xl font-bold mb-4">
              {editingId ? "Modifier l'étudiant" : "Ajouter un nouvel étudiant"}
            </h2>
            <form onSubmit={handleSubmit} className="grid grid-cols-2 gap-4">
              <input
                type="text"
                name="firstName"
                placeholder="Prénom"
                value={formData.firstName}
                onChange={handleChange}
                className="px-3 py-2 border border-gray-300 rounded-lg"
                required
              />
              <input
                type="text"
                name="lastName"
                placeholder="Nom"
                value={formData.lastName}
                onChange={handleChange}
                className="px-3 py-2 border border-gray-300 rounded-lg"
                required
              />
              <input
                type="email"
                name="email"
                placeholder="Email"
                value={formData.email}
                onChange={handleChange}
                className="px-3 py-2 border border-gray-300 rounded-lg"
                required
              />
              <input
                type="text"
                name="phone"
                placeholder="Téléphone"
                value={formData.phone}
                onChange={handleChange}
                className="px-3 py-2 border border-gray-300 rounded-lg"
              />
              <input
                type="text"
                name="studentId"
                placeholder="Numéro d'étudiant"
                value={formData.studentId}
                onChange={handleChange}
                className="px-3 py-2 border border-gray-300 rounded-lg"
                required
              />
              <select
                name="status"
                value={formData.status}
                onChange={handleChange}
                className="px-3 py-2 border border-gray-300 rounded-lg"
              >
                <option value="active">Actif</option>
                <option value="inactive">Inactif</option>
                <option value="graduated">Diplômé</option>
              </select>
              <button
                type="submit"
                className="col-span-2 bg-green-600 hover:bg-green-700 text-white font-bold py-2 px-4 rounded"
              >
                {editingId ? "Mettre à jour" : "Ajouter"}
              </button>
            </form>
          </div>
        )}

        <div className="bg-white rounded-lg shadow-lg overflow-hidden">
          <table className="w-full">
            <thead className="bg-gray-200">
              <tr>
                <th className="px-4 py-2 text-left">Prénom</th>
                <th className="px-4 py-2 text-left">Nom</th>
                <th className="px-4 py-2 text-left">Email</th>
                <th className="px-4 py-2 text-left">N° Étudiant</th>
                <th className="px-4 py-2 text-left">Statut</th>
                <th className="px-4 py-2 text-center">Actions</th>
              </tr>
            </thead>
            <tbody>
              {students.map((student) => (
                <tr key={student.id} className="border-b hover:bg-gray-50">
                  <td className="px-4 py-2">{student.firstName}</td>
                  <td className="px-4 py-2">{student.lastName}</td>
                  <td className="px-4 py-2">{student.email}</td>
                  <td className="px-4 py-2">{student.studentId}</td>
                  <td className="px-4 py-2">
                    <span
                      className={`px-2 py-1 rounded text-white text-sm ${
                        student.status === "active"
                          ? "bg-green-500"
                          : student.status === "graduated"
                          ? "bg-blue-500"
                          : "bg-gray-500"
                      }`}
                    >
                      {student.status === "active"
                        ? "Actif"
                        : student.status === "graduated"
                        ? "Diplômé"
                        : "Inactif"}
                    </span>
                  </td>
                  <td className="px-4 py-2 text-center">
                    <button
                      onClick={() => handleEdit(student)}
                      className="bg-yellow-500 hover:bg-yellow-600 text-white py-1 px-3 rounded mr-2"
                    >
                      Modifier
                    </button>
                    <button
                      onClick={() => handleDelete(student.id)}
                      className="bg-red-500 hover:bg-red-600 text-white py-1 px-3 rounded"
                    >
                      Supprimer
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
          {students.length === 0 && (
            <div className="text-center py-8 text-gray-500">
              Aucun étudiant trouvé
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
