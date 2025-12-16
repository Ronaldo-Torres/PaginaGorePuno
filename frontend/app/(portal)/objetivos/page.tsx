export const metadata = {
    title: "Objetivos | Gobierno Regional de Puno",
    description: "Conoce los objetivos institucionales del Gobierno Regional de Puno.",
};

export default function ObjetivosPage() {
    const objetivos = [
        "Servicios de calidad en educación y salud integral con interculturalidad, así como adecuados servicios básicos, asegurando el bienestar de la población.",
        "Consolidar el espacio regional articulado e integrado a los principales corredores económicos de nivel nacional e internacional.",
        "Promover actividades económicas productivas competitivas y sostenibles con valor agregado para la seguridad alimentaria y la exportación.",
        "Actividad turística competitiva y sostenible adecuadamente articulada a los ejes de desarrollo, corredores y circuitos turísticos.",
        "Manejo sostenible y sustentable del ambiente, recursos naturales y la gestión de riesgos.",
        "Actividad minera limpia y energética sostenible con responsabilidad social.",
        "Gestión pública participativa, eficiente, eficaz y transparente con valores que promueven el desarrollo regional sostenible."
    ];

    return (
        <main className="my-50 px-4 mx-auto max-w-7xl">
            <h1 className="text-4xl font-extrabold mb-10 text-[#063585] uppercase text-center">
                Objetivos
            </h1>

            <div className="flex flex-col md:flex-row items-center gap-8">
                <div className="flex justify-center md:justify-start mb-6 md:mb-0">
                    <img
                        src="https://www.regionpuno.gob.pe/wp-content/uploads/2019/05/logo-aba-copia-1.png"
                        alt="Logo Gobierno Regional de Puno"
                        className="h-50 md:h-60 w-auto"
                    />
                </div>

                <ol className="list-disc list-inside text-md text-gray-800 leading-relaxed tracking-wide border-l-4 border-[#063585] pl-4 space-y-4 italic">
                    {objetivos.map((objetivo, index) => (
                        <li key={index}>{objetivo}</li>
                    ))}
                </ol>
            </div>

        </main>


    );
}
