// /src/app/properties/page.tsx
"use client";

import { useEffect, useState } from "react";
import { fetchProperties } from "@/services/api";
import { Property } from "@/types/property";
import Link from "next/link";
import * as DropdownMenu from "@radix-ui/react-dropdown-menu";

export default function HomePage() {
  const [properties, setProperties] = useState<Property[]>([]);

  useEffect(() => {
    fetchProperties()
      .then((data) => {
        console.log("Datos recibidos:", data);
        setProperties(data);
      })
      .catch(console.error);
  }, []);

  return (
    <div className="px-6 py-10 bg-gray-50 min-h-screen">
      <div className="flex justify-between items-center mb-8">
        <div className="flex-1 text-center">
          <h1 className="text-3xl font-bold text-gray-800">Propiedades disponibles</h1>
        </div>

        {/* Botón desplegable de acciones */}
        <DropdownMenu.Root>
          <DropdownMenu.Trigger asChild>
            <button className="bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded-lg text-sm font-medium transition">
              Acciones
            </button>
          </DropdownMenu.Trigger>

          <DropdownMenu.Content
            className="bg-white border shadow-md rounded-lg py-1 w-48 z-50"
            sideOffset={8}
          >
            <DropdownMenu.Item asChild>
              <Link
                href="/properties/add"
                className="block px-4 py-2 text-sm hover:bg-gray-100 text-gray-700"
              >
                Crear Propiedad
              </Link>
            </DropdownMenu.Item>
            <DropdownMenu.Item asChild>
              <Link
                href="/properties/edit"
                className="block px-4 py-2 text-sm hover:bg-gray-100 text-gray-700"
              >
                Editar Propiedad
              </Link>
            </DropdownMenu.Item>
            <DropdownMenu.Item asChild>
              <Link
                href="/properties/delete"
                className="block px-4 py-2 text-sm hover:bg-gray-100 text-red-600"
              >
                Eliminar Propiedad
              </Link>
            </DropdownMenu.Item>
          </DropdownMenu.Content>
        </DropdownMenu.Root>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
        {Array.isArray(properties) &&
          properties.map((p) => (
            <div
              key={p.id || p._id}
              className="bg-white rounded-xl shadow hover:shadow-lg transition duration-300 overflow-hidden"
            >
              {p.picture_url ? (
                <img
                  src={p.picture_url}
                  alt={p.name}
                  className="w-full h-48 object-cover"
                />
              ) : (
                <div className="w-full h-48 bg-gray-300 flex items-center justify-center text-gray-500">
                  Sin imagen
                </div>
              )}
              <div className="p-4">
                <h2 className="text-lg font-semibold text-gray-800 mb-1">{p.name}</h2>
                <p className="text-sm text-gray-600 mb-2 line-clamp-2">{p.summary}</p>
                <p className="text-md font-bold text-green-700">{p.price ?? "Precio no disponible"}</p>
              </div>
            </div>
          ))}
      </div>
    </div>
  );
}
