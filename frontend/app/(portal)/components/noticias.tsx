"use client";

import type React from "react";

import { useState, useEffect } from "react";
import {
  ChevronLeft,
  ChevronRight,
  ExternalLink,
  Facebook,
  Calendar,
  ArrowRight,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
} from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { cn } from "@/lib/utils";
import PrincipalService from "@/services/PrincipalService";
import { motion } from "framer-motion";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";

// Función de utilidad para formatear fechas
const formatDate = (dateString: string): string => {
  const options: Intl.DateTimeFormatOptions = {
    year: "numeric",
    month: "long",
    day: "numeric",
  };
  return new Date(dateString).toLocaleDateString("es-ES", options);
};

interface Imagen {
  id: string;
  url: string;
  descripcion?: string;
  esPrincipal?: boolean;
}

// Define types for better type safety
type News = {
  id: number;
  titulo: string;
  subtitulo: string;
  entradilla: string;
  introduccion: string;
  conclusion: string;
  contenido: string;
  fechaPublicacion: string;
  categoria: string;
  destacado: boolean;
  principal: boolean;
  destacadoAntigua: boolean;
  url: string;
  activo: boolean;
  urlImagenPrincipal: string | null;
  autor: string;
  gorro?: string;
  bajada?: string;
  imagenes?: Imagen[];
};

// Animation variants extracted for reusability
const animations = {
  container: {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: { staggerChildren: 0.1 },
    },
  },
  item: {
    hidden: { y: 20, opacity: 0 },
    visible: {
      y: 0,
      opacity: 1,
      transition: {
        type: "spring" as const,
        stiffness: 100,
        damping: 12,
      },
    },
  },
  title: {
    hidden: { opacity: 0, y: -20 },
    visible: {
      opacity: 1,
      y: 0,
      transition: {
        delay: 0.2,
        duration: 0.6,
        ease: "easeOut" as const,
      },
    },
  },
};

// Social media data
const redesSocialesEmbed = [
  {
    id: "facebook",
    nombre: "Facebook",
    icono: <Facebook className="h-4 w-4" />,
    embedUrl:
      "https://www.facebook.com/plugins/page.php?href=https%3A%2F%2Fwww.facebook.com%2FGobiernoRegionalPuno&tabs=timeline&width=340&height=500&small_header=false&adapt_container_width=true&hide_cover=false&show_facepile=true&appId",
    ancho: "340",
    alto: "500",
    contenedorClase: "w-full max-w-[340px] mx-auto",
  },
];

// Custom hook for fetching news
function useNews() {
  const [news, setNews] = useState<News[]>([]);
  const [importantNews, setImportantNews] = useState<News[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchNews = async () => {
      try {
        // Obtener todas las noticias
        const response = await PrincipalService.getNoticias();

        console.log("responseresponseresponse: ",response)

        // Filtrar noticias destacadas antiguas
        const noticiasDestacadasAntiguas = response.filter(
          (noticia: News) => noticia.destacadoAntigua
        );

        // Filtrar noticias normales (no destacadas antiguas)
        const noticiasNormales = response.filter(
          (noticia: News) => !noticia.destacadoAntigua
        );

        setNews(noticiasNormales);
        setImportantNews(noticiasDestacadasAntiguas);

      } catch (err) {
        console.error("Error fetching news:", err);
        setError("Failed to load news. Please try again later.");
      } finally {
        setLoading(false);
      }
    };

    fetchNews();
  }, []);

  return { news, importantNews, loading, error };
}

