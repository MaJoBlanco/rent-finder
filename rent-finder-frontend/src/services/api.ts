// src/services/api.ts
import { Property } from "@/types/property";

const BASE_URL = "http://localhost:8000"; // Ajusta si cambia el backend

export async function fetchProperties(): Promise<Property[]> {
  const res = await fetch(`${BASE_URL}/properties`);
  if (!res.ok) throw new Error("Error al obtener propiedades");
  const data = await res.json();
  return data.properties; 
}

export async function createProperty(property: Property): Promise<Property> {
  const res = await fetch(`${BASE_URL}/properties`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(property),
  });
  if (!res.ok) throw new Error("Error al crear propiedad");
  return res.json();
}
