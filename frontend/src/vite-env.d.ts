// src/vite-env.d.ts
/// <reference types="vite/client" />

interface ImportMetaEnv {
  readonly VITE_API_BASE_URL: string
  readonly VITE_API_TIMEOUT: string
  readonly VITE_AUTH_TOKEN_KEY: string
  readonly VITE_AUTH_REFRESH_KEY: string
  readonly REACT_APP_API_URL: string
  readonly REACT_APP_WS_URL: string
}

interface ImportMeta {
  readonly env: ImportMetaEnv
  readonly hot?: {
    accept: (cb?: () => void) => void
  }
}
