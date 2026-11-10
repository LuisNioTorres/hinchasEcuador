const EMAIL_KEY = "censo-acceso-correo";
const SENT_AT_KEY = "censo-acceso-enviado";

/**
 * Recuerda en esta pestaña el correo y la hora del envío, para mostrarlos en "Revisa
 * tu correo" aunque la página se recargue o se vuelva a ella con "atrás".
 */
export function rememberEmail(email: string) {
  try {
    sessionStorage.setItem(EMAIL_KEY, email);
    sessionStorage.setItem(SENT_AT_KEY, String(Date.now()));
  } catch {
    // Sin almacenamiento (modo privado estricto): la pantalla usa un texto genérico.
  }
}

/** Al reenviar el correo: el contador de "Reenviar" empieza de nuevo. */
export function rememberResend() {
  try {
    sessionStorage.setItem(SENT_AT_KEY, String(Date.now()));
  } catch {
    // Sin almacenamiento: el contador no se puede recordar.
  }
}

/** Hora del último envío (ms desde 1970), o `null` si no se guardó. */
export function recallSentAt(): number | null {
  try {
    const value = Number(sessionStorage.getItem(SENT_AT_KEY));
    return Number.isFinite(value) && value > 0 ? value : null;
  } catch {
    return null;
  }
}

/** Al cerrar sesión, para que el siguiente acceso empiece de cero. */
export function forgetEmail() {
  try {
    sessionStorage.removeItem(EMAIL_KEY);
    sessionStorage.removeItem(SENT_AT_KEY);
  } catch {
    // Sin almacenamiento: no había nada guardado.
  }
}

export function recallEmail(): string | null {
  try {
    return sessionStorage.getItem(EMAIL_KEY);
  } catch {
    return null;
  }
}
