"use client";

import Link from "next/link";
import {
  useEffect,
  useId,
  useState,
  useSyncExternalStore,
  type FormEvent,
} from "react";
import { Inbox, MailCheck } from "lucide-react";
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
import { recallEmail } from "@/lib/auth/pending-email";
import {
  AUTH_ROUTES,
  OTP_EXPIRY_MINUTES,
  OTP_LENGTH,
  RESEND_COOLDOWN_SECONDS,
} from "@/lib/auth/routes";
import { goOnIfSignedIn, useSessionGuard } from "@/lib/auth/use-session-guard";
import { createClient } from "@/lib/supabase/client";

const noSubscribe = () => () => {};

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
  const [cooldown, setCooldown] = useState(RESEND_COOLDOWN_SECONDS);
  const [resent, setResent] = useState(false);
  useSessionGuard(null);

  const codeId = `${id}-code`;
  const errorId = `${id}-error`;

  useEffect(() => {
    if (cooldown === 0) return;
    const timer = setTimeout(() => setCooldown((s) => s - 1), 1000);
    return () => clearTimeout(timer);
  }, [cooldown]);

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
      setError("El código no es válido o ya venció.");
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
    setResent(false);
    if (await goOnIfSignedIn()) return;
    const { error: resendError } = await createClient().auth.signInWithOtp({
      email,
    });
    if (resendError) {
      setError("No pudimos reenviar el correo. Inténtalo más tarde.");
      return;
    }
    setResent(true);
    setCooldown(RESEND_COOLDOWN_SECONDS);
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
            type="button"
            onClick={handleResend}
            disabled={cooldown > 0}
            className={TEXT_LINK}
          >
            {cooldown > 0
              ? `Reenviar en ${formatSeconds(cooldown)}`
              : "Reenviar correo"}
          </button>
        </p>
        <Link href={AUTH_ROUTES.login} className={TEXT_LINK}>
          Usar otro correo
        </Link>
      </div>
      <p role="status" className="mt-2 text-sm text-[#1f7a3a] empty:hidden">
        {resent ? "Te enviamos un nuevo correo." : ""}
      </p>

      <div className="mt-5 flex flex-col gap-3">
        <AuthNote icon={<Inbox aria-hidden="true" />}>
          Si no lo ves, revisa tu carpeta de spam o correo no deseado. El enlace
          y el código vencen en {OTP_EXPIRY_MINUTES} minutos.
        </AuthNote>
      </div>
    </>
  );
}
