"use client";

import { useEffect, useState, useMemo } from "react";
import PrincipalService from "@/services/PrincipalService";
import { motion } from "framer-motion";

interface ConsejeroData {
    id: string;
    nombre: string;
    apellido: string;
    cargo: string;
    entidad?: string;
    provincia?: string;
    distrito?: string;
    telefono?: string;
    url_imagen: string;
}

export default function Alcaldes() {
    const [consejeros, setConsejeros] = useState<ConsejeroData[]>([]);
    const [loading, setLoading] = useState(true);

    const [search, setSearch] = useState("");
    const [cargoFilter, setCargoFilter] = useState("");

    // Paginación
    const [currentPage, setCurrentPage] = useState(1);
    const itemsPerPage = 5;

    // Ordenamiento
    const [sortConfig, setSortConfig] = useState<{
        key: keyof ConsejeroData;
        direction: "asc" | "desc";
    } | null>(null);

    const getAllConsejeros = async () => {
        try {
            const response = await PrincipalService.getAllConsejeros();
            await new Promise((resolve) => setTimeout(resolve, 800));

            // Solo alcaldes
            const alcaldes = response.data.filter(
                (c: ConsejeroData) => c.cargo?.toUpperCase() === "ALCALDE"
            );

            setConsejeros(alcaldes);
        } catch (error) {
            console.error("Error al obtener los consejeros:", error);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        getAllConsejeros();
    }, []);

    // 🔹 Filtrado + Ordenamiento (memoizado)
    const filteredData = useMemo(() => {
        let data = [...consejeros];

        if (search) {
            const s = search.toLowerCase();
            data = data.filter(
                (c) => c.nombre?.toLowerCase().includes(s) || c.apellido?.toLowerCase().includes(s) || c.entidad?.toLowerCase().includes(s) || c.provincia?.toLowerCase().includes(s) || c.distrito?.toLowerCase().includes(s)
            );
        }

        if (cargoFilter) {
            const f = cargoFilter.toLowerCase();
            data = data.filter((c) => c.cargo?.toLowerCase().includes(f));
        }

        if (sortConfig) {
            data.sort((a, b) => {
                const aVal = (a[sortConfig.key] ?? "").toString().toLowerCase();
                const bVal = (b[sortConfig.key] ?? "").toString().toLowerCase();

                if (aVal < bVal) return sortConfig.direction === "asc" ? -1 : 1;
                if (aVal > bVal) return sortConfig.direction === "asc" ? 1 : -1;
                return 0;
            });
        }

        return data;
    }, [search, cargoFilter, consejeros, sortConfig]);

    // 🔹 Paginación
    const totalPages = Math.ceil(filteredData.length / itemsPerPage);
    const startIndex = (currentPage - 1) * itemsPerPage;
    const paginatedData = filteredData.slice(startIndex, startIndex + itemsPerPage);

    // Función ordenar
    const requestSort = (key: keyof ConsejeroData) => {
        let direction: "asc" | "desc" = "asc";
        if (sortConfig && sortConfig.key === key && sortConfig.direction === "asc") {
            direction = "desc";
        }
        setSortConfig({ key, direction });
    };

    return (
        <main className="w-11/12 mx-auto px-4 py-12 h-full my-25">
            {/* Hero */}
            <section
                className="relative pt-16 pb-20 px-4 overflow-hidden"
                style={{
                    background: `linear-gradient(135deg, #184482 0%, #1a4c94 50%, #0f2847 100%)`,
                }}
            >
                <motion.div
                    className="max-w-7xl mx-auto text-center relative z-10"
                    initial={{ opacity: 0, y: 50 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.8 }}
                >
                    <h1 className="text-3xl md:text-5xl font-bold text-white mb-4">
                        ALCALDES
                    </h1>
                    <p className="text-blue-100 text-base max-w-2xl mx-auto font-light">
                        Directorio de Alcaldes de la Región Puno 2023
                    </p>
                </motion.div>
            </section>

            {/* Filtros */}
            <div className="flex flex-col md:flex-row items-center justify-between gap-4 mb-6 mt-6">
                {/* Contador de resultados */}
                <div className="text-gray-600 text-sm">
                    Mostrando <span className="font-semibold">{consejeros.length}</span> resultados
                </div>

                {/* Buscador */}
                <div className="w-full md:w-1/3">
                    <input
                        type="text"
                        placeholder="Buscar..."
                        value={search}
                        onChange={(e) => setSearch(e.target.value)}
                        className="w-full border border-gray-300 rounded-lg px-4 py-2 text-sm focus:outline-none focus:ring focus:ring-blue-300"
                    />
                </div>
            </div>


            {/* Tabla */}
            {loading ? (
                <p className="text-center text-gray-500">Cargando alcaldes...</p>
            ) : (
                <div className="overflow-x-auto shadow-md rounded-lg">
                    <table className="min-w-full bg-white border border-gray-200">
                        <thead className="bg-gray-100 text-gray-700">
                            <tr>
                                <th className="py-3 px-4 border-b">Foto</th>
                                {["entidad", "provincia", "distrito", "nombre", "apellido", "telefono"].map(
                                    (col) => (
                                        <th
                                            key={col}
                                            onClick={() => requestSort(col as keyof ConsejeroData)}
                                            className="py-3 px-4 border-b text-left cursor-pointer select-none"
                                        >
                                            {col.charAt(0).toUpperCase() + col.slice(1)}
                                            {sortConfig?.key === col && (
                                                <span className="ml-2 text-sm">
                                                    {sortConfig.direction === "asc" ? "▲" : "▼"}
                                                </span>
                                            )}
                                        </th>
                                    )
                                )}
                            </tr>
                        </thead>
                        <tbody>
                            {paginatedData.length > 0 ? (
                                paginatedData.map((c) => (
                                    <tr key={c.id} className="hover:bg-gray-50">
                                        <td className="py-3 px-4 border-b text-center">
                                            <img
                                                src={c.url_imagen}
                                                alt={c.nombre}
                                                className="w-12 h-12 object-cover rounded-full mx-auto"
                                            />
                                        </td>
                                        <td className="py-3 px-4 border-b">{c.entidad}</td>
                                        <td className="py-3 px-4 border-b">{c.provincia}</td>
                                        <td className="py-3 px-4 border-b">{c.distrito}</td>
                                        <td className="py-3 px-4 border-b">{c.nombre}</td>
                                        <td className="py-3 px-4 border-b">{c.apellido}</td>
                                        {/* <td className="py-3 px-4 border-b">{c.cargo}</td> */}
                                        <td className="py-3 px-4 border-b">{c.telefono}</td>
                                    </tr>
                                ))
                            ) : (
                                <tr>
                                    <td colSpan={8} className="py-4 text-center text-gray-500 italic">
                                        No se encontraron resultados
                                    </td>
                                </tr>
                            )}
                        </tbody>
                    </table>
                </div>
            )}

            {/* Paginación */}
            <div className="flex justify-center items-center gap-6 mt-6">
                <button
                    onClick={() => setCurrentPage((p) => Math.max(p - 1, 1))}
                    disabled={currentPage === 1}
                    className="px-4 py-2 bg-gray-200 rounded disabled:opacity-50"
                >
                    Anterior
                </button>
                <span>
                    Página {currentPage} de {totalPages || 1}
                </span>
                <button
                    onClick={() => setCurrentPage((p) => Math.min(p + 1, totalPages))}
                    disabled={currentPage === totalPages}
                    className="px-4 py-2 bg-gray-200 rounded disabled:opacity-50"
                >
                    Siguiente
                </button>
            </div>
        </main>
    );
}
