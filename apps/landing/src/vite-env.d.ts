/// <reference types="vite/client" />

interface ImportMetaEnv {
  readonly VITE_PATIENT_APP_URL?: string;
  readonly VITE_CLINIC_APP_URL?: string;
}

interface ImportMeta {
  readonly env: ImportMetaEnv;
}
