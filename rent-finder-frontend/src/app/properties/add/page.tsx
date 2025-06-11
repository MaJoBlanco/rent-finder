// /src/app/properties/add/page.tsx
import { useState } from "react";
import { createProperty } from "@/services/api";

export default function AddPropertyPage() {
  const [formData, setFormData] = useState({ name: "", summary: "", price: "" });

  const handleChange = (e: any) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e: any) => {
    e.preventDefault();
    await createProperty(formData);
    alert("Propiedad creada");
  };

  return (
    <form onSubmit={handleSubmit}>
      <input name="name" placeholder="Nombre" onChange={handleChange} />
      <input name="summary" placeholder="Descripción" onChange={handleChange} />
      <input name="price" placeholder="Precio" onChange={handleChange} />
      <button type="submit">Crear</button>
    </form>
  );
}
