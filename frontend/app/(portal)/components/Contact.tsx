"use client";

import { useState, useEffect } from "react";
import {
  FaPhone,
  FaMapMarkerAlt,
  FaCompass,
  FaEnvelope,
  FaSearchPlus,
  FaSearchMinus,
  FaExpand,
  FaClock,
  FaGlobe,
} from "react-icons/fa";

export default function Contact({
  direccionInstitucion,
  telefonoInstitucion,
  telefonoInstitucion2,
  correoInstitucion = "consejo@regionpuno.gob.pe",
  coordenadas = { lat: -15.840935, lng: -70.024427 },
}: {
  direccionInstitucion: string;
  telefonoInstitucion: string;
  telefonoInstitucion2: string;
  correoInstitucion?: string;
  coordenadas?: { lat: number; lng: number };
}) {
  const [isMobile, setIsMobile] = useState(false);
  const [mapLoaded, setMapLoaded] = useState(false);
  const [zoom, setZoom] = useState(16);
  const [center, setCenter] = useState(coordenadas);
  const [showMapControls, setShowMapControls] = useState(false);

  useEffect(() => {
    const checkScreenSize = () => {
      setIsMobile(window.innerWidth < 768);
    };

    checkScreenSize();
    window.addEventListener("resize", checkScreenSize);

    return () => {
      window.removeEventListener("resize", checkScreenSize);
    };
  }, []);

  // Track map loading state
  useEffect(() => {
    const timer = setTimeout(() => {
      setMapLoaded(true);
      // Show map controls briefly to highlight the interactive features
      setShowMapControls(true);
      setTimeout(() => setShowMapControls(false), 3000);
    }, 1000);

    return () => clearTimeout(timer);
  }, []);

  // Handle zoom in/out
  const handleZoomIn = () => {
    setZoom(Math.min(zoom + 1, 21)); // Google Maps max zoom is 21
  };

  const handleZoomOut = () => {
    setZoom(Math.max(zoom - 1, 1)); // Google Maps min zoom is 0
  };

  // Reset map to original position
  const resetMap = () => {
    setZoom(16);
    setCenter(coordenadas);
  };

  // Build Google Maps URL with custom parameters including zoom level
  const mapSrc = `https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d15352.78415637147!2d-70.01458540117285!3d-15.84629061364148!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x915d69eb2b2bea95%3A0xb90b5e90396d0053!2sConsejo%20Regional%20Puno!5e0!3m2!1ses-419!2spe!4v1741797483701!5m2!1ses-419!2spe&z=12==${zoom}`;

  // For navigation via Google Maps app
  const getDirectionsUrl = () => {
    return `https://www.google.com/maps/dir/?api=1&destination=${coordenadas.lat},${coordenadas.lng}`;
  };

  // For opening the full Google Maps in a new tab
  const getFullMapUrl = () => {
    return `https://www.google.com/maps/search/?api=1&query=${coordenadas.lat},${coordenadas.lng}`;
  };

  return (
    <section className="relative h-[350px] md:h-[450px] lg:h-[500px] w-full overflow-hidden">
      {/* Loading state for map */}
      {!mapLoaded && (
        <div className="absolute inset-0 bg-gray-200 animate-pulse flex items-center justify-center">
          <FaMapMarkerAlt className="h-10 w-10 text-gray-400" />
        </div>
      )}

      {/* Google Maps Background */}
      <div className="absolute inset-0">
        <iframe
          src={mapSrc}
          width="100%"
          height="100%"
          style={{ border: 0 }}
          allowFullScreen
          loading="lazy"
          referrerPolicy="no-referrer-when-downgrade"
          title="Ubicación del Consejo Regional de Puno"
          className={`w-full h-full transition-opacity duration-500 ${
            mapLoaded ? "opacity-100" : "opacity-0"
          }`}
          onLoad={() => setMapLoaded(true)}
        />
      </div>

      {/* Map Controls */}
      <div
        className={`absolute top-4 right-4 bg-white/90 backdrop-blur-sm rounded-xl shadow-lg p-2 transition-all duration-300 border border-white/20
        ${showMapControls ? "opacity-90" : "opacity-60 hover:opacity-90"}`}
      >
        <div className="flex flex-col gap-2">
          <button
            onClick={handleZoomIn}
            className="p-3 bg-gradient-to-br from-[#063585] to-[#0a4a9a] hover:from-[#0a4a9a] hover:to-[#063585] text-white rounded-lg shadow-md hover:shadow-lg transition-all duration-300 hover:scale-105"
            aria-label="Acercar"
          >
            <FaSearchPlus className="h-5 w-5" />
          </button>
          <button
            onClick={handleZoomOut}
            className="p-3 bg-gradient-to-br from-[#063585] to-[#0a4a9a] hover:from-[#0a4a9a] hover:to-[#063585] text-white rounded-lg shadow-md hover:shadow-lg transition-all duration-300 hover:scale-105"
            aria-label="Alejar"
          >
            <FaSearchMinus className="h-5 w-5" />
          </button>
          <button
            onClick={resetMap}
            className="p-3 bg-gradient-to-br from-[#063585] to-[#0a4a9a] hover:from-[#0a4a9a] hover:to-[#063585] text-white rounded-lg shadow-md hover:shadow-lg transition-all duration-300 hover:scale-105"
            aria-label="Centrar mapa"
          >
            <FaExpand className="h-5 w-5" />
          </button>
        </div>
      </div>

      {/* "View Larger Map" link */}
      <a
        href={getFullMapUrl()}
        target="_blank"
        rel="noopener noreferrer"
        className="absolute bottom-4 right-4 bg-white/90 backdrop-blur-sm rounded-lg shadow-lg px-4 py-2 text-sm text-[#063585] hover:text-white hover:bg-gradient-to-r hover:from-[#063585] hover:to-[#0a4a9a] transition-all duration-300 font-medium border border-white/20 hover:scale-105"
      >
        <FaGlobe className="inline mr-2" />
        Ver mapa completo
      </a>

      {/* Contact Card Overlay */}
      <div className="absolute inset-0 flex items-center pointer-events-none">
        <div
          className={`bg-gradient-to-br from-slate-900/95 to-blue-900/95 backdrop-blur-md rounded-2xl shadow-2xl p-4 md:p-6 w-full mx-auto max-w-xs md:max-w-md 
          ${isMobile ? "mt-auto mb-4 mx-4" : "ml-[15%] md:ml-[20%]"} 
          transition-all duration-300 text-white pointer-events-auto border border-white/10`}
        >
          <div className="absolute top-0 right-0 w-24 h-24 bg-white/5 rounded-full -translate-y-8 translate-x-8"></div>
          <div className="absolute bottom-0 left-0 w-16 h-16 bg-white/5 rounded-full translate-y-4 -translate-x-4"></div>
          
          <h2 className="text-lg md:text-xl font-bold mb-4 md:mb-6 text-white relative z-10">
            Contáctanos
          </h2>

          <div className="space-y-4 md:space-y-5 relative z-10">
            <div className="flex items-start space-x-3">
              <div className="w-8 h-8 bg-white/20 backdrop-blur-sm rounded-lg flex items-center justify-center flex-shrink-0 mt-1">
                <FaMapMarkerAlt className="h-4 w-4 text-white" />
              </div>
              <div className="flex-1">
                <h3 className="font-semibold mb-1 text-white text-xs md:text-sm uppercase tracking-wide">
                  Dirección
                </h3>
                <p className="text-xs md:text-sm text-white/90 leading-relaxed font-medium">{direccionInstitucion}</p>
                <a
                  href={getDirectionsUrl()}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center text-xs text-yellow-300 hover:text-yellow-200 mt-2 transition-colors font-medium group"
                >
                  <FaCompass className="h-3 w-3 mr-1 group-hover:scale-110 transition-transform" />
                  Cómo llegar
                </a>
              </div>
            </div>

            <div className="flex items-start space-x-3">
              <div className="w-8 h-8 bg-white/20 backdrop-blur-sm rounded-lg flex items-center justify-center flex-shrink-0 mt-1">
                <FaPhone className="h-4 w-4 text-white" />
              </div>
              <div className="flex-1">
                <h3 className="font-semibold mb-1 text-white text-xs md:text-sm uppercase tracking-wide">
                  Teléfonos
                </h3>
                <div className="space-y-1">
                  <a
                    href={`tel:${telefonoInstitucion}`}
                    className="block text-xs md:text-sm text-white/90 hover:text-white transition-colors font-medium group"
                  >
                    <span className="group-hover:underline">{telefonoInstitucion}</span>
                  </a>
                  <a
                    href={`tel:${telefonoInstitucion2}`}
                    className="block text-xs md:text-sm text-white/90 hover:text-white transition-colors font-medium group"
                  >
                    <span className="group-hover:underline">{telefonoInstitucion2}</span>
                  </a>
                </div>
              </div>
            </div>

            <div className="flex items-start space-x-3">
              <div className="w-8 h-8 bg-white/20 backdrop-blur-sm rounded-lg flex items-center justify-center flex-shrink-0 mt-1">
                <FaEnvelope className="h-4 w-4 text-white" />
              </div>
              <div className="flex-1">
                <h3 className="font-semibold mb-1 text-white text-xs md:text-sm uppercase tracking-wide">
                  Correo Electrónico
                </h3>
                <a
                  href={`mailto:${correoInstitucion}`}
                  className="block text-xs md:text-sm text-white/90 hover:text-white transition-colors font-medium group"
                >
                  <span className="group-hover:underline break-all">{correoInstitucion}</span>
                </a>
              </div>
            </div>

            {/* Horario de atención */}
            <div className="pt-3 border-t border-white/20">
              <div className="flex items-center space-x-2 mb-2">
                <div className="w-5 h-5 bg-yellow-400/20 rounded-lg flex items-center justify-center">
                  <FaClock className="text-yellow-300 text-xs" />
                </div>
                <h4 className="font-semibold text-white text-xs uppercase tracking-wide">
                  Horario de Atención
                </h4>
              </div>
              <div className="text-xs text-white/80 space-y-1 ml-7">
                <p>• Lunes a Viernes: 8:30 AM - 4:30 PM</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
