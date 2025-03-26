"use client";

import { useState, useEffect, useRef } from 'react';

export function useLocalStorage<T>(key: string, initialValue: T): [T, (value: T | ((val: T) => T)) => void] {
  // Usar useRef para guardar el initialValue original y evitar re-evaluaciones
  const initialValueRef = useRef(initialValue);
  
  // State para almacenar nuestro valor
  const [storedValue, setStoredValue] = useState<T>(initialValue);
  
  // Inicializar el estado solo en el cliente después del montaje
  // y solo una vez durante el ciclo de vida del componente
  useEffect(() => {
    try {
      // Verificar si estamos en el cliente
      if (typeof window === 'undefined') return;
      
      // Obtener del local storage por clave
      const item = window.localStorage.getItem(key);
      // Analizar el JSON almacenado o si no hay ninguno, devolver el valor inicial
      if (item) {
        setStoredValue(JSON.parse(item));
      }
    } catch (error) {
      console.error("Error reading from localStorage:", error);
    }
  }, [key]); // Solo depende de key, no de initialValue

  // Función para actualizar el valor en localStorage
  const setValue = (value: T | ((val: T) => T)) => {
    try {
      // Permitir que el valor sea una función para tener la misma API que useState
      const valueToStore =
        value instanceof Function ? value(storedValue) : value;
      
      // Guardar estado
      setStoredValue(valueToStore);
      
      // Guardar en local storage
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