"use client";

import Link from "next/link";
import {
  useId,
  useRef,
  useState,
  useSyncExternalStore,
  type FormEvent,
} from "react";
import { Inbox, MailCheck, RotateCcw } from "lucide-react";
import { AuthPanelHeader } from "@/components/login/auth-shell";
import {
  AuthNote,
  FIELD_LABEL,
  FieldError,
  PRIMARY_BUTTON,
  Spinner,
  TEXT_LINK,
} from "@/components/login/auth-ui";
import { CodeInput } from "@/components/login/code-input";
import {
  recallEmail,
  recallSentAt,
  rememberResend,
} from "@/lib/auth/pending-email";
import {
  AUTH_ROUTES,
  OTP_EXPIRY_MINUTES,
  OTP_LENGTH,
  RESEND_COOLDOWN_SECONDS,
} from "@/lib/auth/routes";
import { goOnIfSignedIn, useSessionGuard } from "@/lib/auth/use-session-guard";
import { SEND_EMAIL_TIMEOUT_MS, withTimeout } from "@/lib/auth/with-timeout";
import { CaptchaHint } from "@/components/security/captcha-hint";
import { CAPTCHA_TEXT, useTurnstile } from "@/lib/security/use-turnstile";
import { createClient } from "@/lib/supabase/client";

const noSubscribe = () => () => {};

/** Reloj de un tic por segundo. En el servidor no hay hora: devuelve `null`. */
const subscribeClock = (onTick: () => void) => {
  const timer = window.setInterval(onTick, 1000);
  return () => window.clearInterval(timer);
};
const readClock = () => Math.floor(Date.now() / 1000);
const noClock = () => null;

/**
 * Segundos que faltan para poder reenviar, contados desde la hora guardada del último
 * envío: así el contador sigue donde iba aunque la página se recargue.
 */
function useResendCooldown(): number {
  const sentAt = useSyncExternalStore(noSubscribe, recallSentAt, () => null);
  const now = useSyncExternalStore(subscribeClock, readClock, noClock);
  // En el servidor, el contador completo, como antes. En el navegador sin hora
  // guardada (sin almacenamiento) no se bloquea el botón.
  if (now === null) return RESEND_COOLDOWN_SECONDS;
  if (sentAt === null) return 0;
  const elapsed = now - Math.floor(sentAt / 1000);
  return Math.min(
    RESEND_COOLDOWN_SECONDS,
    Math.max(0, RESEND_COOLDOWN_SECONDS - elapsed),
  );
}

const formatSeconds = (seconds: number) =>
  `${Math.floor(seconds / 60)}:${String(seconds % 60).padStart(2, "0")}`;

/**
 * "Revisa tu correo": el usuario pulsa el enlace del correo o escribe aquí el código.
 */