export default function Noticias({
  tituloNoticias,
  descripcionNoticias,
}: {
  tituloNoticias: string;
  descripcionNoticias: string;
}) {
  const router = useRouter();
  const { news, importantNews, loading, error } = useNews();
  const [currentNewsIndex, setCurrentNewsIndex] = useState(0);
  const [autoplay, setAutoplay] = useState(true);
  const [selectedSocialMedia, setSelectedSocialMedia] = useState(
    redesSocialesEmbed[0]
  );

  // Function to navigate carousel
  const navigateCarousel = (direction: "next" | "prev") => {
    if (news.length === 0) return;

    if (direction === "next") {
      setCurrentNewsIndex((prev) => (prev === news.length - 1 ? 0 : prev + 1));
    } else {
      setCurrentNewsIndex((prev) => (prev === 0 ? news.length - 1 : prev - 1));
    }
  };

  // Handle user interaction
  const handleUserInteraction = () => {
    setAutoplay(false);
    // Restart autoplay after 10 seconds of inactivity
    const timer = setTimeout(() => setAutoplay(true), 10000);
    return () => clearTimeout(timer);
  };

  // Autoplay effect
  useEffect(() => {
    if (!autoplay || news.length === 0) return;

    const interval = setInterval(() => {
      navigateCarousel("next");
    }, 5000);

    return () => clearInterval(interval);
  }, [autoplay, currentNewsIndex, news.length]);

  // Handle error state
  if (error) {
    return (
      <div className="w-full bg-destructive/10 py-8">
        <div className="container mx-auto p-4 text-center">
          <h2 className="text-2xl font-bold text-destructive mb-2">Error</h2>
          <p className="text-destructive-foreground">{error}</p>
          <Button
            onClick={() => window.location.reload()}
            className="mt-4"
            variant="outline"
          >
            Reintentar
          </Button>
        </div>
      </div>
    );
  }

  if (loading) {
    return <NewsSkeletonLoader />;
  }

  if (news.length === 0) {
    return (
      <div className="container mx-auto p-4 text-center py-12 text-muted-foreground">
        No hay noticias disponibles.
      </div>
    );
  }

  return (
    <section className="bg-[#EEF5F9] py-16 mt-14">
      <div className=" w-11/12 md:w-4/5 mx-auto px-4">

        {/* Header unificado */}
        {/* <div className="text-center mb-16">
          <h2 className="text-2xl md:text-3xl font-bold text-[#063585] mb-6 tracking-wide">
            {tituloNoticias || ""}
          </h2>

          <div className="flex items-center justify-center gap-3 mb-6">
            <div className="w-16 h-0.5 bg-[#063585] rounded-full"></div>
            <div className="w-2 h-2 bg-[#063585] rounded-full"></div>
            <div className="w-16 h-0.5 bg-[#063585] rounded-full"></div>
          </div>

          <p className="text-slate-600 max-w-2xl mx-auto text-base leading-relaxed">
            {descripcionNoticias || ""}
          </p>
          
        </div> */}

        <motion.div
          variants={animations.container}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, amount: 0.1 }}
          className="grid grid-cols-1 lg:grid-cols-3 gap-8 max-w-7xl mx-auto"
        >
          {/* News Section (2/3 width on desktop) */}
          <motion.div
            variants={animations.item}
            className="lg:col-span-2 bg-white  overflow-hidden rounded-xl shadow "
          >
            <div className="p-5 border-b border-gray-100">
              <h2 className="text-2xl font-bold text-[#063585]">
                Últimas Noticias
              </h2>
            </div>

            {/* News Carousel */}
            <div className="relative mx-4">
              <div className="overflow-hidden">
                <div
                  className="transition-transform duration-500 ease-out flex"
                  style={{
                    transform: `translateX(-${currentNewsIndex * 100}%)`,
                  }}
                >
                  {news.map((item) => (
                    <NewsCard
                      key={item.id}
                      newsItem={item}
                      onClick={() => router.push(`/noticias/${item.id}`)}
                    />
                  ))}
                </div>
              </div>

              {/* Carousel Controls */}
              <CarouselControls
                onPrev={() => {
                  handleUserInteraction();
                  navigateCarousel("prev");
                }}
                onNext={() => {
                  handleUserInteraction();
                  navigateCarousel("next");
                }}
                totalItems={news.length}
                currentIndex={currentNewsIndex}
                onDotClick={(index) => {
                  handleUserInteraction();
                  setCurrentNewsIndex(index);
                }}
              />
            </div>

            <CardFooter className="flex justify-center p-6 border-t border-gray-100">
              <Link href="/noticias">
                <Button className="flex items-center gap-2 bg-gradient-to-r from-[#063585] to-[#0a4a9a] hover:from-[#0a4a9a] hover:to-[#063585] text-white transition-all duration-300 px-6 py-3 rounded-xl font-medium shadow-lg hover:shadow-xl cursor-pointer">
                  Ver todas las noticias
                  <ExternalLink className="h-4 w-4" />
                </Button>
              </Link>
            </CardFooter>

            {/* Previous Important News */}
            {/* <div className="p-6 border-t border-gray-100">
              <h3 className="text-xl font-bold mb-5 text-[#063585] flex items-center">
                <div className="w-1 h-5 bg-[#063585]/20 rounded-full mr-2"></div>
                Noticias Importantes Anteriores
              </h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                {importantNews.length > 0 ? (
                  importantNews.map((item) => (
                    <PreviousNewsCard key={item.id} newsItem={item} />
                  ))
                ) : (
                  <p className="text-slate-500 col-span-2 text-center py-4">
                    No hay noticias importantes anteriores.
                  </p>
                )}
              </div>
            </div> */}

          </motion.div>

          {/* Social Media Section (1/3 width on desktop) */}
          <motion.div variants={animations.item} className="lg:col-span-1">
            <Card className="bg-white rounded-xl border-gray-100">
              <CardHeader>
                <h2 className="text-xl font-bold text-[#063585]">
                  Redes Sociales
                </h2>
              </CardHeader>
              <CardContent>
                <Tabs defaultValue="facebook" className="w-full">
                  <TabsList className="grid w-full grid-cols-1 mb-4 bg-gray-100">
                    {redesSocialesEmbed.map((red, index) => (
                      <TabsTrigger
                        key={index}
                        value={red.id}
                        className="flex items-center gap-2 data-[state=active]:bg-[#063585] data-[state=active]:text-white"
                      >
                        {red.icono}
                        <span>{red.nombre}</span>
                      </TabsTrigger>
                    ))}
                  </TabsList>

                  {redesSocialesEmbed.map((red, index) => (
                    <TabsContent
                      key={index}
                      value={red.id}
                      className="border rounded-xl overflow-hidden bg-gray-50"
                    >
                      <div className={red.contenedorClase}>
                        <iframe
                          src={red.embedUrl}
                          width={red.ancho}
                          height={red.alto}
                          style={{ border: "none", overflow: "hidden" }}
                          scrolling="no"
                          frameBorder="0"
                          allowFullScreen={true}
                          allow="autoplay; clipboard-write; encrypted-media; picture-in-picture; web-share"
                        ></iframe>
                      </div>
                    </TabsContent>
                  ))}
                </Tabs>
              </CardContent>
            </Card>
          </motion.div>
        </motion.div>
      </div>
    </section>
  );
}



