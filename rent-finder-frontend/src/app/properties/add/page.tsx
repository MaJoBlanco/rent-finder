// /src/app/properties/add/page.tsx
"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { createProperty } from "@/services/api";

export default function AddPropertyPage() {
  const router = useRouter();
  const [form, setForm] = useState({
    name: "",
    summary: "",
    price: "",
    picture_url: "",
    bathrooms: "",
    bedrooms: "",
    property_type: "",
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError("");

    try {
      await createProperty({
        ...form,
        price: `$${parseFloat(form.price).toFixed(2)}`,
        bathrooms: parseFloat(form.bathrooms),
        bedrooms: parseInt(form.bedrooms),
      });

      router.push("/properties");
    } catch (err) {
      console.error("Error al crear la propiedad:", err);
      setError("Error al crear la propiedad");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center px-4">
      <div className="bg-white rounded-2xl shadow-lg p-8 w-full max-w-2xl">
        <div className="mb-6 text-left">
          <button
            onClick={() => router.push("/properties")}
            className="text-sm text-blue-600 hover:underline"
          >
            ← Volver a propiedades
          </button>
        </div>
        <h1 className="text-3xl font-bold mb-6 text-center text-gray-800">Agregar Nueva Propiedad</h1>
        {error && <p className="text-red-500 mb-4 text-center">{error}</p>}
        <form onSubmit={handleSubmit} className="space-y-5">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Nombre</label>
            <input
              type="text"
              name="name"
              value={form.name}
              onChange={handleChange}
              required
              className="w-full border border-gray-300 rounded-lg px-4 py-2"
              placeholder="Nombre de la propiedad"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Resumen</label>
            <textarea
              name="summary"
              value={form.summary}
              onChange={handleChange}
              required
              rows={2}
              className="w-full border border-gray-300 rounded-lg px-4 py-2"
              placeholder="Descripción breve"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Precio</label>
            <input
              type="number"
              name="price"
              value={form.price}
              onChange={handleChange}
              required
              className="w-full border border-gray-300 rounded-lg px-4 py-2"
              placeholder="Precio en USD"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">URL de Imagen</label>
            <input
              type="text"
              name="picture_url"
              value={form.picture_url}
              onChange={handleChange}
              className="w-full border border-gray-300 rounded-lg px-4 py-2"
              placeholder="https://example.com/imagen.jpg"
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Baños</label>
              <input
                type="number"
                name="bathrooms"
                value={form.bathrooms}
                onChange={handleChange}
                step="0.5"
                className="w-full border border-gray-300 rounded-lg px-4 py-2"
                placeholder="Número de baños"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Habitaciones</label>
              <input
                type="number"
                name="bedrooms"
                value={form.bedrooms}
                onChange={handleChange}
                className="w-full border border-gray-300 rounded-lg px-4 py-2"
                placeholder="Número de habitaciones"
              />
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Tipo de Propiedad</label>
            <input
              type="text"
              name="property_type"
              value={form.property_type}
              onChange={handleChange}
              className="w-full border border-gray-300 rounded-lg px-4 py-2"
              placeholder="Casa, Departamento, etc."
            />
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full bg-blue-600 hover:bg-blue-700 text-white font-semibold py-2 px-4 rounded-lg"
          >
            {loading ? "Guardando..." : "Guardar Propiedad"}
          </button>
        </form>
      </div>
    </div>
  );
}
