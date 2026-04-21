/// <reference types="vite/client" />

interface ImportMetaEnv {
  readonly VITE_API_URL?: string;
  readonly VITE_API_LOCAL_URL?: string;
  readonly VITE_API_PRODUCTION_URL?: string;
}

interface ImportMeta {
  readonly env: ImportMetaEnv;
}
