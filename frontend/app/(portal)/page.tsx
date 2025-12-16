"use client";
import { useEffect } from "react";

import AOS from "aos";
import "aos/dist/aos.css"; // Importa los estilos de AOS

import Agenda from "@/components/Agenda";
import Links from "./components/Links";
import Principal from "./components/Principal";
import Servicios from "./components/servicios";
import { Anuncios } from "./components/anuncios";
import Chat from "./components/chat";

import { usePrincipal } from "./layout";
import Noticias from "./components/noticias";
import Boletines from "./components/boletines";

// import Contact from "./components/Contact";
// import MesaDirectiva from "./components/mesa-directiva";
// import PrincipalService from "@/services/PrincipalService";


export default function Page() {
  const { principal } = usePrincipal();

  useEffect(() => {
    AOS.init({
      duration: 1600, // duración de animación en ms
      easing: "ease-out", // suavizado
      once: true, // animar solo una vez
    });
  }, []);

  return (
    <>

      <Anuncios
        logoInstitucionDark={principal?.parametro?.logoInstitucionDark || ""}
        logoInstitucionLight={principal?.parametro?.logoInstitucionLight || ""}
        isHomePage={true}
      />

      {/* <Chat /> */}
      {/* <Chat logoInstitucion={principal?.parametro?.logoInstitucionDark || "/oscuro.png"} /> */}


      <Principal
        portadas={principal?.portadas || []}
        parametro={principal?.parametro || null}
      />

      <div data-aos="fade-up">
        <Servicios servicios={principal?.servicios || []}
          tituloServicio={principal?.parametro?.tituloServicio || ""}
          descripcionServicio={principal?.parametro?.descripcionServicio || ""}
        />
      </div>

      <div data-aos="fade-up">
        <Noticias
          tituloNoticias={principal?.parametro?.tituloNoticias || ""}
          descripcionNoticias={principal?.parametro?.descripcionNoticias || ""}
        />
      </div>



      {/* <MesaDirectiva
        mesaDirectiva={principal?.mesaDirectiva || []}
        tituloPresidencia={principal?.parametro?.tituloPresidencia || ""}
        descripcionPresidencia={principal?.parametro?.descripcionPresidencia || ""}
      /> */}


      <div data-aos="fade-up">

        <Boletines desde=""
          tituloBoletin={principal?.parametro?.tituloBoletin || ""}
          descripcionBoletin={principal?.parametro?.descripcionBoletin || ""}
        />

      </div>


      <div data-aos="fade-up">

        <Agenda
          nombreInstitucion={principal?.parametro?.nombreInstitucion || ""}
          tituloAgenda={principal?.parametro?.tituloAgenda || ""}
          descripcionAgenda={principal?.parametro?.descripcionAgenda || ""}
        />
      </div>


      {/* <Contact
        direccionInstitucion={principal?.parametro?.direccionInstitucion}
        telefonoInstitucion={principal?.parametro?.telefonoInstitucion}
        telefonoInstitucion2={principal?.parametro?.telefonoInstitucion2}
        correoInstitucion={principal?.parametro?.correoInstitucion}
      /> */}


      <div data-aos="fade-up">
        <Links linkInteres={principal?.linkInteres || []}
          tituloEnlaces={principal?.parametro?.tituloEnlaces || ""}
          descripcionEnlaces={principal?.parametro?.descripcionEnlaces || ""}
        />
      </div>

    </>
  );
}
