import { NextResponse } from 'next/server'

export function middleware(request) {
    const token = request.cookies.get('token')?.value;
    const { pathname } = request.nextUrl;

    const isAuthPage = pathname.startsWith('/login') ||
        pathname.startsWith('/signup') ||
        pathname.startsWith('/forgot-password') ||
        pathname.startsWith('/reset-password');

    // Allow root (home) for everyone
    if (pathname === '/') {
        if (token) {
            // Already logged in – redirect to dashboard
            return NextResponse.redirect(new URL('/dashboard', request.url));
        }
        return NextResponse.next();
    }

    // Protect dashboard and all subroutes under /dashboard
    const isDashboardRoute = pathname.startsWith('/dashboard') ||
        pathname.startsWith('/entries') ||
        pathname.startsWith('/categories') ||
        pathname.startsWith('/budgets') ||
        pathname.startsWith('/reports');

    if (!token && isDashboardRoute) {
        return NextResponse.redirect(new URL('/login', request.url));
    }

    if (token && isAuthPage) {
        return NextResponse.redirect(new URL('/dashboard', request.url));
    }

    return NextResponse.next();
}

export const config = {
    matcher: ['/((?!api|_next/static|_next/image|favicon.ico).*)'],
};