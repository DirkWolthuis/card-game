/**
 * Get environment variable value that works in both Vite (browser) and Node.js (tests) environments.
 * 
 * For Vite/browser: Accesses import.meta.env (injected at build time) via define plugin
 * For Node.js/tests: Uses process.env
 */
export const getEnvVar = (name: string): string | undefined => {
  // Node.js environment (tests, server) - check this first
  if (typeof process !== 'undefined' && process.env) {
    return process.env[name];
  }
  
  // Browser environment with Vite
  // Vite will replace these via define plugin at build time
  // Use globalThis to avoid import.meta syntax errors in Jest
  const globalEnv = (globalThis as any).import_meta_env;
  if (globalEnv) {
    return globalEnv[name] as string | undefined;
  }
  
  return undefined;
};