// Separate components for better organization and readability
type NewsCardProps = {
  newsItem: News;
  onClick: () => void;
};


function NewsCard({ newsItem, onClick }: NewsCardProps) {

  // console.log(newsItem)
  const formattedDate = formatDate(newsItem.fechaPublicacion);

  // img principal
  const imageUrl = newsItem.urlImagenPrincipal
    ? process.env.NEXT_PUBLIC_STORAGE_BASE_URL + newsItem.urlImagenPrincipal
    : "/placeholder.svg";


  // img secundaria
  const secundarias =
    newsItem.imagenes?.filter((img) => !img.esPrincipal) || [];

  // console.log("IMAGENES en newsItem:", newsItem.imagenes);


  return (
    <div className="w-full flex-shrink-0">

      <Link href={`/noticias/${newsItem.id}`} className="cursor-pointer">


        <Card
          className="hover:shadow-xl h  over:-translate-y-1 transition-all duration-300 overflow-hidden cursor-pointer border-none"
          onClick={onClick}
        >
          <CardContent className="p-0">

            <div className="flex flex-col md:flex-row gap-4">
              {/* Imagen principal */}
              {newsItem.urlImagenPrincipal && (
                <div className="flex-1">
                  <div className="w-full relative h-[350px] md:h-[300px]">
                    <Image
                      src={imageUrl}
                      alt={newsItem.titulo}
                      width={700}
                      height={400}
                      className="w-full h-full object-cover transition-transform duration-300 hover:scale-105 rounded-lg"
                      priority
                    />
                  </div>
                </div>
              )}

              {/* Imágenes secundarias */}
              {secundarias.length > 0 && (
                <div className="flex flex-col gap-4 w-full md:w-1/3">
                  {secundarias.slice(0, 2).map((imagen, index) => (
                    <div
                      key={imagen.id || index}
                      className="w-full relative h-[150px]"
                    >
                      <Image
                        src={
                          process.env.NEXT_PUBLIC_STORAGE_BASE_URL + imagen.url
                        }
                        alt={`${newsItem.titulo} - secundaria ${index + 1}`}
                        width={200}
                        height={200}
                        className="w-full h-full object-cover transition-transform duration-300 hover:scale-105 rounded-lg"
                      />
                    </div>
                  ))}
                </div>
              )}


            </div>




            <div className="md:flex">

              {/* {newsItem.urlImagenPrincipal && (
                <div className="w-full md:w-4/5 relative h-[250px] md:h-[300px] bg-red-500">
                  <Image
                    src={imageUrl}
                    alt={newsItem.titulo}
                    width={700}   // ancho real de la imagen
                    height={400}   // altura real proporcional
                    className="w-full h-full object-cover transition-transform duration-300 hover:scale-105"
                    priority
                  />
                </div>
              )} */}

              <div className={`p-6 ${newsItem.urlImagenPrincipal ? "sm:w-wull" : "w-full"} flex flex-col justify-between`} >

                <div>
                  <div className="flex items-center gap-2 text-sm text-gray-500 mb-2">
                    <Calendar className="h-4 w-4" />
                    <span>{formattedDate}</span>
                  </div>
                  <div className="text-xl font-semibold mb-2 line-clamp-2">
                    {newsItem.titulo}
                  </div>
                  <div
                    className="text-sm text-gray-600 line-clamp-3 mb-3 font-medium"
                    dangerouslySetInnerHTML={{ __html: newsItem.bajada || "" }}
                  />
                </div>

                <div className="flex justify-end">
                  <span className="text-primary hover:text-primary/80 flex items-center">
                    Leer más <ArrowRight className="ml-2 h-4 w-4" />
                  </span>
                </div>

              </div>

            </div>

          </CardContent>

        </Card>


      </Link>
    </div >
  );
}

