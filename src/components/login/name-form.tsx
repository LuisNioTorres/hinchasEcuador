"use client";

import { useId, useState, type FormEvent } from "react";
import { ArrowRight } from "lucide-react";
import {
  FIELD_LABEL,
  FieldError,
  PRIMARY_BUTTON,
  Spinner,
  textInputClass,
} from "@/components/login/auth-ui";
import { saveName } from "@/lib/auth/actions";
import { AUTH_ROUTES } from "@/lib/auth/routes";
import { flagAccountChanged } from "@/lib/auth/session-sync";

/** Igual que `profiles.nombre` y `profiles.apellido`. */
const MAX_LENGTH = 70;

type Field = "firstName" | "lastName";
type Errors = Partial<Record<Field, string>>;

const FIELDS: readonly {
  key: Field;
  label: string;
  autoComplete: string;
  placeholder: string;
  error: string;
}[] = [
  {
    key: "firstName",
    label: "Nombre",
    autoComplete: "given-name",
    placeholder: "Tu nombre",
    error: "Escribe tu nombre.",
  },
  {
    key: "lastName",
    label: "Apellido",
    autoComplete: "family-name",
    placeholder: "Tu apellido",
    error: "Escribe tu apellido.",
  },
];

/**
 * Nombre y apellido, para quien entra con correo (Google ya los da).
 */
export function NameForm({ userId }: { userId: string }) {
  const id = useId();
  const [values, setValues] = useState<Record<Field, string>>({
    firstName: "",
    lastName: "",
  });
  const [errors, setErrors] = useState<Errors>({});
  const [saving, setSaving] = useState(false);
  const [saveError, setSaveError] = useState(false);

  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const next: Errors = {};
    for (const field of FIELDS) {
      if (!values[field.key].trim()) next[field.key] = field.error;
    }
    setErrors(next);
    if (Object.keys(next).length > 0) return;
    setSaving(true);
    setSaveError(false);
    let result: Awaited<ReturnType<typeof saveName>>;
    try {
      result = await saveName(values.firstName, values.lastName, userId);
    } catch {
      result = { ok: false };
    }
    if (result.accountChanged) {
      // La sesión ya es de otra cuenta: se recarga para mostrarla, con un aviso.
      flagAccountChanged();
      window.location.reload();
      return;
    }
    if (!result.ok) {
      setSaveError(true);
      setSaving(false);
      return;
    }
    window.location.assign(AUTH_ROUTES.login);
  };

  return (
    <form noValidate onSubmit={handleSubmit} className="flex flex-col gap-4">
      {FIELDS.map((field) => {
        const inputId = `${id}-${field.key}`;
        const errorId = `${inputId}-error`;
        const error = errors[field.key];
        return (
          <div key={field.key} className="flex flex-col gap-2">
            <label htmlFor={inputId} className={FIELD_LABEL}>
              {field.label}
            </label>
            <input
              id={inputId}
              type="text"
              name={field.key}
              autoComplete={field.autoComplete}
              autoCapitalize="words"
              placeholder={field.placeholder}
              maxLength={MAX_LENGTH}
              value={values[field.key]}
              readOnly={saving}
              onChange={(event) => {
                setValues((v) => ({ ...v, [field.key]: event.target.value }));
                if (error) setErrors((e) => ({ ...e, [field.key]: undefined }));
              }}
              aria-invalid={Boolean(error)}
              aria-describedby={error ? errorId : undefined}
              className={textInputClass(Boolean(error))}
            />
            {error && <FieldError id={errorId}>{error}</FieldError>}
          </div>
        );
      })}
      {saveError && (
        <FieldError id={`${id}-save-error`}>
          No pudimos guardar tu nombre. Inténtalo de nuevo.
        </FieldError>
      )}
      <button
        type="submit"
        disabled={saving}
        className={`mt-2 ${PRIMARY_BUTTON}`}
      >
        {saving ? (
          <>
            <Spinner />
            Guardando…
          </>
        ) : (
          <>
            Continuar
            <ArrowRight
              aria-hidden="true"
              className="size-[1.125rem] transition-transform group-hover:translate-x-0.5 motion-reduce:transition-none"
            />
          </>
        )}
      </button>
    </form>
  );
}
