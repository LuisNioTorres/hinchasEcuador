"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import {
  useEffect,
  useId,
  useRef,
  useState,
  type FormEvent,
  type ReactNode,
} from "react";
import { ArrowLeft, Lock, LogOut, Pencil } from "lucide-react";
import {
  FIELD_LABEL,
  FieldError,
  PRIMARY_BUTTON,
  SECONDARY_BUTTON,
  Spinner,
  textInputClass,
} from "@/components/login/auth-ui";
import { ClubBadge } from "@/components/vote/club-badge";
import { VoteBackdrop } from "@/components/vote/vote-backdrop";
import {
  clearSimulatedSession,
  saveEditedName,
  useEditedName,
  type ProfileName,
} from "@/lib/auth/simulated-profile";
import { AUTH_ROUTES, SIMULATED_DELAY_MS, wait } from "@/lib/auth/simulation";
import type { Club } from "@/mocks/catalogs";

/** Juntos caben en `profiles.nombre_completo` (VARCHAR 150). */
const MAX_LENGTH = 70;

/** Quien vive en el exterior solo tiene continente. */
export type FanLocation =
  | { kind: "nacional"; province: string; country: string }
  | { kind: "internacional"; continent: string };

type Field = keyof ProfileName;
type Errors = Partial<Record<Field, string>>;

const NAME_FIELDS: readonly {
  key: Field;
  label: string;
  autoComplete: string;
  error: string;
}[] = [
  {
    key: "firstName",
    label: "Nombre",
    autoComplete: "given-name",
    error: "Escribe tu nombre.",
  },
  {
    key: "lastName",
    label: "Apellido",
    autoComplete: "family-name",
    error: "Escribe tu apellido.",
  },
];

function Item({
  label,
  locked = false,
  className = "",
  children,
}: {
  label: string;
  locked?: boolean;
  className?: string;
  children: ReactNode;
}) {
  return (
    <div className={`min-w-0 ${className}`}>
      <dt className="flex items-center gap-1.5 text-xs font-semibold tracking-wider text-black/45 uppercase">
        {label}
        {locked && <Lock aria-hidden="true" className="size-3" />}
      </dt>
      <dd className="mt-1 text-base font-semibold break-words text-black wide:text-[0.9375rem]">
        {children}
      </dd>
    </div>
  );
}

/**
 * Información del usuario. Nombre y apellido son lo único editable: el ID DEL HINCHA
 * y el voto no cambian nunca (docs/DATOS_INFORMATION.md, Módulo 3).
 *
 * SIMULACIÓN: el nombre se recuerda solo en esta pestaña y "Cerrar sesión" no cierra
 * una sesión real, porque la autenticación aún no está conectada.
 */
