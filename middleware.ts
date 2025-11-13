import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

// Define protected routes and their required permissions
const protectedRoutes = {
  '/users': 'users',
  '/products': 'products',
  '/products/add': 'products',
  '/suppliers': 'suppliers', 
  '/suppliers/add': 'suppliers',
  '/shops': 'shops',
  '/shops/add': 'shops',
  '/grn': 'grn',
  '/grn/add': 'grn',
  '/discounts': 'discounts',
  '/discounts/add': 'discounts',
  '/sample1': 'sample1',
  '/sample2': 'sample2',
  '/reports': 'reports',
  '/settings': 'settings',
  '/debug-access': 'settings'
};

// Public routes that don't require authentication
const publicRoutes = ['/login', '/test-login', '/login-test', '/health', '/api/auth/login', '/api/auth/logout', '/api/health-simple', '/api/debug', '/api/test-db', '/api/login-debug'];

export function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;

  // Allow public routes
  if (publicRoutes.some(route => pathname.startsWith(route))) {
    return NextResponse.next();
  }

  // Allow API routes (except auth which is handled above)
  if (pathname.startsWith('/api/')) {
    return NextResponse.next();
  }

  // Allow static files and Next.js internals
  if (
    pathname.startsWith('/_next/') ||
    pathname.startsWith('/favicon.ico') ||
    pathname.includes('.')
  ) {
    return NextResponse.next();
  }

  // Get user data from cookies or headers
  let userData = null;
  
  try {
    // Try to get user from session storage via cookie (for client-side)
    const userCookie = request.cookies.get('currentUser');
    if (userCookie) {
      userData = JSON.parse(userCookie.value);
    }
  } catch (error) {
    // If cookie parsing fails, redirect to login
    console.log('Invalid user cookie, redirecting to login');
  }

  // Check if route requires authentication
  const requiredPermission = protectedRoutes[pathname as keyof typeof protectedRoutes];
  
  if (requiredPermission) {
    // Route requires authentication
    if (!userData) {
      console.log(`Middleware: Redirecting to login from ${pathname} - No user data`);
      return NextResponse.redirect(new URL('/login', request.url));
    }

    // Check if user has required permission
    if (!userData.accessPages || !userData.accessPages.includes(requiredPermission)) {
      console.log(`Middleware: Access denied to ${pathname} for user ${userData.username} - Missing permission: ${requiredPermission}`);
      
      // Find first accessible page for redirect
      if (userData.accessPages && userData.accessPages.length > 0) {
          const pageRoutes: Record<string, string> = {
            'home': '/',
            'sample1': '/sample1',
            'sample2': '/sample2',
            'users': '/users',
            'products': '/products/add',
            'suppliers': '/suppliers/add',
            'shops': '/shops/add',
            'grn': '/grn/add',
            'discounts': '/discounts/add',
            'settings': '/settings',
            'reports': '/reports',
            'debug': '/debug-access'
          };        const firstAccessiblePage = userData.accessPages[0];
        const redirectRoute = pageRoutes[firstAccessiblePage] || '/';
        
        console.log(`Middleware: Redirecting to accessible page: ${redirectRoute}`);
        return NextResponse.redirect(new URL(redirectRoute, request.url));
      } else {
        // No accessible pages, redirect to login
        console.log(`Middleware: No accessible pages, redirecting to login`);
        return NextResponse.redirect(new URL('/login', request.url));
      }
    }
  }

  // For home page ('/'), check if user is authenticated
  if (pathname === '/') {
    if (!userData) {
      console.log(`Middleware: Redirecting to login from home - No authentication`);
      return NextResponse.redirect(new URL('/login', request.url));
    }
    
    // Check if user has access to home page
    if (!userData.accessPages || !userData.accessPages.includes('home')) {
      // Redirect to first accessible page
      if (userData.accessPages && userData.accessPages.length > 0) {
        const pageRoutes: Record<string, string> = {
          'sample1': '/sample1',
          'sample2': '/sample2',
          'users': '/users',
          'products': '/products/add',
          'suppliers': '/suppliers/add',
          'shops': '/shops/add',
          'grn': '/grn/add',
          'discounts': '/discounts/add',
          'settings': '/settings',
          'reports': '/reports',
          'debug': '/debug-access'
        };
        
        const firstAccessiblePage = userData.accessPages[0];
        const redirectRoute = pageRoutes[firstAccessiblePage] || '/login';
        
        console.log(`Middleware: Redirecting from home to accessible page: ${redirectRoute}`);
        return NextResponse.redirect(new URL(redirectRoute, request.url));
      } else {
        return NextResponse.redirect(new URL('/login', request.url));
      }
    }
  }

  return NextResponse.next();
}

// Configure which routes the middleware should run on
export const config = {
  matcher: [
    /*
     * Match all request paths except for the ones starting with:
     * - api/auth (auth endpoints)
     * - _next/static (static files)
     * - _next/image (image optimization files)
     * - favicon.ico (favicon file)
     * - public (public files)
     */
    '/((?!api/auth|_next/static|_next/image|favicon.ico|public).*)',
  ],
};