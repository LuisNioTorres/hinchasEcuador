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