export function UserInfoScreen({
  initialName,
  fanNumber,
  location,
  club,
}: {
  initialName: ProfileName;
  fanNumber: number;
  location: FanLocation;
  club: Club;
}) {
  const id = useId();
  const router = useRouter();
  const name = useEditedName() ?? initialName;
  const [draft, setDraft] = useState<ProfileName | null>(null);
  const [errors, setErrors] = useState<Errors>({});
  const [busy, setBusy] = useState<"saving" | "leaving" | null>(null);

  // Al salir del modo edición, el foco vuelve al botón que lo abrió.
  const editButton = useRef<HTMLButtonElement>(null);
  const wasEditing = useRef(false);
  const editing = draft !== null;
  useEffect(() => {
    if (wasEditing.current && !editing) editButton.current?.focus();
    wasEditing.current = editing;
  }, [editing]);

  const handleSave = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    if (!draft) return;
    const clean: ProfileName = {
      firstName: draft.firstName.trim().replace(/\s+/g, " "),
      lastName: draft.lastName.trim().replace(/\s+/g, " "),
    };
    const next: Errors = {};
    for (const field of NAME_FIELDS) {
      if (!clean[field.key]) next[field.key] = field.error;
    }
    setErrors(next);
    if (Object.keys(next).length > 0) return;
    setBusy("saving");
    await wait(SIMULATED_DELAY_MS);
    saveEditedName(clean);
    setBusy(null);
    setDraft(null);
  };

  const handleSignOut = async () => {
    setBusy("leaving");
    await wait(SIMULATED_DELAY_MS);
    clearSimulatedSession();
    router.replace(AUTH_ROUTES.login);
  };

  return (
    <main className="relative isolate flex min-h-[calc(100svh-var(--header-h))] flex-col items-center justify-center-safe px-(--page-x) py-6 font-montserrat text-black tablet:py-10 wide:py-4 lg:py-8">
      <VoteBackdrop />

      <div className="w-full max-w-[36rem]">
        <Link
          href="/resultados"
          className="mb-3 inline-flex h-10 items-center gap-1.5 rounded-full border border-black/10 bg-white/80 px-4 text-sm font-semibold text-black/80 backdrop-blur transition-colors hover:bg-white focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-results-blue"
        >
          <ArrowLeft aria-hidden="true" className="size-4" />
          Volver a resultados
        </Link>

        <section className="rounded-[1.75rem] bg-white p-6 shadow-[0_1.75rem_3.5rem_rgba(29,58,115,0.2)] ring-1 ring-black/5 tablet:p-8 wide:p-5">
          <h1 className="font-tiro text-[2rem] leading-tight text-[#0b1f3f] italic tablet:text-[2.5rem] wide:text-[1.75rem]">
            Mi información
          </h1>

          {draft ? (
            <form noValidate onSubmit={handleSave} className="mt-5 wide:mt-3">
              <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                {NAME_FIELDS.map((field, index) => {
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
                        autoFocus={index === 0}
                        maxLength={MAX_LENGTH}
                        value={draft[field.key]}
                        readOnly={busy === "saving"}
                        onChange={(event) => {
                          const { value } = event.target;
                          setDraft((d) => d && { ...d, [field.key]: value });
                          if (error)
                            setErrors((e) => ({
                              ...e,
                              [field.key]: undefined,
                            }));
                        }}
                        aria-invalid={Boolean(error)}
                        aria-describedby={error ? errorId : undefined}
                        className={textInputClass(Boolean(error))}
                      />
                      {error && <FieldError id={errorId}>{error}</FieldError>}
                    </div>
                  );
                })}
              </div>
              <div className="mt-4 grid grid-cols-2 gap-3">
                <button
                  type="button"
                  disabled={busy === "saving"}
                  onClick={() => {
                    setDraft(null);
                    setErrors({});
                  }}
                  className={SECONDARY_BUTTON}
                >
                  Cancelar
                </button>
                <button
                  type="submit"
                  disabled={busy === "saving"}
                  className={PRIMARY_BUTTON}
                >
                  {busy === "saving" ? (
                    <>
                      <Spinner />
                      Guardando…
                    </>
                  ) : (
                    "Guardar"
                  )}
                </button>
              </div>
            </form>
          ) : (
            <div className="mt-5 flex items-start gap-3 wide:mt-3">
              <dl className="grid min-w-0 flex-1 grid-cols-1 gap-4 sm:grid-cols-2">
                <Item label="Nombre">{name.firstName}</Item>
                <Item label="Apellido">{name.lastName}</Item>
              </dl>
              <button
                ref={editButton}
                type="button"
                onClick={() => setDraft(name)}
                className="flex h-10 shrink-0 cursor-pointer items-center gap-1.5 rounded-full bg-[#eef4fd] px-4 text-sm font-semibold text-results-blue transition-colors hover:bg-[#e0ebfb] focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-results-blue"
              >
                <Pencil aria-hidden="true" className="size-3.5" />
                Editar
              </button>
            </div>
          )}

          <dl className="mt-5 grid grid-cols-2 gap-x-4 gap-y-4 border-t border-black/10 pt-5 wide:mt-3 wide:grid-cols-3 wide:gap-y-3 wide:pt-3">
            <Item
              label="ID DEL HINCHA"
              locked
              className="col-span-2 wide:col-span-3"
            >
              <span className="flex flex-wrap items-baseline gap-x-3">
                <span className="text-2xl leading-tight font-bold text-brand-blue tabular-nums wide:text-xl">
                  {fanNumber}
                </span>
                <span className="text-sm font-medium text-black/60">
                  Tú fuiste el voto número {fanNumber}
                </span>
              </span>
            </Item>
            {location.kind === "nacional" ? (
              <>
                <Item label="Provincia">{location.province}</Item>
                <Item label="País">{location.country}</Item>
              </>
            ) : (
              <Item label="Continente" className="col-span-2">
                {location.continent}
              </Item>
            )}
            <Item label="Equipo" locked className="col-span-2 wide:col-span-1">
              <span className="flex items-center gap-2.5">
                <ClubBadge club={club} className="size-9 wide:size-7" />
                <span className="min-w-0">{club.name}</span>
              </span>
            </Item>
          </dl>

          <button
            type="button"
            onClick={handleSignOut}
            disabled={busy !== null}
            className={`mt-6 wide:mt-4 ${SECONDARY_BUTTON}`}
          >
            {busy === "leaving" ? (
              <>
                <Spinner />
                Cerrando sesión…
              </>
            ) : (
              <>
                <LogOut aria-hidden="true" className="size-[1.125rem]" />
                Cerrar sesión
              </>
            )}
          </button>
        </section>
      </div>
    </main>
  );
}
