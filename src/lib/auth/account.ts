/** Cuenta con la que se inició sesión, leída siempre en el servidor. */
export type SessionAccount = {
  userId: string;
  email: string;
  /** `null` mientras quien entró con correo no escribe su nombre. */
  fullName: string | null;
  provider: "google" | "email";
};

/** Estado de la sesión del navegador, consultado al servidor. */
export type SessionStatus =
  | { status: "signed-in"; userId: string }
  | { status: "signed-out" }
  /** No se pudo comprobar (sin internet o Supabase no responde): no se hace nada. */
  | { status: "unknown" };
