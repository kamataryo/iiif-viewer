/// <reference types="vite/client" />

interface ImportMetaEnv {
  readonly VITE_VALUE1: string
  readonly VITE_VALUE2: string
}

interface ImportMeta {
  readonly env: ImportMetaEnv
}
