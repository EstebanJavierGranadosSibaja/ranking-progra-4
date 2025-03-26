import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import { SurveyProvider } from "../contexts/SurveyContext";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "Sistema de Encuestas con Ranking",
  description: "Sistema dinámico de encuestas donde los usuarios pueden votar y visualizar un ranking actualizado en tiempo real.",
  keywords: ["encuestas", "ranking", "votos", "tiempo real", "feedback"],
  authors: [{ name: "JuanCUNA" }],
  openGraph: {
    title: "Sistema de Encuestas con Ranking",
    description: "Sistema dinámico de encuestas donde los usuarios pueden votar y visualizar un ranking actualizado en tiempo real.",  
    type: "website",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="es">
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased bg-slate-50 min-h-screen`}
      >
        <SurveyProvider>
          {children}
        </SurveyProvider>
      </body>
    </html>
  );
}