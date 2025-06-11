// /src/app/properties/edit/page.tsx
"use client";

import { useEffect, useState } from "react";
import { fetchProperties, updateProperty } from "@/services/api";
import { Property } from "@/types/property";
import { searchPropertiesByName } from "@/services/api";


export default function EditPropertyPage() {
    const [properties, setProperties] = useState<Property[]>([]);
    const [search, setSearch] = useState("");
    const [selectedProperty, setSelectedProperty] = useState<Property | null>(null);
    const [form, setForm] = useState({
        name: "",
        summary: "",
        price: "",
        picture_url: "",
        property_type: "",
        bedrooms: "",
        bathrooms: "",
    });
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState("");
    const [success, setSuccess] = useState("");

    useEffect(() => {
        const delayDebounce = setTimeout(() => {
            if (search.trim()) {
                searchPropertiesByName(search.trim())
                    .then(setProperties)
                    .catch(console.error);
            } else {
                setProperties([]);
            }
        }, 300); // Espera 300ms después de que el usuario deja de escribir

        return () => clearTimeout(delayDebounce);
    }, [search]);

    const handleSelect = (property: Property) => {
        setSelectedProperty(property);
        setForm({
            name: property.name || "",
            summary: property.summary || "",
            price: property.price?.replace("$", "") || "",
            picture_url: property.picture_url || "",
            property_type: property.property_type || "",
            bedrooms: property.bedrooms?.toString() || "",
            bathrooms: property.bathrooms?.toString() || "",
        });
        setError("");
        setSuccess("");
    };

    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
        setForm({ ...form, [e.target.name]: e.target.value });
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!selectedProperty?.id && !selectedProperty?._id) {
            setError("Propiedad inválida.");
            return;
        }
        setLoading(true);
        setError("");
        setSuccess("");

        try {
            const propertyId = selectedProperty.id ?? selectedProperty._id;
            if (!propertyId) {
                setError("ID de propiedad no válido");
                return;
            }

            await updateProperty(propertyId, {
                ...form,
                price: `$${parseFloat(form.price).toFixed(2)}`,
                bedrooms: parseInt(form.bedrooms),
                bathrooms: parseFloat(form.bathrooms),
            });

            setSuccess("Propiedad actualizada correctamente.");
            await fetchProperties().then(setProperties);
        } catch (err) {
            console.error(err);
            setError("Error al actualizar la propiedad.");
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="min-h-screen bg-gray-50 px-6 py-10">
            <h1 className="text-3xl font-bold text-center mb-6 text-gray-800">Editar Propiedad</h1>

            <div className="mb-6">
                <input
                    type="text"
                    placeholder="Buscar propiedad por nombre"
                    className="w-full px-4 py-2 border rounded-lg"
                    value={search}
                    onChange={(e) => setSearch(e.target.value)}
                />
                <ul className="mt-2 space-y-1">
                    {properties.map((p) => (
                        <li
                            key={p.id || p._id}
                            className="cursor-pointer text-blue-600 hover:underline"
                            onClick={() => handleSelect(p)}
                        >
                            {p.name} ({p.id || p._id})
                        </li>
                    ))}
                </ul>
            </div>

            {selectedProperty && (
                <form onSubmit={handleSubmit} className="space-y-5 bg-white p-6 rounded-xl shadow">
                    {error && <p className="text-red-500 text-center">{error}</p>}
                    {success && <p className="text-green-600 text-center">{success}</p>}

                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">Nombre</label>
                        <input
                            type="text"
                            name="name"
                            value={form.name}
                            onChange={handleChange}
                            className="w-full border rounded-lg px-4 py-2"
                            required
                        />
                    </div>
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">Resumen</label>
                        <textarea
                            name="summary"
                            value={form.summary}
                            onChange={handleChange}
                            className="w-full border rounded-lg px-4 py-2"
                            rows={2}
                            required
                        />
                    </div>
                    <div className="grid grid-cols-2 gap-4">
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">Precio (USD)</label>
                            <input
                                type="number"
                                name="price"
                                value={form.price}
                                onChange={handleChange}
                                className="w-full border rounded-lg px-4 py-2"
                                required
                            />
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">Tipo de propiedad</label>
                            <input
                                type="text"
                                name="property_type"
                                value={form.property_type}
                                onChange={handleChange}
                                className="w-full border rounded-lg px-4 py-2"
                            />
                        </div>
                    </div>
                    <div className="grid grid-cols-2 gap-4">
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">Dormitorios</label>
                            <input
                                type="number"
                                name="bedrooms"
                                value={form.bedrooms}
                                onChange={handleChange}
                                className="w-full border rounded-lg px-4 py-2"
                            />
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">Baños</label>
                            <input
                                type="number"
                                step="0.5"
                                name="bathrooms"
                                value={form.bathrooms}
                                onChange={handleChange}
                                className="w-full border rounded-lg px-4 py-2"
                            />
                        </div>
                    </div>
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">Imagen (URL)</label>
                        <input
                            type="text"
                            name="picture_url"
                            value={form.picture_url}
                            onChange={handleChange}
                            className="w-full border rounded-lg px-4 py-2"
                        />
                    </div>

                    <button
                        type="submit"
                        disabled={loading}
                        className="w-full bg-blue-600 hover:bg-blue-700 text-white font-semibold py-2 px-4 rounded-lg transition duration-200"
                    >
                        {loading ? "Guardando..." : "Actualizar Propiedad"}
                    </button>
                </form>
            )}
        </div>
    );
}