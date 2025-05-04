/// <reference types="vite/client" />

interface ImportMetaEnv {
    readonly VITE_SERVER_HOST?: string
    readonly VITE_SERVER_PING_INTERVAL?: string
    readonly VITE_APP_TITLE: string
}

interface ImportMeta {
    readonly env: ImportMetaEnv
}
