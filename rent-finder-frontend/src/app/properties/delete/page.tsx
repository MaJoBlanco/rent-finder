// /src/app/properties/delete/page.tsx
"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { searchPropertiesByQuery, deletePropertyById } from "@/services/api";
import { Property } from "@/types/property";

export default function DeletePropertyPage() {
  const router = useRouter();
  const [search, setSearch] = useState("");
  const [properties, setProperties] = useState<Property[]>([]);
  const [feedback, setFeedback] = useState("");

  useEffect(() => {
    const delayDebounce = setTimeout(async () => {
      const query = search.trim();
      if (!query) {
        setProperties([]);
        return;
      }

      try {
        // Realiza dos búsquedas: una por nombre y otra por ID
        const [byName, byId] = await Promise.all([
          searchPropertiesByQuery(query, undefined),
          searchPropertiesByQuery(undefined, query)
        ]);

        // Combina los resultados sin duplicados (por _id o id)
        const combinedMap = new Map();
        [...byName, ...byId].forEach((p) => {
          const key = p._id || p.id;
          if (!combinedMap.has(key)) {
            combinedMap.set(key, p);
          }
        });

        setProperties(Array.from(combinedMap.values()));
      } catch (err) {
        console.error(err);
        setProperties([]);
      }
    }, 300);

    return () => clearTimeout(delayDebounce);
  }, [search]);


  const handleDelete = async (id: string) => {
    const confirm = window.confirm("¿Estás seguro de que deseas eliminar esta propiedad?");
    if (!confirm) return;

    try {
      await deletePropertyById(id);
      setFeedback("Propiedad eliminada exitosamente.");
      setProperties((prev) => prev.filter((p) => (p._id || p.id) !== id));
    } catch (err) {
      console.error(err);
      setFeedback("Error al eliminar la propiedad.");
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 px-6 py-10">
      <div className="mb-6 text-left">
        <button
          onClick={() => router.push("/properties")}
          className="text-sm text-blue-600 hover:underline"
        >
          ← Volver a propiedades
        </button>
      </div>
      <h1 className="text-3xl font-bold text-center mb-6 text-gray-800">Eliminar Propiedad</h1>

      <input
        type="text"
        placeholder="Buscar por ID o nombre"
        className="w-full px-4 py-2 border rounded-lg mb-4"
        value={search}
        onChange={(e) => setSearch(e.target.value)}
      />

      {feedback && <p className="text-center text-sm mb-4 text-blue-600">{feedback}</p>}

      <ul className="space-y-3">
        {properties.map((property) => {
          const id = property._id || property.id;
          return (
            <li
              key={id}
              className="flex justify-between items-center bg-white p-4 rounded shadow"
            >
              <div>
                <p className="font-semibold">{property.name}</p>
                <p className="text-sm text-gray-500">ID: {id}</p>
              </div>
              <button
                onClick={() => handleDelete(id!)}
                className="bg-red-600 text-white px-4 py-2 rounded hover:bg-red-700 transition"
              >
                Eliminar
              </button>
            </li>
          );
        })}
      </ul>
    </div>
  );
}
