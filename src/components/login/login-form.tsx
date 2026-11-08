"use client";

import { useId, useState, type FormEvent } from "react";
import { useRouter } from "next/navigation";
import { ArrowRight, Mail, ShieldCheck } from "lucide-react";
import { GoogleIcon } from "@/components/login/google-icon";
import {
  AuthNote,
  FieldError,
  PRIMARY_BUTTON,
  SECONDARY_BUTTON,
  Spinner,
} from "@/components/login/auth-ui";
import {
  AUTH_ROUTES,
  SIMULATED_DELAY_MS,
  rememberEmail,
  wait,
} from "@/lib/auth/simulation";

const EMAIL_PATTERN = /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/;

type Pending = "google" | "email" | null;

/**
 * Formulario de acceso: Google o correo con enlace y código, sin contraseñas
 * (docs/DATOS_INFORMATION.md, Módulo 3).
 *
 * SIMULACIÓN: todavía no se conecta con Supabase Auth, porque la autenticación real
 * aún no está aprobada (CLAUDE.md). Simula el caso perfecto:
 * - Google: entra directo a la página de usuario logueado (Google ya da el nombre).
 * - Correo: pasa a "Revisa tu correo".
 * El correo se valida aquí solo para mostrar el estado de error; la validación
 * definitiva irá en el servidor.
 */
export function LoginForm() {
  const id = useId();
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [pending, setPending] = useState<Pending>(null);

  const emailId = `${id}-email`;
  const errorId = `${id}-error`;
  const hintId = `${id}-hint`;

  const handleGoogle = async () => {
    setPending("google");
    await wait(SIMULATED_DELAY_MS);
    router.push(AUTH_ROUTES.loggedIn);
  };

  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const value = email.trim();
    if (!EMAIL_PATTERN.test(value)) {
      setError("Ingresa un correo válido.");
      return;
    }
    setPending("email");
    rememberEmail(value);
    await wait(SIMULATED_DELAY_MS);
    router.push(AUTH_ROUTES.checkEmail);
  };

  return (
    <div className="flex flex-col gap-5">
      <button
        type="button"
        onClick={handleGoogle}
        disabled={pending !== null}
        className={SECONDARY_BUTTON}
      >
        {pending === "google" ? <Spinner /> : <GoogleIcon className="size-5" />}
        {pending === "google"
          ? "Conectando con Google…"
          : "Continuar con Google"}
      </button>

      <div className="flex items-center gap-3 text-xs font-medium text-black/45">
        <span className="h-px flex-1 bg-black/10" />o
        <span className="h-px flex-1 bg-black/10" />
      </div>

      <form noValidate onSubmit={handleSubmit} className="flex flex-col gap-3">
        <label
          htmlFor={emailId}
          className="text-sm font-semibold text-black/80"
        >
          Correo electrónico
        </label>
        <div className="relative">
          <Mail
            aria-hidden="true"
            className="pointer-events-none absolute top-1/2 left-4 size-[1.125rem] -translate-y-1/2 text-black/35"
          />
          <input
            id={emailId}
            type="email"
            name="email"
            inputMode="email"
            autoComplete="email"
            placeholder="tucorreo@ejemplo.com"
            value={email}
            readOnly={pending !== null}
            onChange={(event) => {
              setEmail(event.target.value);
              if (error) setError(null);
            }}
            aria-invalid={error !== null}
            aria-describedby={error ? `${errorId} ${hintId}` : hintId}
            className={`h-12 w-full rounded-xl border bg-white pr-4 pl-11 text-[0.9375rem] text-black transition-[border-color,box-shadow] outline-none placeholder:text-black/35 focus:ring-4 ${
              error
                ? "border-[#d92d20] focus:ring-[#d92d20]/15"
                : "border-black/15 focus:border-results-blue focus:ring-results-blue/15"
            }`}
          />
        </div>
        {error && <FieldError id={errorId}>{error}</FieldError>}
        <button
          type="submit"
          disabled={pending !== null}
          className={`mt-1 ${PRIMARY_BUTTON}`}
        >
          {pending === "email" ? (
            <>
              <Spinner />
              Enviando…
            </>
          ) : (
            <>
              Continuar con correo
              <ArrowRight
                aria-hidden="true"
                className="size-[1.125rem] transition-transform group-hover:translate-x-0.5 motion-reduce:transition-none"
              />
            </>
          )}
        </button>
      </form>

      <AuthNote id={hintId} icon={<ShieldCheck aria-hidden="true" />}>
        Sin contraseñas: te enviaremos un enlace y un código a tu correo para
        entrar.
      </AuthNote>
    </div>
  );
}
