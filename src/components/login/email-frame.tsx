"use client";

import { useEffect, useRef, useSyncExternalStore } from "react";
import { recallEmail } from "@/lib/auth/simulation";

const noSubscribe = () => () => {};

/** Correo que escribió el usuario en el login, o uno de ejemplo. */
export function RememberedEmail() {
  const email = useSyncExternalStore(noSubscribe, recallEmail, () => null);
  return <>{email ?? "tucorreo@ejemplo.com"}</>;
}

/** Muestra el HTML del correo aislado de los estilos de la página. */
export function EmailFrame({ html }: { html: string }) {
  const ref = useRef<HTMLIFrameElement>(null);

  const fitHeight = () => {
    const frame = ref.current;
    const body = frame?.contentDocument?.body;
    if (frame && body) frame.style.height = `${body.scrollHeight}px`;
  };

  // El marco puede terminar de cargar antes de la hidratación; también se ajusta
  // al cambiar el ancho de la ventana.
  useEffect(() => {
    fitHeight();
    window.addEventListener("resize", fitHeight);
    return () => window.removeEventListener("resize", fitHeight);
  }, []);

  return (
    <iframe
      ref={ref}
      title="Correo de acceso"
      srcDoc={html}
      onLoad={fitHeight}
      className="block h-[40rem] w-full border-0"
    />
  );
}
