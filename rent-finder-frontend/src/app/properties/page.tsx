// /src/app/properties/page.tsx
"use client";

import { useEffect, useState } from "react";
import { fetchProperties } from "@/services/api";
import { Property } from "@/types/property";

export default function HomePage() {
  const [properties, setProperties] = useState<Property[]>([]);

  useEffect(() => {
    fetchProperties()
      .then((data) => {
        console.log("Datos recibidos:", data); // 👈 Aquí puedes ver qué devuelve tu API
        setProperties(data);
      })
      .catch(console.error);
  }, []);

  return (
    <div>
      <h1>Propiedades</h1>
      {Array.isArray(properties) && properties.map((p) => (
        <div key={p.id || p._id}>
          <h2>{p.name}</h2>
          <p>{p.summary}</p>
          <p>{p.price}</p>
        </div>
      ))}
    </div>
  );
}