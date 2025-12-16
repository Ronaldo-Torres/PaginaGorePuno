import { type ClassValue, clsx } from "clsx"
import { twMerge } from "tailwind-merge"

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

// Funciones de formateo de fechas
export function formatDateWithName(date: string | Date | null | undefined): string {
  if (!date) return "-"
  
  const dateObj = typeof date === 'string' ? new Date(date) : date
  
  if (isNaN(dateObj.getTime())) return "-"
  
  const options: Intl.DateTimeFormatOptions = {
    day: 'numeric',
    month: 'long',
    year: 'numeric'
  }
  
  return dateObj.toLocaleDateString('es-ES', options)
}

export function formatDateShort(date: string | Date | null | undefined): string {
  if (!date) return "-"
  
  const dateObj = typeof date === 'string' ? new Date(date) : date
  
  if (isNaN(dateObj.getTime())) return "-"
  
  const options: Intl.DateTimeFormatOptions = {
    day: '2-digit',
    month: '2-digit',
    year: 'numeric'
  }
  
  return dateObj.toLocaleDateString('es-ES', options)
}

export function formatDateTime(date: string | Date | null | undefined): string {
  if (!date) return "-"
  
  const dateObj = typeof date === 'string' ? new Date(date) : date
  
  if (isNaN(dateObj.getTime())) return "-"
  
  const options: Intl.DateTimeFormatOptions = {
    day: 'numeric',
    month: 'long',
    year: 'numeric',
    hour: '2-digit',
    minute: '2-digit'
  }
  
  return dateObj.toLocaleDateString('es-ES', options)
}

export function formatDateForTable(date: string | Date | null | undefined): string {
  if (!date) return "-"
  
  const dateObj = typeof date === 'string' ? new Date(date) : date
  
  if (isNaN(dateObj.getTime())) return "-"
  
  const options: Intl.DateTimeFormatOptions = {
    day: 'numeric',
    month: 'long',
    year: 'numeric'
  }
  
  return dateObj.toLocaleDateString('es-ES', options)
}
