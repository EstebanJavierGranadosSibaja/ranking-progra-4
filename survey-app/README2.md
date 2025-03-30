# survey-app

Aquí tienes una guía detallada para inicializar tu proyecto, teniendo en cuenta los objetivos previos y el tipo de proyecto que vas a desarrollar (sistema dinámico de encuestas con ranking):

## Requisitos

Antes de comenzar, asegúrate de tener instaladas las siguientes herramientas:

- **Node.js** (si aún no lo tienes instalado, [descárgalo aquí](https://nodejs.org/)).
- **Git** (si aún no lo tienes instalado, [descárgalo aquí](https://git-scm.com/)).
- Una cuenta en [Vercel](https://vercel.com/) para el despliegue.
- Uso de vs-code (recomendado). Extenciones:  
  - Prettier - Code formatter
  - Code Spell Checker

Además, instala **pnpm** como tu gestor de paquetes preferido:

```bash
npm install -g pnpm
```

## Paso 1: Inicializar el Proyecto Next.js con TypeScript

### 1.1 Crear el Proyecto

### 1.2 Abre una terminal y navega a la carpeta donde quieras crear el proyecto

### 1.3 Ejecuta el siguiente comando para crear un proyecto de Next.js con soporte para TypeScript

  ```bash
  pnpm create next-app survey-app --typescript
  ```

Durante la configuración, selecciona las siguientes opciones recomendadas:  

**√ Would you like to use ESLint?**: Yes  
**√ Would you like to use Tailwind CSS?**: Yes  
**√ Would you like your code inside a `src/` directory?**: Yes  
**√ Would you like to use App Router? (recommended)**: Yes  
**√ Would you like to use Turbopack for `next dev`?**: Yes  
**x Would you like to customize the import alias (`@/*` by default)?**: No  

Esto generará un nuevo proyecto con la configuración básica de Next.js y TypeScript.

### 1.4 Una vez que el proyecto se haya creado, navega a la carpeta del proyecto. Abrir con VS code o IDE preferido

  ```bash
  cd survey-app
  ```

## Paso 2 Instalación de Dependencias

### 2.1 Instalar EsLint, Prettier, CSpell

Para agregar las herramientas necesarias para el formato y la validación del código, instala las siguientes dependencias:

```bash
pnpm add -D eslint prettier cspell
```

### 2.2 Configurar ESLint

  ```bash
  pnpm eslint --init
  ```

Elige las opciones que más se ajusten a tus necesidades. Aquí hay algunas recomendaciones para las preguntas de configuración

**How would you like to use ESLint?**: To check syntax, find problems, and enforce code style  
**What type of modules does your project use?**: JavaScript modules (import/export)  
**Which framework does your project use?**: React  
**Does your project use TypeScript?**: Yes  
**Where does your code run?**: Browser  
**What format do you want your config file to be in?**: JavaScript  
**√ Would you like to install them now?** · Yes  
**Which package manager do you want to use?** · pnpm  

### 2.3 Configurar Prettier

Crea un archivo de configuración de Prettier en la raíz de tu proyecto llamado `.prettierrc` con el siguiente contenido:  

  ```json
  {
    "semi": true,
    "singleQuote": true,
    "tabWidth": 2,
    "trailingComma": "all"
  }
  ```

### 2.4 Configurar Cspell

Crea un archivo de configuración para Cspell llamado `cspell.json` con el siguiente contenido  

  ```json
  {
    "$schema": "https://raw.githubusercontent.com/streetsidesoftware/cspell/main/cspell.schema.json",
    "version": "0.2",
    "dictionaryDefinitions": [
     {
      "name": "project-words",
      "path": "./project-words.txt",
      "addWords": true
     }
    ],
    "dictionaries": [
     "project-words"
    ],
    "ignorePaths": [
     "node_modules",
     "/project-words.txt"
    ]
  }
  ```

usar VS code para revision o Agrega un script en el archivo `package.json` para ejecutar Cspell fácilmente  

  ```json
  "scripts": {
    "spellcheck": "cspell '**/*'"
  }
  ```

se debe crear el hook app/hooks/useLocalStorage.ts

```TypeScript
"use client";

import { useState, useEffect } from 'react';

export function useLocalStorage<T>(key: string, initialValue: T): [T, (value: T | ((val: T) => T)) => void] {
  const [storedValue, setStoredValue] = useState<T>(initialValue);

  useEffect(() => {
    try {
      if (typeof window === 'undefined') return;
      const item = window.localStorage.getItem(key);
      if (item) {
        setStoredValue(JSON.parse(item));
      }
    } catch (error) {
      console.error("Error reading from localStorage:", error);
    }
  }, [key]);

  const setValue = (value: T | ((val: T) => T)) => {
    try {
      const valueToStore = value instanceof Function ? value(storedValue) : value;
      setStoredValue(valueToStore);
      if (typeof window !== 'undefined') {
        window.localStorage.setItem(key, JSON.stringify(valueToStore));
      }
    } catch (error) {
      console.error("Error saving to localStorage:", error);
    }
  };

  return [storedValue, setValue];
}

export default useLocalStorage;

```

../componets/SurveyForm.tsx

```TypeScript
"use client";

import React, { useState } from 'react';
import { useSurvey } from '../contexts/SurveyContext';

const SurveyForm: React.FC = () => {
  const { surveys, addVote, addSurvey, hasVoted, isLoading } = useSurvey();
  const [newTitle, setNewTitle] = useState('');
  const [newDescription, setNewDescription] = useState('');

  const handleSubmitNew = (e: React.FormEvent) => {
    e.preventDefault();
    if (newTitle.trim()) {
      addSurvey(newTitle, newDescription);
      setNewTitle('');
      setNewDescription('');
    }
  };

  if (isLoading) {
    return (
      <div className="p-4 space-y-6 card">
        <p className="text-muted">Loading surveys...</p>
      </div>
    );
  }

  return (
    <div className="p-4 space-y-6 card">
      <h2 className="text-xl font-semibold mb-4">Create New Survey</h2>
      <form onSubmit={handleSubmitNew} className="space-y-4">
        <div>
          <input
            type="text"
            value={newTitle}
            onChange={(e) => setNewTitle(e.target.value)}
            placeholder="New survey title"
            className="w-full p-2 border rounded focus:ring-2 focus:ring-primary focus:border-primary"
          />
          <textarea
            value={newDescription}
            onChange={(e) => setNewDescription(e.target.value)}
            placeholder="Description (optional)"
            className="w-full p-2 border rounded mt-2 focus:ring-2 focus:ring-primary focus:border-primary"
            rows={3}
          />
          <button 
            type="submit"
            className="mt-3 px-4 py-2 bg-primary text-white rounded hover:bg-primary-hover transition-colors"
          >
            Create Survey
          </button>
        </div>
      </form>

      <div className="space-y-3 mt-6">
        <h3 className="font-bold text-lg">Available Surveys</h3>
        {surveys.length === 0 ? (
          <p className="text-muted">No surveys available.</p>
        ) : (
          surveys.map(survey => {
            const alreadyVoted = hasVoted(survey.id);
            return (
              <div key={survey.id} className="p-4 border rounded bg-card hover:shadow-md transition-shadow">
                <div className="flex justify-between items-start">
                  <div>
                    <h4 className="font-medium text-card-foreground">{survey.title}</h4>
                    {survey.description && (
                      <p className="text-sm text-muted mt-1">{survey.description}</p>
                    )}
                  </div>
                  <button
                    onClick={() => addVote(survey.id)}
                    className={`px-3 py-1 rounded text-sm font-medium ${
                      alreadyVoted 
                        ? 'bg-muted text-card-foreground cursor-not-allowed' 
                        : 'bg-success text-white hover:bg-success/90'
                    }`}
                    disabled={alreadyVoted}
                  >
                    {alreadyVoted ? '✓ Voted' : 'Vote'}
                  </button>
                </div>
              </div>
            );
          })
        )}
      </div>
    </div>
  );
};

export default SurveyForm;

```

../componets/SurveyRanking.tsx

```TypeScript

  "use client";

import React, { useMemo } from 'react';
import { useSurvey } from '../contexts/SurveyContext';
import { withSurveyAnalytics } from './withSurveyAnalytics';

interface SurveyRankingProps {
  analytics?: {
    totalVotes: number;
    totalSurveys: number;
    averageVotesPerSurvey: number;
  };
}

const SurveyRanking: React.FC<SurveyRankingProps> = ({ analytics }) => {
  const { votes, surveys, hasVoted, isLoading } = useSurvey();

  const sortedSurveys = useMemo(() => {
    return surveys
      .sort((a, b) => (votes[b.id] || 0) - (votes[a.id] || 0))
      .map(survey => ({
        ...survey,
        voteCount: votes[survey.id] || 0,
        userVoted: hasVoted(survey.id)
      }));
  }, [surveys, votes, hasVoted]);

  if (isLoading) {
    return (
      <div className="p-5 bg-card rounded-lg shadow">
        <h2 className="text-2xl font-bold mb-4">Survey Ranking</h2>
        <p className="text-muted">Loading ranking...</p>
      </div>
    );
  }

  const maxVotes = sortedSurveys.length > 0 ? Math.max(...sortedSurveys.map(s => s.voteCount)) : 0;

  return (
    <div className="p-5 bg-card rounded-lg shadow">
      <h2 className="text-2xl font-bold mb-4">Survey Ranking</h2>
      {analytics && (
        <div className="mb-5 p-4 bg-background rounded-md border border-border">
          <div className="flex flex-wrap justify-between">
            <div className="mb-2 mr-4">
              <span className="text-muted text-sm">Total Votes</span>
              <p className="text-2xl font-bold text-primary">{analytics.totalVotes}</p>
            </div>
            <div className="mb-2 mr-4">
              <span className="text-muted text-sm">Surveys</span>
              <p className="text-2xl font-bold">{analytics.totalSurveys}</p>
            </div>
            <div className="mb-2">
              <span className="text-muted text-sm">Average Votes</span>
              <p className="text-2xl font-bold text-secondary">{analytics.averageVotesPerSurvey.toFixed(1)}</p>
            </div>
          </div>
        </div>
      )}
      
      {sortedSurveys.length === 0 ? (
        <p className="text-muted text-center py-6">No surveys available to display.</p>
      ) : (
        <ul className="space-y-3">
          {sortedSurveys.map(({ id, title, voteCount, userVoted }) => (
            <li key={id} className="p-3 border-b border-border hover:bg-background/50 transition-colors rounded-md">
              <div className="flex justify-between items-center mb-2">
                <span className="font-medium">{title}</span>
                <div className="flex items-center">
                  <span className="mr-2 font-bold text-foreground">{voteCount} {voteCount === 1 ? 'vote' : 'votes'}</span>
                  {userVoted && (
                    <span className="text-xs bg-accent/20 text-accent px-2 py-1 rounded-full">
                      Voted
                    </span>
                  )}
                </div>
              </div>
              <div className="progress-bar">
                <div 
                  className="progress-bar-fill" 
                  style={{ width: `${maxVotes ? (voteCount / maxVotes) * 100 : 0}%` }}
                />
              </div>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
};

export default withSurveyAnalytics(SurveyRanking);

```

```typescript
"use client";

import React, { createContext, useContext, useMemo, useCallback, useEffect, useState } from 'react';
import { useLocalStorage } from '../hooks/useLocalStorage';

interface Survey {
  id: string;
  title: string;
  description?: string;
  createdAt: string;
}

interface SurveyContextType {
  surveys: Survey[];
  addSurvey: (title: string, description?: string) => void;
  votes: Record<string, number>;
  addVote: (surveyId: string) => void;
  getTopSurveys: (limit?: number) => Survey[];
  getTotalVotes: () => number;
  userVotes: string[];
  hasVoted: (surveyId: string) => boolean;
  isLoading: boolean;
}

const SurveyContext = createContext<SurveyContextType | null>(null);

export const SurveyProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [surveys, setSurveys] = useLocalStorage<Survey[]>('surveys', []);
  const [votes, setVotes] = useLocalStorage<Record<string, number>>('votes', {});
  const [userVotes, setUserVotes] = useLocalStorage<string[]>('userVotes', []);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    setIsLoading(false);
  }, []);

  const hasVoted = useCallback((surveyId: string) => {
    return userVotes.includes(surveyId);
  }, [userVotes]);

  const addVote = useCallback((surveyId: string) => {
    if (!hasVoted(surveyId)) {
      setVotes(prev => ({
        ...prev,
        [surveyId]: (prev[surveyId] || 0) + 1,
      }));
      setUserVotes(prev => [...prev, surveyId]);
    }
  }, [setVotes, hasVoted, setUserVotes]);

  const addSurvey = useCallback((title: string, description?: string) => {
    setSurveys(prev => [
      ...prev,
      {
        id: Date.now().toString(),
        title,
        description,
        createdAt: new Date().toISOString(),
      }
    ]);
  }, [setSurveys]);

  const getTopSurveys = useCallback((limit?: number) => {
    return [...surveys]
      .sort((a, b) => (votes[b.id] || 0) - (votes[a.id] || 0))
      .slice(0, limit);
  }, [surveys, votes]);

  const getTotalVotes = useCallback(() => {
    return Object.values(votes).reduce((sum, count) => sum + count, 0);
  }, [votes]);

  const value = useMemo(() => ({
    surveys,
    addSurvey,
    votes,
    addVote,
    getTopSurveys,
    getTotalVotes,
    userVotes,
    hasVoted,
    isLoading
  }), [
    surveys, 
    addSurvey, 
    votes, 
    addVote, 
    getTopSurveys, 
    getTotalVotes, 
    userVotes, 
    hasVoted, 
    isLoading
  ]);

  return (
    <SurveyContext.Provider value={value}>
      {children}
    </SurveyContext.Provider>
  );
};

export const useSurvey = () => {
  const context = useContext(SurveyContext);
  if (!context) {
    throw new Error('useSurvey must be used within a SurveyProvider');
  }
  return context;
};

```

src/app/layout.tsx

```TypeScript
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
```

src/app/page.tsx

``` TypeScript
"use client";

import React from 'react';

import SurveyForm from '../components/SurveyForm';
import SurveyRanking from '../components/SurveyRanking';

export default function Home() {
  return (
    <main className="container mx-auto py-8 px-4">
      <h1 className="text-3xl font-bold mb-8 text-center">Survey System</h1>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        <div>
          <SurveyForm />
        </div>
        <div>
          <SurveyRanking />
        </div>
      </div>
    </main>
  );
}
```