export function CheckEmailPanel() {
  const id = useId();
  const email = useSyncExternalStore(noSubscribe, recallEmail, () => null);
  const [code, setCode] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [verifying, setVerifying] = useState(false);
  const cooldown = useResendCooldown();
  const [resent, setResent] = useState(false);
  useSessionGuard(null);
  const [resending, setResending] = useState(false);
  const resendRef = useRef<HTMLButtonElement>(null);
  /** Evita reenvíos duplicados mientras hay uno en curso. */
  const resendBusyRef = useRef(false);
  const {
    containerRef: turnstileRef,
    check: checkCaptcha,
    awaiting: captchaAwaiting,
    visible: captchaVisible,
  } = useTurnstile({
    onDemand: true,
    // Al marcar la casilla, el reenvío sigue solo.
    onResume: () => resendRef.current?.click(),
  });

  const codeId = `${id}-code`;
  const errorId = `${id}-error`;

  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    if (code.length !== OTP_LENGTH) {
      setError(`Ingresa los ${OTP_LENGTH} dígitos del código.`);
      return;
    }
    if (!email) {
      setError("Vuelve al inicio y pide un correo nuevo.");
      return;
    }
    setVerifying(true);
    if (await goOnIfSignedIn()) return;
    const { error: verifyError } = await createClient().auth.verifyOtp({
      email,
      token: code,
      type: "email",
    });
    if (verifyError) {
      setError(
        "El código no es válido o ya venció. Si pediste más de un correo, usa el código del más reciente.",
      );
      setVerifying(false);
      return;
    }
    window.location.assign(AUTH_ROUTES.login);
  };

  const handleResend = async () => {
    if (!email) {
      setError("Vuelve al inicio y pide un correo nuevo.");
      return;
    }
    if (resendBusyRef.current) return;
    resendBusyRef.current = true;
    const stop = (message: string | null) => {
      if (message) setError(message);
      setResending(false);
      resendBusyRef.current = false;
    };
    setResent(false);
    setError(null);
    setResending(true);
    if (await goOnIfSignedIn()) return;
    const captcha = await checkCaptcha();
    if (!captcha.ok) {
      stop(captcha.reason === "checkbox" ? null : CAPTCHA_TEXT[captcha.reason]);
      return;
    }
    const result = await withTimeout(
      createClient().auth.signInWithOtp({
        email,
        options: { captchaToken: captcha.token },
      }),
      SEND_EMAIL_TIMEOUT_MS,
    );
    if (result !== "timeout" && result.error?.code === "captcha_failed") {
      stop(CAPTCHA_TEXT.robot);
      return;
    }
    if (result === "timeout" || result.error) {
      stop("No pudimos reenviar el correo. Inténtalo más tarde.");
      return;
    }
    rememberResend();
    stop(null);
    setResent(true);
  };

  return (
    <>
      <AuthPanelHeader
        icon={<MailCheck aria-hidden="true" className="size-7 wide:size-6" />}
        title="Revisa tu correo"
      >
        <p>
          Te enviamos un enlace y un código a{" "}
          {email ? (
            <strong className="font-semibold [overflow-wrap:anywhere] text-black">
              {email}
            </strong>
          ) : (
            "tu correo"
          )}
          . Pulsa el enlace o escribe aquí el código.
        </p>
      </AuthPanelHeader>

      <form
        noValidate
        onSubmit={handleSubmit}
        className="mt-7 flex flex-col gap-3 wide:mt-5"
      >
        <label htmlFor={codeId} className={FIELD_LABEL}>
          Código de {OTP_LENGTH} dígitos
        </label>
        <CodeInput
          id={codeId}
          value={code}
          disabled={verifying}
          invalid={error !== null}
          describedBy={error ? errorId : undefined}
          onChange={(value) => {
            setCode(value);
            if (error) setError(null);
          }}
        />
        {error && <FieldError id={errorId}>{error}</FieldError>}
        <button
          type="submit"
          disabled={verifying}
          className={`mt-1 ${PRIMARY_BUTTON}`}
        >
          {verifying && <Spinner />}
          {verifying ? "Verificando…" : "Verificar código"}
        </button>
      </form>

      <div className="mt-5 flex flex-wrap items-center justify-between gap-x-4 gap-y-2 text-sm">
        <p className="text-black/60">
          ¿No te llegó?{" "}
          <button
            ref={resendRef}
            type="button"
            onClick={handleResend}
            disabled={cooldown > 0 || resending}
            className={TEXT_LINK}
          >
            {cooldown > 0
              ? `Reenviar en ${formatSeconds(cooldown)}`
              : resending
                ? "Reenviando…"
                : "Reenviar correo"}
          </button>
        </p>
        <Link href={AUTH_ROUTES.login} className={TEXT_LINK}>
          Usar otro correo
        </Link>
      </div>
      <CaptchaHint show={captchaAwaiting} />
      {/* Solo se ve si Cloudflare pide marcar la casilla al reenviar. */}
      <div ref={turnstileRef} className={captchaVisible ? "mt-3" : undefined} />
      <p role="status" className="mt-2 text-sm text-[#1f7a3a] empty:hidden">
        {resent ? "Te enviamos un nuevo correo." : ""}
      </p>

      <div className="mt-5 flex flex-col gap-3">
        <AuthNote icon={<Inbox aria-hidden="true" />}>
          Si no lo ves, revisa tu carpeta de spam o correo no deseado. El enlace
          y el código vencen en {OTP_EXPIRY_MINUTES} minutos.
        </AuthNote>
        <AuthNote icon={<RotateCcw aria-hidden="true" />}>
          Si pides otro correo, usa siempre el más reciente: los anteriores
          dejan de funcionar.
        </AuthNote>
      </div>
    </>
  );
}