type PreviousNewsCardProps = {
  newsItem: News;
};

function PreviousNewsCard({ newsItem }: PreviousNewsCardProps) {
  const router = useRouter();
  const formattedDate = formatDate(newsItem.fechaPublicacion);

  return (
    <Card
      className="border border-gray-200 hover:shadow-xl hover:-translate-y-1 transition-all duration-300 rounded-xl overflow-hidden cursor-pointer"
      onClick={() => router.push(`/noticias/${newsItem.id}`)}
    >
      <Link href={`/noticias/${newsItem.id}`} className="cursor-pointer">
        <CardContent className="p-4">
          <div className="flex justify-between items-start mb-3">
            <Badge
              variant="outline"
              className="bg-slate-50 text-slate-800 border-slate-200 font-semibold"
            >
              Anteriores
            </Badge>
            <span className="text-xs text-gray-500 flex items-center bg-gray-100 px-2 py-1 rounded-full">
              <Calendar className="h-3 w-3 mr-1" />
              {formattedDate}
            </span>
          </div>
          <h4 className="text-lg font-medium text-gray-900 line-clamp-2 leading-tight">
            {newsItem.titulo}
          </h4>
          {newsItem.gorro && (
            <div
              className="text-sm text-gray-600 line-clamp-1 mt-2 font-medium"
              dangerouslySetInnerHTML={{ __html: newsItem.gorro }}
            />
          )}
          <div
            className="line-clamp-3 text-sm text-gray-700 leading-relaxed mt-2"
            dangerouslySetInnerHTML={{ __html: newsItem.bajada || "" }}
          />
        </CardContent>
      </Link>
    </Card>
  );
}

