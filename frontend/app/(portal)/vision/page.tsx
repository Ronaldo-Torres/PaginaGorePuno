
export const metadata = {
    title: "Vision | Gobierno Regional de Puno",
    description: "Conoce la visión institucional del Gobierno Regional de Puno.",
};

export default function VisionPage() {
    return (
        <main className="my-50 px-4 mx-auto max-w-3xl">
            <h1 className="text-4xl font-extrabold mb-6 text-[#063585] uppercase text-center">
                Visión
            </h1>
            <p className="text-center italic font-bold-500">
                Aprobado con Ordenanza Regional 022-2013-GRP-CRP
            </p>
            <p className="text-center font-semibold my-2">
                "Región Puno, con su lago Titicaca navegable más alto del mundo y Parque Nacional Bahuaja Sonene"
            </p>
            <p className="text-lg text-gray-800 leading-relaxed tracking-wide border-l-4 border-[#063585] pl-4 italic">
                Al 2021, somos una región andina amazónica que ha afirmado su identidad, su población ha desarrollado interculturalmente, capacidades, valores y goza de calidad de vida, con igualdad de oportunidades.
                Maneja sosteniblemente sus recursos naturales y el ambiente, integrando corredores ecológicos, con una producción agropecuaria, minero energética e industrial competitiva; basada en la ciencia, tecnología e investigación. Líder en el desarrollo de cadenas productivas en camélidos sudamericanos, ovinos, bovinos, granos andinos, café, trucha y el turismo, insertados a los mercados nacional e internacional, en un marco de desarrollo integral y sustentable.
                La gestión pública es modema, transparente y democrática en el marco del Estado de derecho, con equidad y justicia social. Su territorio regional está ordenado y articulado con perspectiva geopolítica.
                "Vida digna para el buen vivir"
            </p>
        </main>
    );
}
