export const metadata = {
    title: "Misión | Gobierno Regional de Puno",
    description: "Conoce la misión institucional del Gobierno Regional de Puno.",
};

export default function MisionPage() {
    return (
        <main className="my-50 px-4 mx-auto max-w-3xl">
            <h1 className="text-4xl font-extrabold mb-6 text-[#063585] uppercase text-center">
                Misión
            </h1>
            <p className="text-lg text-gray-800 leading-relaxed tracking-wide border-l-4 border-[#063585] pl-4 italic">
                "Promover el desarrollo integral y sostenible de la región Puno, con autonomía e igualdad de oportunidades, transparente, competitiva y concertada" de acuerdo a sus competencias exclusivas, compartidas y delegadas, en el marco de las políticas nacionales y sectoriales.
            </p>
        </main>
    );
}
