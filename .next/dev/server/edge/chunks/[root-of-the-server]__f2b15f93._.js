(globalThis.TURBOPACK || (globalThis.TURBOPACK = [])).push(["chunks/[root-of-the-server]__f2b15f93._.js",
"[externals]/node:buffer [external] (node:buffer, cjs)", ((__turbopack_context__, module, exports) => {

const mod = __turbopack_context__.x("node:buffer", () => require("node:buffer"));

module.exports = mod;
}),
"[externals]/node:async_hooks [external] (node:async_hooks, cjs)", ((__turbopack_context__, module, exports) => {

const mod = __turbopack_context__.x("node:async_hooks", () => require("node:async_hooks"));

module.exports = mod;
}),
"[project]/middleware.ts [middleware-edge] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "config",
    ()=>config,
    "middleware",
    ()=>middleware
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$esm$2f$api$2f$server$2e$js__$5b$middleware$2d$edge$5d$__$28$ecmascript$29$__$3c$locals$3e$__ = __turbopack_context__.i("[project]/node_modules/next/dist/esm/api/server.js [middleware-edge] (ecmascript) <locals>");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$esm$2f$server$2f$web$2f$exports$2f$index$2e$js__$5b$middleware$2d$edge$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/next/dist/esm/server/web/exports/index.js [middleware-edge] (ecmascript)");
;
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
const publicRoutes = [
    '/login',
    '/api/auth/login',
    '/api/auth/logout'
];
function middleware(request) {
    const { pathname } = request.nextUrl;
    // Allow public routes
    if (publicRoutes.some((route)=>pathname.startsWith(route))) {
        return __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$esm$2f$server$2f$web$2f$exports$2f$index$2e$js__$5b$middleware$2d$edge$5d$__$28$ecmascript$29$__["NextResponse"].next();
    }
    // Allow API routes (except auth which is handled above)
    if (pathname.startsWith('/api/')) {
        return __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$esm$2f$server$2f$web$2f$exports$2f$index$2e$js__$5b$middleware$2d$edge$5d$__$28$ecmascript$29$__["NextResponse"].next();
    }
    // Allow static files and Next.js internals
    if (pathname.startsWith('/_next/') || pathname.startsWith('/favicon.ico') || pathname.includes('.')) {
        return __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$esm$2f$server$2f$web$2f$exports$2f$index$2e$js__$5b$middleware$2d$edge$5d$__$28$ecmascript$29$__["NextResponse"].next();
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
    const requiredPermission = protectedRoutes[pathname];
    if (requiredPermission) {
        // Route requires authentication
        if (!userData) {
            console.log(`Middleware: Redirecting to login from ${pathname} - No user data`);
            return __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$esm$2f$server$2f$web$2f$exports$2f$index$2e$js__$5b$middleware$2d$edge$5d$__$28$ecmascript$29$__["NextResponse"].redirect(new URL('/login', request.url));
        }
        // Check if user has required permission
        if (!userData.accessPages || !userData.accessPages.includes(requiredPermission)) {
            console.log(`Middleware: Access denied to ${pathname} for user ${userData.username} - Missing permission: ${requiredPermission}`);
            // Find first accessible page for redirect
            if (userData.accessPages && userData.accessPages.length > 0) {
                const pageRoutes = {
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
                };
                const firstAccessiblePage = userData.accessPages[0];
                const redirectRoute = pageRoutes[firstAccessiblePage] || '/';
                console.log(`Middleware: Redirecting to accessible page: ${redirectRoute}`);
                return __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$esm$2f$server$2f$web$2f$exports$2f$index$2e$js__$5b$middleware$2d$edge$5d$__$28$ecmascript$29$__["NextResponse"].redirect(new URL(redirectRoute, request.url));
            } else {
                // No accessible pages, redirect to login
                console.log(`Middleware: No accessible pages, redirecting to login`);
                return __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$esm$2f$server$2f$web$2f$exports$2f$index$2e$js__$5b$middleware$2d$edge$5d$__$28$ecmascript$29$__["NextResponse"].redirect(new URL('/login', request.url));
            }
        }
    }
    // For home page ('/'), check if user is authenticated
    if (pathname === '/') {
        if (!userData) {
            console.log(`Middleware: Redirecting to login from home - No authentication`);
            return __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$esm$2f$server$2f$web$2f$exports$2f$index$2e$js__$5b$middleware$2d$edge$5d$__$28$ecmascript$29$__["NextResponse"].redirect(new URL('/login', request.url));
        }
        // Check if user has access to home page
        if (!userData.accessPages || !userData.accessPages.includes('home')) {
            // Redirect to first accessible page
            if (userData.accessPages && userData.accessPages.length > 0) {
                const pageRoutes = {
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
                return __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$esm$2f$server$2f$web$2f$exports$2f$index$2e$js__$5b$middleware$2d$edge$5d$__$28$ecmascript$29$__["NextResponse"].redirect(new URL(redirectRoute, request.url));
            } else {
                return __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$esm$2f$server$2f$web$2f$exports$2f$index$2e$js__$5b$middleware$2d$edge$5d$__$28$ecmascript$29$__["NextResponse"].redirect(new URL('/login', request.url));
            }
        }
    }
    return __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$esm$2f$server$2f$web$2f$exports$2f$index$2e$js__$5b$middleware$2d$edge$5d$__$28$ecmascript$29$__["NextResponse"].next();
}
const config = {
    matcher: [
        /*
     * Match all request paths except for the ones starting with:
     * - api/auth (auth endpoints)
     * - _next/static (static files)
     * - _next/image (image optimization files)
     * - favicon.ico (favicon file)
     * - public (public files)
     */ '/((?!api/auth|_next/static|_next/image|favicon.ico|public).*)'
    ]
};
}),
]);

//# sourceMappingURL=%5Broot-of-the-server%5D__f2b15f93._.js.map