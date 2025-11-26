/// <reference types="vite/client" />

interface ImportMetaEnv {
  readonly VITE_SHOW_DEBUG_TOOLS: string;
}

interface ImportMeta {
  readonly env: ImportMetaEnv;
}
