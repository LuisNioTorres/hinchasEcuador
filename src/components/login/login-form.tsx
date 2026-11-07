"use client";

import { useId, useState, type FormEvent } from "react";
import { ArrowRight, Mail, ShieldCheck } from "lucide-react";
import { GoogleIcon } from "@/components/login/google-icon";

const EMAIL_PATTERN = /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/;

/**
 * Formulario de acceso: Google o enlace al correo, sin contraseñas
 * (docs/DATOS_INFORMATION.md, Módulo 3).
 *
 * SOLO DISEÑO: todavía no se conecta con Supabase Auth, porque la autenticación real
 * aún no está aprobada (CLAUDE.md). El correo se valida aquí solo para mostrar el
 * estado de error; la validación definitiva irá en el servidor.
 */
export function LoginForm() {
  const id = useId();
  const [email, setEmail] = useState("");
  const [error, setError] = useState<string | null>(null);

  const emailId = `${id}-email`;
  const errorId = `${id}-error`;
  const hintId = `${id}-hint`;

  const handleSubmit = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setError(
      EMAIL_PATTERN.test(email.trim()) ? null : "Ingresa un correo válido.",
    );
  };

  return (
    <div className="flex flex-col gap-5">
      <button
        type="button"
        className="flex h-12 w-full cursor-pointer items-center justify-center gap-3 rounded-xl border border-black/15 bg-white text-[0.9375rem] font-semibold text-black shadow-[0_1px_2px_rgba(0,0,0,0.05)] transition-colors hover:bg-[#f4f7fc] focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-results-blue"
      >
        <GoogleIcon className="size-5" />
        Continuar con Google
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
        {error && (
          <p id={errorId} role="alert" className="text-sm text-[#b42318]">
            {error}
          </p>
        )}
        <button
          type="submit"
          className="group mt-1 flex h-12 w-full cursor-pointer items-center justify-center gap-2 rounded-xl bg-brand-blue text-[0.9375rem] font-semibold text-white shadow-[0_0.5rem_1.25rem_rgba(21,78,142,0.28)] transition-[background-color,box-shadow] hover:bg-[#0f3f75] focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-results-blue"
        >
          Continuar con correo
          <ArrowRight
            aria-hidden="true"
            className="size-[1.125rem] transition-transform group-hover:translate-x-0.5 motion-reduce:transition-none"
          />
        </button>
      </form>

      <p
        id={hintId}
        className="flex items-start gap-2 rounded-xl bg-[#eef4fd] px-3.5 py-3 text-[0.8125rem] leading-snug text-black/70"
      >
        <ShieldCheck
          aria-hidden="true"
          className="mt-px size-4 shrink-0 text-results-blue"
        />
        Sin contraseñas: te enviaremos un enlace a tu correo para entrar.
      </p>
    </div>
  );
}
