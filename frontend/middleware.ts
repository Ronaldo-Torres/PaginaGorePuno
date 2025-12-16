import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

/**
 * Middleware simple que solo verifica la existencia de tokens
 * La validación real se maneja en el interceptor de Axios
 */
export function middleware(request: NextRequest) {
  const token = request.cookies.get('accessToken')?.value;

  // Proteger rutas del dashboard - solo verificar existencia del token
  if (request.nextUrl.pathname.startsWith('/dashboard')) {
    if (!token) {
      console.log('Middleware: No token found, redirecting to login');
      return NextResponse.redirect(new URL('/login', request.url));
    }
    // Token existe - permitir acceso (validación real en interceptor)
    return NextResponse.next();
  }

  // Si está en login/register con token, redirigir a dashboard
  if ((request.nextUrl.pathname.startsWith('/login') || 
       request.nextUrl.pathname.startsWith('/register')) && token) {
    console.log('Middleware: Token found, redirecting to dashboard');
    return NextResponse.redirect(new URL('/dashboard', request.url));
  }

  return NextResponse.next();
}

export const config = {
  matcher: [
    '/dashboard/:path*',
    '/login',
    '/register'
  ]
}; 