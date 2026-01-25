import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

export function middleware(request: NextRequest) {
    const token = request.cookies.get('token')?.value;
    const { pathname } = request.nextUrl;

    // Public routes that don't require authentication
    const publicRoutes = ['/', '/login', '/signup', '/verify-otp', '/forgot-password', '/api'];

    // Check if it's a public route or API route
    const isPublicRoute = publicRoutes.some(route =>
        pathname === route || pathname.startsWith('/api/')
    );

    // If trying to access protected route without token
    if (!isPublicRoute && !token) {
        return NextResponse.redirect(new URL('/login', request.url));
    }

    // If authenticated user tries to access login/signup
    if (token && (pathname === '/login' || pathname === '/signup')) {
        return NextResponse.redirect(new URL('/dashboard', request.url));
    }

    return NextResponse.next();
}

export const config = {
    matcher: [
        '/((?!_next/static|_next/image|favicon.ico|uploads|manifest.json|manifest.webmanifest|sw.js|.*\\.png|.*\\.svg).*)',
    ],
};
