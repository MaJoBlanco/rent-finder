// src/services/api.ts
import { Property } from "@/types/property";

const API_BASE = process.env.NEXT_PUBLIC_API_URL || "http://localhost:8000";

// Obtener propiedades (GET)
export async function fetchProperties(): Promise<Property[]> {
  const res = await fetch(`${API_BASE}/properties`);
  if (!res.ok) throw new Error("Error al obtener propiedades");

  const data = await res.json();

  // Asegúrate que el backend devuelve un objeto con la propiedad 'properties'
  return data.properties ?? [];
}

// Crear propiedad (POST)
export async function createProperty(property: Property): Promise<Property> {
  const res = await fetch(`${API_BASE}/properties`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(property),
  });

  if (!res.ok) throw new Error("Error al crear propiedad");

  return res.json();
}

// Actualizar propiedad (PUT)
export async function updateProperty(id: string, updatedData: Partial<Property>): Promise<Property> {
  const res = await fetch(`${API_BASE}/properties/${id}`, {
    method: "PUT",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(updatedData),
  });

  if (!res.ok) {
    throw new Error(`Error actualizando propiedad: ${res.statusText}`);
  }

  return res.json();
}

export async function searchPropertiesByName(name: string): Promise<Property[]> {
  const res = await fetch(`http://localhost:8000/search?name=${encodeURIComponent(name)}&page_size=10`);
  if (!res.ok) throw new Error("Error al buscar propiedades");
  const data = await res.json();
  return data.properties;
}

export async function deletePropertyById(id: string) {
  const res = await fetch(`http://localhost:8000/properties/${id}`, {
    method: "DELETE",
  });
  if (!res.ok) throw new Error("Error al eliminar la propiedad");
}

export async function searchPropertiesByQuery(name?: string, id?: string): Promise<Property[]> {
  const params = new URLSearchParams();
  if (name) params.append("name", name);
  if (id) params.append("id", id);
  const res = await fetch(`${API_BASE}/search?${params}`);
  if (!res.ok) throw new Error("Error buscando propiedades");
  const data = await res.json();
  return data.properties;
}
