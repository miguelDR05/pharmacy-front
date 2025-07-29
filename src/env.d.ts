// src/env.d.ts o src/vite-env.d.ts

/// <reference types="vite/client" />

// Opcional: Si usas variables de entorno de Node.js (ej. en scripts de construcción),
// puedes mantener esto, pero no es para import.meta.env
declare namespace NodeJS {
  interface ProcessEnv {
    NODE_ENV: string;
    VUE_ROUTER_MODE: 'hash' | 'history' | 'abstract' | undefined;
    VUE_ROUTER_BASE: string | undefined;
  }
}

// Estas interfaces son para import.meta.env y deben estar a nivel global
// (o en un módulo, pero no dentro de NodeJS namespace para este propósito).
interface ImportMetaEnv {
  readonly VITE_API_BASE_URL: string;
  // Añade aquí cualquier otra variable de entorno que uses con el prefijo VITE_
  // readonly VITE_FRONTEND_URL: string; // Si también la usas en el frontend
  // readonly VITE_ALGUNA_OTRA_VARIABLE: string;
}

interface ImportMeta {
  readonly env: ImportMetaEnv;
}
