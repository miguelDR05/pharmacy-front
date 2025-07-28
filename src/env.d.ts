declare namespace NodeJS {
  interface ProcessEnv {
    NODE_ENV: string;
    VUE_ROUTER_MODE: 'hash' | 'history' | 'abstract' | undefined;
    VUE_ROUTER_BASE: string | undefined;
  }
  interface ImportMetaEnv {
    readonly VITE_API_BASE_URL: string;
    // Añade aquí cualquier otra variable de entorno que uses con el prefijo VITE_
    // readonly VITE_ALGUNA_OTRA_VARIABLE: string;
  }

  interface ImportMeta {
    readonly env: ImportMetaEnv;
  }
}
