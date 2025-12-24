/// <reference types="vite/client" />

interface ImportMetaEnv {
  readonly VITE_SHOW_DEBUG_TOOLS: string;
  readonly VITE_GAME_SEED?: string;
  readonly VITE_E2E_MODE?: string;
}

interface ImportMeta {
  readonly env: ImportMetaEnv;
}
