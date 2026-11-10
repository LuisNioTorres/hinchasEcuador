/** Tiempo máximo para pedir un correo de acceso a Supabase. */
export const SEND_EMAIL_TIMEOUT_MS = 15_000;

/**
 * Espera la promesa, pero no más de `ms`. Devuelve `"timeout"` si no respondió a
 * tiempo, para que ningún botón se quede girando para siempre. La petición puede
 * terminar después: por eso el mensaje de error pide intentarlo de nuevo y no
 * asegura que no se envió nada.
 */
export async function withTimeout<T>(
  promise: Promise<T>,
  ms: number,
): Promise<T | "timeout"> {
  let timer: ReturnType<typeof setTimeout> | undefined;
  const timeout = new Promise<"timeout">((resolve) => {
    timer = setTimeout(() => resolve("timeout"), ms);
  });
  try {
    return await Promise.race([promise, timeout]);
  } finally {
    clearTimeout(timer);
  }
}
