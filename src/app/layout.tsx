import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import Sidebar from "@/components/Sidebar";
import ThemeProvider from "@/contexts/ThemeContext";
import { AuthProvider } from "@/contexts/AuthContext";
import PerformanceMonitor from "@/components/PerformanceMonitor";
import ErrorBoundary from "@/components/ErrorBoundary";
import ServiceWorkerRegistration from "@/components/ServiceWorkerRegistration";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
  display: "swap", // Optimize font loading
  preload: true,
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
  display: "swap", // Optimize font loading
  preload: false, // Don't preload secondary font
});

export const metadata: Metadata = {
  title: "Harshana System - Professional Dashboard",
  description: "A professional user management and dashboard system built with Next.js",
  keywords: ["dashboard", "user management", "next.js", "react"],
  authors: [{ name: "Samitha" }],
  robots: "index, follow",
};

export const viewport = {
  width: 'device-width',
  initialScale: 1,
  maximumScale: 1,
  userScalable: false,
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <head>
        {/* Temporarily disabled until Vercel static file issue is resolved */}
        {/* <link rel="manifest" href="/manifest.json" /> */}
        <meta name="theme-color" content="#3b82f6" />
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
      </head>
      <body className={`${geistSans.variable} ${geistMono.variable}`}>
        <ErrorBoundary>
          <AuthProvider>
            <ThemeProvider>
              <Sidebar>
                {children}
              </Sidebar>
            </ThemeProvider>
          </AuthProvider>
        </ErrorBoundary>
        {/* <PerformanceMonitor /> */}
        <ServiceWorkerRegistration />
      </body>
    </html>
  );
}
