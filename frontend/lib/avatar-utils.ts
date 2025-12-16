/**
 * Construye la URL completa para mostrar un avatar
 * @param avatarPath - Ruta del avatar desde el backend (puede ser null/undefined)
 * @param fallback - URL de fallback si no hay avatar (opcional)
 * @returns URL completa del avatar o undefined si no hay avatar
 */
export function buildAvatarUrl(avatarPath?: string | null, fallback?: string): string | undefined {
  if (!avatarPath) {
    return fallback;
  }
  
  // Si ya es una URL completa, devolverla tal como está
  if (avatarPath.startsWith('http://') || avatarPath.startsWith('https://')) {
    return avatarPath;
  }
  
  // Construir URL completa con la base API
  const baseUrl = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8080/api';
  return `${baseUrl}/uploads/${avatarPath}`;
}

/**
 * Obtiene las iniciales de un nombre completo para usar en AvatarFallback
 * @param firstName - Nombre del usuario
 * @param lastName - Apellido del usuario (opcional)
 * @returns Iniciales en mayúsculas
 */
export function getInitials(firstName?: string, lastName?: string): string {
  const first = firstName?.charAt(0)?.toUpperCase() || 'U';
  const last = lastName?.charAt(0)?.toUpperCase() || '';
  return first + last;
} 