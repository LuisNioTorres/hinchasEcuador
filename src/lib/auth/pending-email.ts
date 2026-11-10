const EMAIL_KEY = "censo-acceso-correo";

/** Recuerda el correo en esta pestaña para mostrarlo en "Revisa tu correo". */
export function rememberEmail(email: string) {
  try {
    sessionStorage.setItem(EMAIL_KEY, email);
  } catch {
    // Sin almacenamiento (modo privado estricto): la pantalla usa un texto genérico.
  }
}

/** Al cerrar sesión, para que el siguiente acceso empiece de cero. */
export function forgetEmail() {
  try {
    sessionStorage.removeItem(EMAIL_KEY);
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
