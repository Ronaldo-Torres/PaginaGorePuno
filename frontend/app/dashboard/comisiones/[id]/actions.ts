"use server"

import { revalidatePath } from "next/cache"
import axiosInstance from "@/lib/axiosInstance"

// Tipo para las imágenes existentes
interface ImageData {
  id: string
  url: string
  name: string
}

// Función para obtener imágenes existentes
export async function fetchImages(id: string): Promise<ImageData[]> {
  // Aquí deberías implementar la lógica para obtener las imágenes de tu API o base de datos
  // Este es un ejemplo simulado

 // await new Promise((resolve) => setTimeout(resolve, 1000)) // Simula un retraso de red

  const response = await axiosInstance.get(`/api/v1/comisiones/actividad/${id}/imagenes`)
  return response.data
  return [
    { id: "1", url: "/placeholder.svg?height=200&width=200", name: "Imagen 1" },
    { id: "2", url: "/placeholder.svg?height=200&width=200", name: "Imagen 2" },
    { id: "3", url: "/placeholder.svg?height=200&width=200", name: "Imagen 3" },
    { id: "4", url: "/placeholder.svg?height=200&width=200", name: "Imagen 4" },
    { id: "5", url: "/placeholder.svg?height=200&width=200", name: "Imagen 5" },
    { id: "6", url: "/placeholder.svg?height=200&width=200", name: "Imagen 6" },
    // Agrega más imágenes de ejemplo según sea necesario
  ]
}

// Función para subir nuevas imágenes
export async function uploadImages(formData: FormData) {
  try {
    const images: File[] = []

    for (const [key, value] of formData.entries()) {
      if (key.startsWith("image-") && value instanceof File) {
        images.push(value)
      }
    }

    if (images.length === 0) {
      return { success: false, error: "No se encontraron imágenes para subir" }
    }

    // Aquí implementarías la lógica para guardar cada imagen en tu base de datos o servicio de almacenamiento
    // Este es un ejemplo simulado
    for (const image of images) {
      console.log(`Subien

do imagen: ${image.name}`)
      // Simula un retraso para demostración
      await new Promise((resolve) => setTimeout(resolve, 500))
    }

    // Revalidar la ruta para actualizar los datos mostrados
    revalidatePath("/")

    return {
      success: true,
      message: `${images.length} imágenes subidas correctamente`,
    }
  } catch (error) {
    console.error("Error al subir imágenes:", error)
    return {
      success: false,
      error: error instanceof Error ? error.message : "Error al subir las imágenes",
    }
  }
}

// Función para eliminar una imagen existente
export async function deleteImage(imageId: string) {
  try {
    // Aquí implementarías la lógica para eliminar la imagen de tu base de datos o servicio de almacenamiento
    // Este es un ejemplo simulado
    console.log(`Eliminando imagen con ID: ${imageId}`)
    await new Promise((resolve) => setTimeout(resolve, 500)) // Simula un retraso

    // Revalidar la ruta para actualizar los datos mostrados
    revalidatePath("/")

    return {
      success: true,
      message: "Imagen eliminada correctamente",
    }
  } catch (error) {
    console.error("Error al eliminar la imagen:", error)
    return {
      success: false,
      error: error instanceof Error ? error.message : "Error al eliminar la imagen",
    }
  }
}

