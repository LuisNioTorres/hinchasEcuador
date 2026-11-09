/** Rutas del recorrido de acceso. */
export const AUTH_ROUTES = {
  login: "/votar",
  checkEmail: "/votar/revisa-tu-correo",
  confirm: "/votar/confirmar",
  expiredLink: "/votar/enlace-vencido",
  name: "/votar/tu-nombre",
  loggedIn: "/cuenta",
  results: "/resultados",
  userInfo: "/user-info",
  callback: "/auth/callback",
} as const;

/** Igual que `otp_length` y `otp_expiry` de supabase/config.toml. */
export const OTP_LENGTH = 6;
export const OTP_EXPIRY_MINUTES = 60;

/** Espera mínima antes de reenviar el correo (evita abusos). */
export const RESEND_COOLDOWN_SECONDS = 60;