type CarouselControlsProps = {
  onPrev: () => void;
  onNext: () => void;
  totalItems: number;
  currentIndex: number;
  onDotClick: (index: number) => void;
};

function CarouselControls({
  onPrev,
  onNext,
  totalItems,
  currentIndex,
  onDotClick,
}: CarouselControlsProps) {
  return (
    <>
      <button
        onClick={onPrev}
        className="absolute left-4 top-1/2 -translate-y-1/2 bg-white/90 hover:bg-white rounded-full p-2 shadow-sm hover:shadow-md transition-all z-10 border border-gray-100"
        aria-label="Noticia anterior"
      >
        <ChevronLeft className="h-5 w-5 text-[#063585]" />
      </button>

      <button
        onClick={onNext}
        className="absolute right-4 top-1/2 -translate-y-1/2 bg-white/90 hover:bg-white rounded-full p-2 shadow-sm hover:shadow-md transition-all z-10 border border-gray-100"
        aria-label="Siguiente noticia"
      >
        <ChevronRight className="h-5 w-5 text-[#063585]" />
      </button>

      <div className="absolute -bottom-4 left-1/2 -translate-x-1/2 flex space-x-2 z-10 bg-white/90 rounded-full px-3 py-2 shadow-sm border border-gray-100">
        {Array.from({ length: totalItems }).map((_, index) => (
          <button
            key={index}
            onClick={() => onDotClick(index)}
            className={cn(
              "h-2 rounded-full transition-all",
              currentIndex === index
                ? "bg-[#063585] w-6"
                : "bg-gray-200 hover:bg-[#063585]/30 w-2"
            )}
            aria-label={`Ir a noticia ${index + 1}`}
          />
        ))}
      </div>
    </>
  );
}

function NewsSkeletonLoader() {
  return (
    <div className="w-full bg-white py-16">
      <div className="w-11/12 md:w-4/5 mx-auto px-4">
        <div className="flex justify-center mb-8">
          <Skeleton className="h-10 w-64" />
        </div>

        <div className="w-20 h-0.5 bg-gray-200 mx-auto mb-12 rounded-full" />

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 max-w-7xl mx-auto">
          <div className="lg:col-span-2 bg-white rounded-lg shadow-sm overflow-hidden border border-gray-100">
            <div className="p-5 border-b">
              <Skeleton className="h-8 w-48" />
            </div>

            <div className="p-6">
              <div className="grid md:grid-cols-2 gap-6">
                <Skeleton className="h-64 w-full rounded-lg" />
                <div className="space-y-4">
                  <Skeleton className="h-5 w-24" />
                  <Skeleton className="h-8 w-full" />
                  <Skeleton className="h-8 w-3/4" />
                  <Skeleton className="h-4 w-full" />
                  <Skeleton className="h-4 w-full" />
                  <Skeleton className="h-4 w-3/4" />
                  <Skeleton className="h-10 w-32" />
                </div>
              </div>
            </div>

            <div className="flex justify-center p-6 border-t">
              <Skeleton className="h-10 w-48" />
            </div>

            <div className="p-6 border-t">
              <Skeleton className="h-7 w-64 mb-5" />
              <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                {Array.from({ length: 4 }).map((_, i) => (
                  <Skeleton key={i} className="h-24 w-full rounded-lg" />
                ))}
              </div>
            </div>
          </div>

          <div className="lg:col-span-1">
            <div className="bg-white rounded-lg shadow-sm overflow-hidden border border-gray-100">
              <div className="p-5 border-b flex justify-between items-center">
                <Skeleton className="h-7 w-32" />
                <Skeleton className="h-6 w-20" />
              </div>
              <Skeleton className="h-[600px] w-full" />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
