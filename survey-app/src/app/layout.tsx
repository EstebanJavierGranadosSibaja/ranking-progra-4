import './globals.css'
import type { Metadata } from 'next'
import { Inter } from 'next/font/google'
import { SurveyProvider } from '../contexts/SurveyContext'
import React from 'react';

const inter = Inter({ subsets: ['latin'] })

export const metadata: Metadata = {
  title: 'Survey System',
  description: 'An application to create and vote on surveys',
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en">
      <body className={inter.className}>
        <SurveyProvider>
          <div className="min-h-screen py-8">
            <header className="container mb-8">
              <div className="text-center">
                <h1 className="text-4xl font-bold text-primary mb-2">Survey System</h1>
                <p className="text-muted">Create and vote on surveys easily and quickly</p>
              </div>
            </header>
            <main className="container">
              {children}
            </main>
            <footer className="container mt-12 py-6 border-t border-border text-center text-muted">
              <p>© 2025 Survey System - All rights reserved</p>
            </footer>
          </div>
        </SurveyProvider>
      </body>
    </html>
  )
}