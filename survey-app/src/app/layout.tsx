import './globals.css'
import type { Metadata } from 'next'
import { Inter } from 'next/font/google'
import { SurveyProvider } from '../contexts/SurveyContext'

const inter = Inter({ subsets: ['latin'] })

export const metadata: Metadata = {
  title: 'Sistema de Encuestas',
  description: 'Una aplicación para crear y votar en encuestas',
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="es">
      <body className={inter.className}>
        <SurveyProvider>
          <div className="min-h-screen py-8">
            <header className="container mb-8">
              <div className="text-center">
                <h1 className="text-4xl font-bold text-primary mb-2">Sistema de Encuestas</h1>
                <p className="text-muted">Crea y vota en encuestas de manera fácil y rápida</p>
              </div>
            </header>
            <main className="container">
              {children}
            </main>
            <footer className="container mt-12 py-6 border-t border-border text-center text-muted">
              <p>© 2025 Sistema de Encuestas - Todos los derechos reservados</p>
            </footer>
          </div>
        </SurveyProvider>
      </body>
    </html>
  )
}