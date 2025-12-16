"use client";

import { useEffect, useState, useMemo } from "react";
import PrincipalService from "@/services/PrincipalService";
import { motion } from "framer-motion";
import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { Facebook, Twitter, Instagram } from "lucide-react";

interface ConsejeroData {
    id: string;
    nombre: string;
    apellido: string;
    cargo: string;
    url_imagen?: string;
    facebook?: string;
    twitter?: string;
    instagram?: string;
    provincia?: string;
    descripcion?: string;
}

const animations = {
    container: {
        hidden: { opacity: 0 },
        visible: {
            opacity: 1,
            transition: { staggerChildren: 0.15, delayChildren: 0.05 },
        },
    },
    item: {
        hidden: { opacity: 0, y: 18 },
        visible: { opacity: 1, y: 0, transition: { duration: 0.45, ease: "easeOut" } },
    },
};

export default function DirectorioInstitucional() {
    const [consejeros, setConsejeros] = useState<ConsejeroData[]>([]);
    const [loading, setLoading] = useState(true);
    const router = useRouter();

    useEffect(() => {
        const getAllConsejeros = async () => {
            try {
                const response = await PrincipalService.getAllConsejeros();
                // opcional: pequeña demora visual
                await new Promise((r) => setTimeout(r, 300));
                setConsejeros(response.data || []);
            } catch (error) {
                console.error("Error al obtener los consejeros:", error);
            } finally {
                setLoading(false);
            }
        };
        getAllConsejeros();
    }, []);

    // 🔥 TopMembers: Gobernador y Vicegobernador (Gobernador primero)
    const topMembers = useMemo(() => {
        return (
            consejeros
                .filter(
                    (c) =>
                        c.cargo &&
                        (c.cargo.toLowerCase().includes("gobernacion") ||
                            c.cargo.toLowerCase().includes("vicegobernacion"))
                )
                .sort((a, b) => {
                    const aIsGob = a.cargo.toLowerCase().includes("gobernacion") && !a.cargo.toLowerCase().includes("vice");
                    const bIsGob = b.cargo.toLowerCase().includes("gobernacion") && !b.cargo.toLowerCase().includes("vice");
                    if (aIsGob && !bIsGob) return -1;
                    if (bIsGob && !aIsGob) return 1;
                    // si ambos son vice o ambos no, ordenar por apellido
                    return (a.apellido || "").localeCompare(b.apellido || "");
                })
        );
    }, [consejeros]);

    // ✅ Consejeros: los que contienen "consejero" en cargo, y excluir gobernadores para evitar duplicados
    const consejerosList = useMemo(() => {
        return consejeros
            .filter(
                (c) =>
                    c.cargo &&
                    c.cargo.toLowerCase().includes("consejero") &&
                    !c.cargo.toLowerCase().includes("gobernacion") &&
                    !c.cargo.toLowerCase().includes("vicegobernacion")
            )
            .sort((a, b) => (a.apellido || "").localeCompare(b.apellido || ""));
    }, [consejeros]);

    if (loading) {
        return (
            <main className="w-4/5 mx-auto px-4 md:w-4/5 py-12 mt-30 h-full">
                <p className="text-center text-gray-500">Cargando...</p>
            </main>
        );
    }

    return (
        <main className="w-4/5 mx-auto px-4 md:w-4/5 py-12 mt-6 h-full">


            <section className="relative pt-16 pb-20 px-4 overflow-hidden mt-20 mb-10"
                style={{
                    background: `linear-gradient(135deg, #184482 0%, #1a4c94 50%, #0f2847 100%)`,
                }}
            >
                <div className="absolute inset-0 overflow-hidden">
                    <div className="absolute top-0 left-0 w-full h-full opacity-10">
                        <div
                            className="w-full h-full"
                            style={{
                                backgroundImage: `repeating-linear-gradient(
                              45deg,
                              transparent,
                              transparent 10px,
                              rgba(255,255,255,0.1) 10px,
                              rgba(255,255,255,0.1) 12px
                            )`,
                            }}
                        />
                    </div>

                    <div className="absolute top-10 left-10 w-32 h-32  border-2 border-white/20 animate-float-slow"></div>
                    <div className="absolute top-20 right-16 w-24 h-24  border border-white/15 animate-pulse"></div>
                    <div className="absolute bottom-16 left-20 w-20 h-20  border border-white/10 animate-float-reverse"></div>
                    <div className="absolute bottom-10 right-10 w-28 h-28  border-2 border-white/25 animate-pulse"></div>

                    <div className="absolute top-1/4 left-0 w-full h-px bg-gradient-to-r from-transparent via-white/30 to-transparent"></div>
                    <div className="absolute bottom-1/3 left-0 w-full h-px bg-gradient-to-r from-transparent via-white/20 to-transparent"></div>

                    <div className="absolute top-16 right-1/4 w-16 h-16 border-l-2 border-t-2 border-white/20 rotate-45"></div>
                    <div className="absolute bottom-20 left-1/3 w-12 h-12 border-r-2 border-b-2 border-white/15 rotate-12"></div>
                </div>

                <motion.div
                    className="max-w-7xl mx-auto text-center relative z-10"
                    initial="hidden"
                    animate="visible"
                    variants={animations.container as any}
                >

                    <motion.div className="mb-12" variants={animations.hero as any}>
                        <h1 className="text-3xl md:text-5xl font-bold text-white mb-4 tracking-tight leading-tight">
                            DIRECTORIO INSTITUCIONAL
                            <br />
                        </h1>
                        <p className="text-blue-100 text-base max-w-2xl mx-auto font-light leading-relaxed">
                            Nuestros líderes que dirigen y coordinan las actividades del
                            Gobierno Regional, trabajando por el desarrollo y bienestar de
                            nuestra región.
                        </p>
                    </motion.div>
                </motion.div>
            </section>



            {/* Top Members: Gobernador / Vicegobernador */}
            {topMembers.length > 0 && (
                <section className="mb-12">
                    {/* <h2 className="text-2xl font-bold mb-6">Gobernación y Vicegobernación</h2> */}

                    <motion.div
                        className="grid grid-cols-1 lg:grid-cols-2 gap-8 max-w-4xl mx-auto"
                        initial="hidden"
                        animate="visible"
                        variants={animations.container as any}
                    >
                        {topMembers.map((member) => {
                            const isGobernador =
                                member.cargo.toLowerCase().includes("gobernacion") &&
                                !member.cargo.toLowerCase().includes("vice");

                            return (
                                <motion.div
                                    key={member.id}
                                    variants={animations.item as any}
                                    className="flex flex-col items-center cursor-pointer group"
                                    onClick={() => router.push(`/consejeros/${member.id}`)}
                                >
                                    <div
                                        className={`mb-4 flex items-center justify-center space-x-2 px-8 py-4 rounded-full shadow-lg backdrop-blur-md border border-white/20 transition-all duration-300 hover:scale-105 hover:shadow-2xl ${isGobernador
                                            ? "bg-gradient-to-r from-amber-400 via-yellow-500 to-orange-600 text-white shadow-yellow-500/40 ring-1 ring-yellow-300/40"
                                            : "bg-gradient-to-r from-indigo-500 via-blue-600 to-purple-700 text-white shadow-blue-500/40 ring-1 ring-indigo-300/40"
                                            }`}
                                    >
                                        <span className="text-sm font-extrabold tracking-widest uppercase drop-shadow-sm">
                                            {isGobernador ? "Gobernación Regional" : "Vicegobernación Regional"}
                                        </span>
                                    </div>


                                    <div className="relative mb-6 group image-glow">
                                        <div className="w-82 h-82 overflow-hidden bg-white/10 backdrop-blur-sm border-3 border-white/30 relative z-10 group-hover:border-white/50 transition-all duration-300">
                                            <Image
                                                src={
                                                    member.url_imagen
                                                        ? `${process.env.NEXT_PUBLIC_STORAGE_BASE_URL}${member.url_imagen}`
                                                        : "/placeholder.svg"
                                                }
                                                alt={`${member.nombre} ${member.apellido}`}
                                                width={700}
                                                height={700}
                                                className="w-full h-full object-cover"
                                                onError={(e) => {
                                                    const t = e.target as HTMLImageElement;
                                                    t.src = "/placeholder.svg";
                                                }}
                                            />
                                        </div>
                                        <div className="absolute inset-0 -z-10 bg-gradient-to-r from-yellow-400/15 to-blue-600/15 blur-2xl  transform scale-110 group-hover:scale-120 transition-transform duration-300"></div>
                                    </div>

                                    <div className="text-center">
                                        <h3 className="text-xl lg:text-2xl font-bold text-gray-900 mb-2">
                                            {member.nombre} {member.apellido}
                                        </h3>
                                        <p className="text-sm text-gray-600 mb-3 uppercase tracking-wide">{member.cargo}</p>

                                        <div className="flex justify-center space-x-3">
                                            {member.facebook && (
                                                <Link href={member.facebook} target="_blank" className="inline-block">
                                                    <div className="w-10 h-10  bg-gray-100 text-gray-800 flex items-center justify-center transition-all duration-200 hover:shadow">
                                                        <Facebook className="w-4 h-4" />
                                                    </div>
                                                </Link>
                                            )}
                                            {member.twitter && (
                                                <Link href={member.twitter} target="_blank" className="inline-block">
                                                    <div className="w-10 h-10  bg-gray-100 text-gray-800 flex items-center justify-center transition-all duration-200 hover:shadow">
                                                        <Twitter className="w-4 h-4" />
                                                    </div>
                                                </Link>
                                            )}
                                            {member.instagram && (
                                                <Link href={member.instagram} target="_blank" className="inline-block">
                                                    <div className="w-10 h-10  bg-gray-100 text-gray-800 flex items-center justify-center transition-all duration-200 hover:shadow">
                                                        <Instagram className="w-4 h-4" />
                                                    </div>
                                                </Link>
                                            )}
                                        </div>
                                    </div>
                                </motion.div>
                            );
                        })}
                    </motion.div>
                </section>
            )}

            {/* Lista de Consejeros (separada) */}
            <section>
                <h2 className="text-3xl md:text-4xl font-extrabold mb-8 text-center bg-gradient-to-r from-blue-500 via-indigo-500 to-purple-600 bg-clip-text text-transparent relative inline-block">
                    Consejo Regional
                    <span className="absolute left-1/2 -bottom-2 w-24 h-1 bg-gradient-to-r from-blue-400 to-purple-500 rounded-full transform -translate-x-1/2"></span>
                </h2>

                {consejerosList.length === 0 ? (
                    <p className="text-gray-500">No se encontraron consejeros.</p>
                ) : (
                    <motion.div
                        className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6"
                        initial="hidden"
                        animate="visible"
                        variants={animations.container as any}
                    >
                        {consejerosList.map((c) => (
                            <motion.div
                                key={c.id}
                                variants={animations.item as any}
                                className="bg-white rounded-xl overflow-hidden shadow-sm hover:shadow-md transition-all duration-200 cursor-pointer border border-gray-100"
                                onClick={() => router.push(`/consejeros/${c.id}`)}
                            >
                                <div className="p-4 flex flex-col items-center">
                                    <div className="w-28 h-28  overflow-hidden mb-3 border border-gray-200">
                                        <Image
                                            src={
                                                c.url_imagen ? `${process.env.NEXT_PUBLIC_STORAGE_BASE_URL}${c.url_imagen}` : "/placeholder.svg"
                                            }
                                            alt={`${c.nombre} ${c.apellido}`}
                                            width={112}
                                            height={112}
                                            className="object-cover w-full h-full"
                                            onError={(e) => {
                                                const t = e.target as HTMLImageElement;
                                                t.src = "/placeholder.svg";
                                            }}
                                        />
                                    </div>

                                    <h3 className="text-sm font-semibold text-gray-800 text-center">
                                        {c.nombre} {c.apellido}
                                    </h3>
                                    <p className="text-xs text-gray-500 uppercase tracking-wide mt-1 text-center">{c.cargo}</p>

                                    <div className="flex items-center gap-2 mt-3">
                                        {c.facebook && (
                                            <Link href={c.facebook} target="_blank">
                                                <Facebook className="w-4 h-4 text-gray-600 hover:text-blue-600" />
                                            </Link>
                                        )}
                                        {c.twitter && (
                                            <Link href={c.twitter} target="_blank">
                                                <Twitter className="w-4 h-4 text-gray-600 hover:text-sky-500" />
                                            </Link>
                                        )}
                                        {c.instagram && (
                                            <Link href={c.instagram} target="_blank">
                                                <Instagram className="w-4 h-4 text-gray-600 hover:text-pink-600" />
                                            </Link>
                                        )}
                                    </div>
                                </div>
                            </motion.div>
                        ))}
                    </motion.div>
                )}
            </section>
        </main>
    );
}
