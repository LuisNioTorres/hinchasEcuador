import { MousePointerClick } from "lucide-react";
import { CAPTCHA_TEXT } from "@/lib/security/use-turnstile";

/**
 * Aviso que acompaña a la casilla de Cloudflare cuando la persona pulsó el botón y la
 * casilla la espera. La región `status` existe siempre (vacía si no hay aviso), para
 * que los lectores de pantalla anuncien el texto en cuanto aparece.
 */
export function CaptchaHint({ show }: { show: boolean }) {
  return (
    <p
      role="status"
      className={
        show
          ? "mt-3 flex items-start gap-2 text-sm font-semibold text-brand-blue"
          : undefined
      }
    >
      {show && (
        <>
          <MousePointerClick
            aria-hidden="true"
            className="mt-px size-4 shrink-0"
          />
          {CAPTCHA_TEXT.checkbox}
        </>
      )}
    </p>
  );
}
