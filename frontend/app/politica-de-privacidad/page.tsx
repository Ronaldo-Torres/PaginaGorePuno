import { FaShieldAlt } from "react-icons/fa";

export default function PoliticaDePrivacidad() {
  return (
    <div className="container mx-auto py-8 px-4 max-w-4xl">
      <div className="flex items-center gap-3 mb-6">
        <FaShieldAlt className="text-3xl text-primary" />
        <h1 className="text-3xl font-bold">Política de Privacidad</h1>
      </div>

      <div className="space-y-6 text-muted-foreground">
        <div>
          <h2 className="text-xl font-semibold text-foreground mb-2">
            1. Introducción
          </h2>
          <p>
            En el Sistema del Gobierno Regional Puno, respetamos su privacidad y
            nos comprometemos a proteger sus datos personales. Esta política de
            privacidad describe cómo recopilamos, utilizamos y protegemos la
            información que usted nos proporciona a través de nuestra plataforma
            de gestión y administración.
          </p>
        </div>

        <div>
          <h2 className="text-xl font-semibold text-foreground mb-2">
            2. Información que Recopilamos
          </h2>
          <p>Podemos recopilar los siguientes tipos de información:</p>
          <ul className="list-disc pl-6 mt-2 space-y-2">
            <li>
              Información de contacto: nombre, dirección de correo electrónico,
              número de teléfono, dirección postal.
            </li>
            <li>
              Información de la cuenta: credenciales de inicio de sesión,
              preferencias de configuración.
            </li>
            <li>
              Información de uso: datos sobre cómo utiliza nuestros servicios y
              plataformas.
            </li>
            <li>
              Información técnica: dirección IP, tipo de navegador, proveedor de
              servicios de Internet.
            </li>
          </ul>
        </div>

        <div>
          <h2 className="text-xl font-semibold text-foreground mb-2">
            3. Uso de la Información
          </h2>
          <p>Utilizamos la información recopilada para:</p>
          <ul className="list-disc pl-6 mt-2 space-y-2">
            <li>
              Proporcionar, mantener y mejorar nuestros servicios de gestión.
            </li>
            <li>Procesar trámites y enviar notificaciones relacionadas.</li>
            <li>
              Responder a sus consultas y proporcionar soporte al usuario.
            </li>
            <li>
              Enviar información sobre actualizaciones y cambios en el sistema
              (si ha dado su consentimiento).
            </li>
            <li>
              Cumplir con obligaciones legales y proteger nuestros derechos.
            </li>
          </ul>
        </div>

        <div>
          <h2 className="text-xl font-semibold text-foreground mb-2">
            4. Protección de Datos
          </h2>
          <p>
            El Gobierno Regional Puno implementa medidas de seguridad técnicas y
            organizativas apropiadas para proteger sus datos personales contra
            el acceso, modificación, divulgación o destrucción no autorizados.
            Sin embargo, ningún método de transmisión por Internet o
            almacenamiento electrónico es 100% seguro.
          </p>
        </div>

        <div>
          <h2 className="text-xl font-semibold text-foreground mb-2">
            5. Compartir Información
          </h2>
          <p>
            No vendemos ni alquilamos su información personal a terceros.
            Podemos compartir su información en las siguientes circunstancias:
          </p>
          <ul className="list-disc pl-6 mt-2 space-y-2">
            <li>
              Con proveedores de servicios que nos ayudan a operar nuestro
              sistema.
            </li>
            <li>
              Para cumplir con obligaciones legales, como órdenes judiciales.
            </li>
            <li>Con su consentimiento o según sus instrucciones.</li>
          </ul>
        </div>

        <div>
          <h2 className="text-xl font-semibold text-foreground mb-2">
            6. Sus Derechos
          </h2>
          <p>
            Como usuario del Sistema del Gobierno Regional Puno, tiene los
            siguientes derechos:
          </p>
          <ul className="list-disc pl-6 mt-2 space-y-2">
            <li>Derecho de acceso a sus datos personales.</li>
            <li>Derecho de rectificación de datos inexactos.</li>
            <li>Derecho de supresión de sus datos.</li>
            <li>Derecho de oposición al procesamiento de sus datos.</li>
            <li>Derecho a retirar el consentimiento en cualquier momento.</li>
          </ul>
        </div>

        <div>
          <h2 className="text-xl font-semibold text-foreground mb-2">
            7. Cookies y Tecnologías Similares
          </h2>
          <p>
            El Sistema del Gobierno Regional Puno utiliza cookies y tecnologías
            similares para recopilar información sobre su actividad de
            navegación. Puede configurar su navegador para rechazar todas las
            cookies o para indicar cuándo se está enviando una cookie.
          </p>
        </div>

        <div>
          <h2 className="text-xl font-semibold text-foreground mb-2">
            8. Contacto
          </h2>
          <p>
            Si tiene alguna pregunta sobre esta Política de Privacidad, puede
            contactarnos en:
            <a
              href="mailto:Gobierno@regionpuno.gob.pe"
              className="text-primary hover:underline ml-1"
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
