"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import { FaFileAlt, FaBalanceScale, FaGavel, FaBook } from "react-icons/fa";
import BalancesSection from "./components/BalancesSection";
import NormativosSection from "./components/NormativosSection";
import DocumentosOficialesSection from "./components/DocumentosOficialesSection";

// Animation variants
const animations = {
  container: {
    hidden: { opacity: 0 },
    visible: { opacity: 1 }
  },
  item: {
    hidden: { opacity: 0, y: 20 },
    visible: { opacity: 1, y: 0 }
  },
  title: {
    hidden: { opacity: 0, y: -20 },
    visible: { opacity: 1, y: 0 }
  }
};

export default function DocumentosPage() {
  const [activeSection, setActiveSection] = useState("documentos-oficiales");

  const sections = [
    {
      id: "documentos-oficiales",
      name: "Acuerdos, Ordenanzas y Otros",
      icon: FaFileAlt,
      component: DocumentosOficialesSection
    },
    {
      id: "normativos",
      name: "Documentos Normativos",
      icon: FaBook,
      component: NormativosSection
    },
    {
      id: "balances",
      name: "Balance de Consejeros",
      icon: FaBalanceScale,
      component: BalancesSection
    }
  ];

  const ActiveComponent = sections.find(s => s.id === activeSection)?.component || DocumentosOficialesSection;

  return (
    <motion.div
      className="min-h-[calc(100vh-100px)] bg-gradient-to-br from-gray-50 to-white mt-20"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.5 }}
    >
      <motion.div
        initial="hidden"
        animate="visible"
        variants={animations.container}
        className="max-w-6xl mx-auto px-4 py-12"
      >
        {/* Header Elegante */}
        <motion.div
          variants={animations.title}
          className="mb-8 text-center relative"
        >
          <div className="absolute inset-0 bg-gradient-to-r from-[#184482] to-[#1a4c94] rounded-2xl opacity-10"></div>
          <div className="relative z-10 py-12 px-8">
            <motion.h1
              initial={{ opacity: 0, y: -30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3, duration: 0.8 }}
              className="text-4xl md:text-5xl font-bold mb-4 bg-clip-text text-transparent bg-gradient-to-r from-[#184482] to-[#1a4c94]"
            >
              Documentos
            </motion.h1>
            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: 0.5, duration: 0.6 }}
              className="inline-flex items-center px-6 py-3 bg-gradient-to-r from-[#184482] to-[#1a4c94] text-white rounded-full shadow-lg"
            >
              <FaFileAlt className="h-5 w-5 mr-2" />
              <span className="font-semibold tracking-wide">
                Consejo Regional Puno
              </span>
            </motion.div>
          </div>
        </motion.div>

        {/* Navegación de Secciones */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.6, duration: 0.6 }}
          className="mb-8"
        >
          <div className="flex flex-wrap justify-center gap-2 p-2 bg-white/60 backdrop-blur-sm rounded-2xl border border-gray-200/50">
            {sections.map((section) => {
              const Icon = section.icon;
              const isActive = activeSection === section.id;
              
              return (
                <button
                  key={section.id}
                  onClick={() => setActiveSection(section.id)}
                  className={`
                    relative flex items-center gap-3 px-6 py-3 rounded-xl font-medium transition-all duration-300 group
                    ${isActive 
                      ? 'text-emerald-700 transform scale-105' 
                      : 'text-gray-600 hover:text-[#184482]'
                    }
                  `}
                >
                  {/* Indicador activo */}
                  {isActive && (
                    <motion.div
                      layoutId="activeTab"
                      className="absolute inset-0 bg-gradient-to-r from-emerald-50 to-teal-50 rounded-xl border-2 border-emerald-200/50"
                      initial={false}
                      transition={{ type: "spring", bounce: 0.2, duration: 0.6 }}
                    />
                  )}
                  
                  {/* Efecto hover */}
                  <div className="absolute inset-0 bg-gray-100/50 rounded-xl opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                  
                  {/* Contenido */}
                  <div className="relative z-10 flex items-center gap-3">
                    <Icon className={`h-5 w-5 transition-colors duration-300 ${
                      isActive ? 'text-emerald-600' : 'text-gray-500 group-hover:text-[#184482]'
                    }`} />
                    <span className="font-semibold">{section.name}</span>
            </div>

                  {/* Línea inferior para activo */}
                  {isActive && (
                    <motion.div
                      className="absolute bottom-0 left-1/2 transform -translate-x-1/2 w-8 h-1 bg-gradient-to-r from-emerald-400 to-teal-400 rounded-full"
                      initial={{ opacity: 0, scale: 0 }}
                      animate={{ opacity: 1, scale: 1 }}
                      transition={{ delay: 0.2, duration: 0.4 }}
                    />
                  )}
                </button>
                      );
                    })}
          </div>
        </motion.div>

        {/* Contenido de la Sección Activa */}
        <motion.div
          key={activeSection}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4 }}
        >
          <ActiveComponent />
        </motion.div>
      </motion.div>
    </motion.div>
  );
}
