import { FaFileContract } from "react-icons/fa";

export default function TerminosDeServicio() {
  return (
    <div className="container mx-auto py-8 px-4 max-w-4xl">
      <div className="flex items-center gap-3 mb-6">
        <FaFileContract className="text-3xl text-primary" />
        <h1 className="text-3xl font-bold">Términos de Servicio</h1>
      </div>

      <div className="space-y-6 text-muted-foreground">
        <div>
          <h2 className="text-xl font-semibold text-foreground mb-2">
            1. Introducción
          </h2>
          <p>
            Bienvenido a los Términos de Servicio del Sistema del Gobierno
            Regional Puno. Este documento establece los términos y condiciones
            para el uso de nuestra plataforma de gestión y administración. Al
            utilizar nuestros servicios, usted acepta estos términos en su
            totalidad.
          </p>
        </div>

        <div>
          <h2 className="text-xl font-semibold text-foreground mb-2">
            2. Uso del Servicio
          </h2>
          <p>
            El Sistema del Gobierno Regional Puno proporciona herramientas y
            servicios informáticos para la gestión y administración
            institucional. El uso de estos servicios está sujeto a las
            siguientes condiciones:
          </p>
          <ul className="list-disc pl-6 mt-2 space-y-2">
            <li>
              Debe utilizar nuestros servicios de conformidad con las leyes
              aplicables y la normativa institucional.
            </li>
            <li>
              No está permitido utilizar nuestros servicios para actividades
              ilegales o fraudulentas.
            </li>
            <li>
              Usted es responsable de mantener la confidencialidad de sus
              credenciales de acceso.
            </li>
            <li>
              No debe intentar acceder a áreas restringidas del sistema o
              interferir con la seguridad del mismo.
            </li>
          </ul>
        </div>

        <div>
          <h2 className="text-xl font-semibold text-foreground mb-2">
            3. Cuentas de Usuario
          </h2>
          <p>
            Para utilizar los servicios del Sistema del Gobierno Regional Puno,
            es necesario crear una cuenta de usuario. Al crear una cuenta, usted
            acepta proporcionar información precisa y mantenerla actualizada.
            Cada cuenta es personal e intransferible.
          </p>
        </div>

        <div>
          <h2 className="text-xl font-semibold text-foreground mb-2">
            4. Propiedad Intelectual
          </h2>
          <p>
            Todos los derechos de propiedad intelectual relacionados con
            nuestros servicios y contenidos son propiedad del Gobierno Regional
            Puno o de nuestros licenciantes. No se concede ningún derecho de uso
            o explotación más allá del uso normal de los servicios autorizados.
          </p>
        </div>

        <div>
          <h2 className="text-xl font-semibold text-foreground mb-2">
            5. Limitación de Responsabilidad
          </h2>
          <p>
            El Sistema del Gobierno Regional Puno proporciona sus servicios "tal
            cual", sin garantías de ningún tipo. No nos responsabilizamos por
            daños directos, indirectos, incidentales o consecuentes que puedan
            derivarse del uso de nuestros servicios.
          </p>
        </div>

        <div>
          <h2 className="text-xl font-semibold text-foreground mb-2">
            6. Modificaciones
          </h2>
          <p>
            El Gobierno Regional Puno se reserva el derecho de modificar estos
            términos en cualquier momento. Las modificaciones entrarán en vigor
            inmediatamente después de su publicación en nuestro sitio web. Es su
            responsabilidad revisar periódicamente estos términos.
          </p>
        </div>

        <div>
          <h2 className="text-xl font-semibold text-foreground mb-2">
            7. Contacto
          </h2>
          <p>
            Si tiene alguna pregunta sobre estos Términos de Servicio, puede
            contactarnos en:
            <a
              href="mailto:Gobierno@regionpuno.gob.pe"
              className="text-primary hover:underline"
            >
              Gobierno@regionpuno.gob.pe
            </a>
          </p>
        </div>
      </div>

      <div className="mt-8 pt-4 border-t border-border text-sm text-muted-foreground">
        <p>Última actualización: Junio 2025</p>
      </div>
    </div>
  );
}
