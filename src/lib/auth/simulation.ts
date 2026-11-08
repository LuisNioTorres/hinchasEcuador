/**
 * SIMULACIÓN DEL ACCESO — solo para revisar el diseño.
 *
 * Todavía no hay autenticación real (CLAUDE.md exige aprobarla). Estas utilidades
 * simulan el caso perfecto: todo sale bien y el usuario llega a la página de
 * usuario logueado. Al conectar Supabase Auth se reemplazan por las llamadas
 * reales (signInWithOAuth, signInWithOtp y verifyOtp) y este archivo se elimina.
 */

/** Rutas del recorrido de acceso. */
export const AUTH_ROUTES = {
  login: "/votar",
  checkEmail: "/votar/revisa-tu-correo",
  confirm: "/votar/confirmar",
  expiredLink: "/votar/enlace-vencido",
  name: "/votar/tu-nombre",
  emailPreview: "/votar/vista-correo",
  loggedIn: "/cuenta",
} as const;

/** Igual que `otp_length` y `otp_expiry` de supabase/config.toml. */
export const OTP_LENGTH = 6;
export const OTP_EXPIRY_MINUTES = 60;

/** Espera mínima antes de reenviar el correo (evita abusos). */
export const RESEND_COOLDOWN_SECONDS = 60;

/** Retardo artificial para ver los estados de carga. */
export const SIMULATED_DELAY_MS = 900;

/** Código que muestra el correo de ejemplo. */
export const SAMPLE_CODE = "482910";

const EMAIL_KEY = "censo-acceso-correo";

/** Recuerda el correo en esta pestaña para mostrarlo en "Revisa tu correo". */
export function rememberEmail(email: string) {
  try {
    sessionStorage.setItem(EMAIL_KEY, email);
  } catch {
    // Sin almacenamiento (modo privado estricto): la pantalla usa un texto genérico.
  }
}

export function recallEmail(): string | null {
  try {
    return sessionStorage.getItem(EMAIL_KEY);
  } catch {
    return null;
  }
}

export const wait = (ms: number) =>
  new Promise<void>((done) => setTimeout(done, ms));
