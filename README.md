# survey-app

Aquí tienes una guía detallada para inicializar tu proyecto, teniendo en cuenta los objetivos previos y el tipo de proyecto que vas a desarrollar (sistema dinámico de encuestas con ranking):

# Guía para Inicializar el Proyecto

## Requisitos

Antes de comenzar, asegúrate de tener instaladas las siguientes herramientas:

- **Node.js** (si aún no lo tienes instalado, [descárgalo aquí](https://nodejs.org/)).
- **Git** (si aún no lo tienes instalado, [descárgalo aquí](https://git-scm.com/)).
- Una cuenta en [Vercel](https://vercel.com/) para el despliegue.

## Paso 1: Inicializar el Proyecto Next.js con TypeScript

### 1.1 Crear el Proyecto

1. Abre una terminal y navega a la carpeta donde quieras crear el proyecto.
2. Ejecuta el siguiente comando para crear un proyecto de Next.js con soporte para TypeScript:

  ```bash
  npx create-next-app@latest survey-app --typescript
  ```

  ```text
    √ Would you like to use ESLint? ... Yes
    √ Would you like to use Tailwind CSS? ... Yes
    √ Would you like your code inside a `src/` directory? ... Yes
    √ Would you like to use App Router? (recommended) ... Yes
    √ Would you like to use Turbopack for `next dev`? ... Yes
    X Would you like to customize the import alias (`@/*` by default)? ...  No
  ```

   Esto generará un nuevo proyecto con la configuración básica de Next.js y TypeScript.

3. Una vez que el proyecto se haya creado, navega a la carpeta del proyecto:

   ```bash
   cd survey-app
   ```

4. Abre el proyecto en tu editor de código favorito (por ejemplo, Visual Studio Code).

### 1.2 Instalación de Dependencias

Para agregar las herramientas necesarias para el formato y la validación del código, instala las siguientes dependencias:

```bash
npm install eslint prettier cspell --save-dev
```

También puedes instalar otros paquetes útiles si los necesitas en tu proyecto, como `axios` para hacer solicitudes HTTP si es necesario:

```bash
npm install axios
```

## Paso 2: Configurar las Herramientas de Calidad de Código

### 2.1 Configurar ESLint

1. Inicializa la configuración de ESLint:

   ```bash
   npx eslint --init
   ```

2. Elige las opciones que más se ajusten a tus necesidades. Aquí hay algunas recomendaciones para las preguntas de configuración:

   - **How would you like to use ESLint?**: To check syntax, find problems, and enforce code style
   - **What type of modules does your project use?**: JavaScript modules (import/export)
   - **Which framework does your project use?**: React
   - **Does your project use TypeScript?**: Yes
   - **Where does your code run?**: Browser
   - **What format do you want your config file to be in?**: JavaScript

3. Una vez configurado, ESLint te ayudará a mantener un estilo de código consistente y detectar problemas en el código.

### 2.2 Configurar Prettier

1. Crea un archivo de configuración de Prettier en la raíz de tu proyecto llamado `.prettierrc` con el siguiente contenido:

   ```json
   {
     "semi": true,
     "singleQuote": true,
     "tabWidth": 2,
     "trailingComma": "all"
   }
   ```

### 2.3 Configurar Cspell

1. Crea un archivo de configuración para Cspell llamado `cspell.json` con el siguiente contenido:

   ```json
   {
     "version": "0.2",
     "words": [
       "Next",
       "TypeScript",
       "React",
       "Vercel"
     ]
   }
   ```

## Paso 3: Implementar la Lógica del Proyecto

Ahora que tienes el entorno inicializado y configurado, puedes comenzar a implementar la lógica de tu sistema de encuestas.

### 3.1 Estructura del Proyecto

Primero, estructura las carpetas para organizar el código:

```bash
src/
  components/
    SurveyForm.tsx
    SurveyRanking.tsx
  contexts/
    SurveyContext.tsx
  hooks/
    useLocalStorage.ts
  pages/
    index.tsx
  utils/
    calculateRanking.ts
```

### 3.2 Implementar `useContext` para el Estado Global

Crea un archivo `SurveyContext.tsx` dentro de la carpeta `contexts` para gestionar el estado global de las encuestas y votos.

```tsx
// src/contexts/SurveyContext.tsx
import React, { createContext, useContext, useState } from 'react';

interface SurveyContextType {
  votes: { [key: string]: number };
  addVote: (surveyId: string) => void;
}

const SurveyContext = createContext<SurveyContextType | undefined>(undefined);

export const SurveyProvider: React.FC = ({ children }) => {
  const [votes, setVotes] = useState<{ [key: string]: number }>({});

  const addVote = (surveyId: string) => {
    setVotes((prevVotes) => ({
      ...prevVotes,
      [surveyId]: (prevVotes[surveyId] || 0) + 1,
    }));
  };

  return (
    <SurveyContext.Provider value={{ votes, addVote }}>
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

### 3.3 Implementar `useMemo` para Optimizar el Ranking

En el componente que maneja el ranking de las encuestas, utiliza `useMemo` para evitar cálculos innecesarios y hacer que el ranking se actualice solo cuando haya cambios en los votos.

```tsx
// src/components/SurveyRanking.tsx
import React, { useMemo } from 'react';
import { useSurvey } from '../contexts/SurveyContext';

const SurveyRanking: React.FC = () => {
  const { votes } = useSurvey();

  const sortedVotes = useMemo(() => {
    return Object.entries(votes)
      .sort(([, a], [, b]) => b - a)
      .map(([surveyId, voteCount]) => ({ surveyId, voteCount }));
  }, [votes]);

  return (
    <div>
      <h2>Ranking de Encuestas</h2>
      <ul>
        {sortedVotes.map(({ surveyId, voteCount }) => (
          <li key={surveyId}>
            Encuesta {surveyId}: {voteCount} votos
          </li>
        ))}
      </ul>
    </div>
  );
};

export default SurveyRanking;
```

### 3.4 Implementar `useLocalStorage` para Almacenar los Resultados

Crea un hook personalizado `useLocalStorage` para manejar el almacenamiento de votos y resultados en el localStorage.

```tsx
// src/hooks/useLocalStorage.ts
import { useState } from 'react';

function useLocalStorage<T>(key: string, initialValue: T) {
  const storedValue = typeof window !== 'undefined' ? localStorage.getItem(key) : null;
  const parsedValue = storedValue ? JSON.parse(storedValue) : initialValue;
  const [value, setValue] = useState<T>(parsedValue);

  const setStoredValue = (newValue: T) => {
    setValue(newValue);
    if (typeof window !== 'undefined') {
      localStorage.setItem(key, JSON.stringify(newValue));
    }
  };

  return [value, setStoredValue] as const;
}

export default useLocalStorage;
```

## Paso 4: Implementar el Componente de Encuesta

Crea el formulario para que los usuarios puedan votar en las encuestas. El componente `SurveyForm` usará `useContext` y `useLocalStorage`.

```tsx
// src/components/SurveyForm.tsx
import React, { useState } from 'react';
import { useSurvey } from '../contexts/SurveyContext';
import useLocalStorage from '../hooks/useLocalStorage';

const SurveyForm: React.FC = () => {
  const { addVote } = useSurvey();
  const [surveyId, setSurveyId] = useState<string>('');
  const [votes, setVotes] = useLocalStorage('votes', {});

  const handleVote = () => {
    addVote(surveyId);
    setVotes((prevVotes) => ({
      ...prevVotes,
      [surveyId]: (prevVotes[surveyId] || 0) + 1,
    }));
  };

  return (
    <div>
      <input
        type="text"
        value={surveyId}
        onChange={(e) => setSurveyId(e.target.value)}
        placeholder="ID de la encuesta"
      />
      <button onClick={handleVote}>Votar</button>
    </div>
  );
};

export default SurveyForm;
```

## Paso 5: Crear la Página de Inicio

En la página `index.tsx`, incluye los componentes `SurveyForm` y `SurveyRanking`, y utiliza el `SurveyProvider` para gestionar el estado global.

```tsx
// src/pages/index.tsx
import { SurveyProvider } from '../contexts/SurveyContext';
import SurveyForm from '../components/SurveyForm';
import SurveyRanking from '../components/SurveyRanking';

const Home: React.FC = () => {
  return (
    <SurveyProvider>
      <h1>Encuestas Dinámicas</h1>
      <SurveyForm />
      <SurveyRanking />
    </SurveyProvider>
  );
};

export default Home;
```

---

## Paso 6: Despliegue en Vercel

1. Inicia sesión en Vercel y conecta tu repositorio de GitHub o GitLab.
2. Despliega el proyecto siguiendo las instrucciones proporcionadas por Vercel.
3. Verifica que tu aplicación esté funcionando correctamente en producción.

---
