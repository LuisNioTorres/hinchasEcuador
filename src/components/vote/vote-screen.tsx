"use client";

import Image from "next/image";
import Link from "next/link";
import {
  useId,
  useMemo,
  useRef,
  useState,
  type FormEvent,
  type ReactNode,
} from "react";
import {
  ArrowLeft,
  Check,
  CircleCheckBig,
  Globe2,
  Lock,
  MapPin,
  Vote,
} from "lucide-react";
import { ownerAssets } from "@/config/owner-assets";
import { AuthPanelHeader } from "@/components/login/auth-shell";
import {
  AuthNote,
  FieldError,
  PRIMARY_BUTTON,
  Spinner,
} from "@/components/login/auth-ui";
import { ClubBadge } from "@/components/vote/club-badge";
import { Combobox, type ComboboxOption } from "@/components/vote/combobox";
import { FanCard, type Scope } from "@/components/vote/fan-card";
import { VoteBackdrop } from "@/components/vote/vote-backdrop";
import { AccountFrame } from "@/components/layout/account-bar";
import type { SessionAccount } from "@/lib/auth/account";
import { flagAccountChanged } from "@/lib/auth/session-sync";
import { AUTH_ROUTES } from "@/lib/auth/routes";
import { registerVote } from "@/lib/vote/actions";
import { CaptchaHint } from "@/components/security/captcha-hint";
import { CAPTCHA_TEXT, useTurnstile } from "@/lib/security/use-turnstile";
import { CANTONS, CLUBS, CONTINENTS, PROVINCES } from "@/mocks/catalogs";

const byName = <T extends { name: string }>(a: T, b: T) =>
  a.name.localeCompare(b.name, "es");

const PROVINCE_OPTIONS: ComboboxOption[] = [...PROVINCES]
  .sort(byName)
  .map((p) => ({ id: p.id, label: p.name }));

const CLUB_OPTIONS: ComboboxOption[] = [...CLUBS].sort(byName).map((club) => ({
  id: club.id,
  label: club.name,
  hint: club.officialName,
  leading: <ClubBadge club={club} className="size-7" />,
}));

type Field = "province" | "canton" | "continent" | "club";
type Errors = Partial<Record<Field, string>>;

/** Pantalla dividida (lg+ y tablet en horizontal): tarjeta a la izquierda, formulario a la derecha. */
const SPLIT =
  "lg:grid lg:grid-cols-[minmax(0,0.95fr)_minmax(0,1.05fr)] tablet:landscape:grid tablet:landscape:grid-cols-[minmax(0,0.95fr)_minmax(0,1.05fr)]";
/** Solo en pantalla dividida. */
const SPLIT_ONLY = "hidden lg:block tablet:landscape:block";
/** Solo en una columna (teléfono, tablet en vertical, teléfono girado). */
const STACK_ONLY = "lg:hidden tablet:landscape:hidden";

/**
 * Formulario de voto: ubicación (Nacional: provincia y cantón; Internacional:
 * continente) y equipo. docs/DATOS_INFORMATION.md, Módulos 3 y 4.
 *
 * El voto se registra en el servidor, que valida la sesión y los datos; la validación
 * de aquí solo guía al usuario.
 *
 * - lg+ y tablet en horizontal: la tarjeta del hincha queda fija a la izquierda y se
 *   llena en vivo mientras se completa el formulario de la derecha.
 * - teléfono, tablet en vertical y teléfono girado: una columna. La tarjeta aparece
 *   al final, como repaso justo antes de enviar.
 */
export function VoteScreen({
  account,
  popularClubIds,
}: {
  account: SessionAccount;
  popularClubIds: readonly string[];
}) {
  const id = useId();
  const popularClubs = useMemo(
    () =>
      CLUBS.filter((c) => popularClubIds.includes(c.id)).sort(
        (a, b) => popularClubIds.indexOf(a.id) - popularClubIds.indexOf(b.id),
      ),
    [popularClubIds],
  );
  const [scope, setScope] = useState<Scope>("nacional");
  const [provinceId, setProvinceId] = useState<string | null>(null);
  const [cantonId, setCantonId] = useState<string | null>(null);
  const [continentId, setContinentId] = useState<string | null>(null);
  const [clubId, setClubId] = useState<string | null>(null);
  const [errors, setErrors] = useState<Errors>({});
  const [status, setStatus] = useState<"editing" | "sending" | "sent">(
    "editing",
  );
  const [sendError, setSendError] = useState<string | null>(null);
  const formRef = useRef<HTMLFormElement>(null);
  /** Evita votos duplicados mientras hay un envío en curso. */
  const busyRef = useRef(false);
  const {
    containerRef: turnstileRef,
    check: checkCaptcha,
    awaiting: captchaAwaiting,
    visible: captchaVisible,
  } = useTurnstile({
    // Al marcar la casilla, el voto se envía solo con lo elegido en ese momento.
    onResume: () => formRef.current?.requestSubmit(),
  });

  const ids = {
    province: `${id}-provincia`,
    canton: `${id}-canton`,
    continent: `${id}-continente`,
    club: `${id}-equipo`,
    clubSearch: `${id}-buscar-equipo`,
  };

  const cantonOptions = useMemo<ComboboxOption[]>(
    () =>
      CANTONS.filter((c) => c.provinceId === provinceId)
        .sort(byName)
        .map((c) => ({ id: c.id, label: c.name })),
    [provinceId],
  );

  const province = PROVINCES.find((p) => p.id === provinceId) ?? null;
  const canton = CANTONS.find((c) => c.id === cantonId) ?? null;
  const continent = CONTINENTS.find((c) => c.id === continentId) ?? null;
  const club = CLUBS.find((c) => c.id === clubId) ?? null;

  const locationLabel =
    scope === "nacional"
      ? province &&
        (canton ? `${canton.name}, ${province.name}` : province.name)
      : (continent?.name ?? null);

  const clearError = (field: Field) =>
    errors[field] && setErrors((e) => ({ ...e, [field]: undefined }));

  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const next: Errors = {};
    if (scope === "nacional") {
      if (!provinceId) next.province = "Elige tu provincia.";
      if (!cantonId) next.canton = "Elige tu cantón.";
    } else if (!continentId) {
      next.continent = "Elige tu continente.";
    }
    if (!clubId) next.club = "Elige tu equipo.";
    setErrors(next);

    const first = (Object.keys(next) as Field[])[0];
    if (first) {
      const target =
        first === "continent" || first === "club"
          ? document.querySelector<HTMLInputElement>(
              `#${CSS.escape(ids[first])} input`,
            )
          : document.getElementById(ids[first]);
      target?.focus();
      return;
    }
    if (busyRef.current) return;
    busyRef.current = true;
    setStatus("sending");
    setSendError(null);
    const captcha = await checkCaptcha();
    if (!captcha.ok) {
      // Si la casilla espera, el botón vuelve a la normalidad y se muestra el aviso.
      if (captcha.reason !== "checkbox") {
        setSendError(CAPTCHA_TEXT[captcha.reason]);
      }
      setStatus("editing");
      busyRef.current = false;
      return;
    }
    const captchaToken = captcha.token;
    let result;
    try {
      result = await registerVote(
        { scope, provinceId, cantonId, continentId, clubId },
        account.userId,
        captchaToken,
      );
    } catch {
      result = "error" as const;
    }
    if (result === "cuenta-cambio") {
      // La sesión ya es de otra cuenta: se recarga para mostrarla, con un aviso.
      flagAccountChanged();
      window.location.reload();
      return;
    }
    if (result === "ya-voto" || result === "sin-sesion") {
      window.location.assign(
        result === "ya-voto" ? AUTH_ROUTES.results : AUTH_ROUTES.login,
      );
      return;
    }
    if (result !== "ok") {
      setSendError(
        result === "robot"
          ? CAPTCHA_TEXT.robot
          : "No pudimos registrar tu voto. Inténtalo de nuevo.",
      );
      setStatus("editing");
      busyRef.current = false;
      return;
    }
    setStatus("sent");
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const card = (
    <FanCard
      scope={scope}
      club={club}
      provinceId={scope === "nacional" ? provinceId : null}
      locationLabel={locationLabel}
    />
  );

  return (
    <AccountFrame account={account}>
      <main
        className={`relative isolate flex min-h-below-bar flex-col bg-bone font-montserrat text-black tablet:pb-16 tablet:landscape:pb-0 ${SPLIT}`}
      >
        <Link
          href="/"
          className="absolute top-[max(1rem,env(safe-area-inset-top))] right-(--page-x) z-30 flex h-10 items-center gap-1.5 rounded-full border border-black/10 bg-white/80 px-4 text-sm font-semibold text-black/80 backdrop-blur transition-colors hover:bg-white focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-results-blue max-[21.25rem]:px-3 lg:top-8 lg:right-10"
        >
          <ArrowLeft aria-hidden="true" className="size-4" />
          <span className="max-[21.25rem]:sr-only">Volver al inicio</span>
        </Link>

        {/* Saludo (y, en pantalla dividida, la tarjeta fija). */}
        <aside className="relative isolate flex flex-col px-(--page-x) pt-[max(1rem,env(safe-area-inset-top))] pb-16 tablet:static tablet:mx-auto tablet:w-[min(100%-5rem,34rem)] tablet:px-0 tablet:pt-6 tablet:pb-0 tablet:landscape:sticky tablet:landscape:top-(--account-bar-h) tablet:landscape:mx-0 tablet:landscape:h-below-bar tablet:landscape:w-auto tablet:landscape:justify-center-safe tablet:landscape:px-[5vw] tablet:landscape:py-16 wide:pb-12 lg:sticky lg:top-(--account-bar-h) lg:h-below-bar lg:justify-center-safe lg:px-[5.5vw] lg:py-16">
          <VoteBackdrop />

          <Link
            href="/"
            aria-label="Ir a la página principal"
            className="w-fit rounded-lg focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-results-blue"
          >
            <Image
              src={ownerAssets.companyIcon.src}
              alt={ownerAssets.companyIcon.alt}
              width={ownerAssets.companyIcon.width}
              height={ownerAssets.companyIcon.height}
              preload
              className="h-[4.75rem] w-auto tablet:h-[5.25rem] tablet:landscape:h-[4.5rem] wide:h-12 lg:h-[clamp(4.25rem,4.75vw,6.25rem)]"
            />
          </Link>

          <div className="mt-8 tablet:mt-10 wide:mt-5 lg:mt-10">
            <h1 className="font-tiro text-[clamp(2.25rem,11vw,3rem)] leading-[1.05] text-[#0b1f3f] italic tablet:text-[clamp(2.75rem,6.5vw,3.5rem)] tablet:landscape:text-[clamp(2.25rem,4.4vw,3rem)] wide:text-[clamp(1.75rem,4.6vw,2.25rem)] lg:text-[clamp(2.75rem,3.6vw,4.5rem)]">
              {status === "sent" ? "¡GRACIAS, CRACK!" : "YA CASI, CRACK"}
            </h1>
            <p className="mt-4 max-w-[30rem] text-[0.8125rem] leading-relaxed font-semibold tracking-wide text-[#0b1f3f]/75 uppercase tablet:text-sm wide:mt-2 wide:text-xs lg:mt-5 lg:text-[clamp(0.8125rem,0.95vw,1rem)]">
              {status === "sent"
                ? "Ya eres parte del censo."
                : "Cuéntanos dónde vives y cuál es tu equipo para completar tu voto."}
            </p>
          </div>

          <div
            className={`mt-10 w-full max-w-[25rem] lg:mt-[clamp(2rem,5svh,3.5rem)] ${SPLIT_ONLY}`}
          >
            {card}
          </div>
        </aside>

        <section className="relative z-10 -mt-8 flex-1 rounded-t-[1.75rem] bg-white px-(--page-x) pt-8 pb-[max(2.5rem,env(safe-area-inset-bottom))] shadow-[0_-0.75rem_2rem_rgba(29,58,115,0.1)] tablet:mx-auto tablet:mt-8 tablet:w-[min(100%-5rem,34rem)] tablet:flex-none tablet:rounded-3xl tablet:p-10 tablet:shadow-[0_1.5rem_3rem_rgba(29,58,115,0.16)] tablet:landscape:m-0 tablet:landscape:w-auto tablet:landscape:rounded-none tablet:landscape:px-[5vw] tablet:landscape:py-24 tablet:landscape:shadow-none wide:mt-0 wide:rounded-t-3xl lg:m-0 lg:flex lg:items-center lg:rounded-none lg:px-[6vw] lg:py-28 lg:shadow-none">
          <div className="mx-auto w-full max-w-[30rem]">
            {status === "sent" ? (
              <Success card={card} />
            ) : (
              <form ref={formRef} noValidate onSubmit={handleSubmit}>
                <AuthPanelHeader title="Registra tu voto">
                  <p>Solo te tomará un minuto.</p>
                </AuthPanelHeader>

                {/* 1. Ubicación */}
                <fieldset className="mt-8">
                  <Legend step={1}>¿Dónde vives?</Legend>
                  <div className="mt-4 grid grid-cols-2 gap-3 max-[21.25rem]:grid-cols-1">
                    <ScopeOption
                      name={`${id}-ambito`}
                      checked={scope === "nacional"}
                      onSelect={() => setScope("nacional")}
                      icon={<MapPin aria-hidden="true" />}
                      title="Nacional"
                      subtitle="Vivo en Ecuador"
                    />
                    <ScopeOption
                      name={`${id}-ambito`}
                      checked={scope === "internacional"}
                      onSelect={() => setScope("internacional")}
                      icon={<Globe2 aria-hidden="true" />}
                      title="Internacional"
                      subtitle="Vivo fuera de Ecuador"
                    />
                  </div>

                  {scope === "nacional" ? (
                    <div className="mt-5 flex flex-col gap-4">
                      <Combobox
                        id={ids.province}
                        label="Provincia"
                        placeholder="Busca tu provincia"
                        emptyText="No encontramos esa provincia."
                        options={PROVINCE_OPTIONS}
                        value={provinceId}
                        error={errors.province}
                        onChange={(next) => {
                          if (next !== provinceId) setCantonId(null);
                          setProvinceId(next);
                          clearError("province");
                        }}
                      />
                      <Combobox
                        id={ids.canton}
                        label="Cantón"
                        placeholder="Busca tu cantón"
                        disabledPlaceholder="Primero elige tu provincia"
                        emptyText="No encontramos ese cantón en esta provincia."
                        options={cantonOptions}
                        value={cantonId}
                        disabled={!provinceId}
                        error={errors.canton}
                        onChange={(next) => {
                          setCantonId(next);
                          clearError("canton");
                        }}
                      />
                    </div>
                  ) : (
                    <fieldset
                      id={ids.continent}
                      aria-describedby={
                        errors.continent ? `${ids.continent}-error` : undefined
                      }
                      className="mt-5"
                    >
                      <legend className="text-sm font-semibold text-black/80">
                        Continente
                      </legend>
                      <div className="mt-2 grid grid-cols-2 gap-2 sm:grid-cols-3 max-[21.25rem]:grid-cols-1">
                        {CONTINENTS.map((c) => (
                          <ChoiceCard
                            key={c.id}
                            name={`${id}-continente-opcion`}
                            checked={continentId === c.id}
                            onSelect={() => {
                              setContinentId(c.id);
                              clearError("continent");
                            }}
                          >
                            <span className="text-sm font-semibold">
                              {c.name}
                            </span>
                          </ChoiceCard>
                        ))}
                      </div>
                      {errors.continent && (
                        <div className="mt-2">
                          <FieldError id={`${ids.continent}-error`}>
                            {errors.continent}
                          </FieldError>
                        </div>
                      )}
                    </fieldset>
                  )}
                </fieldset>

                {/* 2. Equipo */}
                <fieldset
                  id={ids.club}
                  aria-describedby={
                    errors.club ? `${ids.club}-error` : undefined
                  }
                  className="mt-10"
                >
                  <Legend step={2}>Tu equipo</Legend>
                  <p className="mt-4 text-sm font-semibold text-black/80">
                    Los más elegidos
                  </p>
                  <div className="mt-2 grid grid-cols-2 gap-2 max-[21.25rem]:grid-cols-1">
                    {popularClubs.map((c) => (
                      <ChoiceCard
                        key={c.id}
                        name={`${id}-equipo-opcion`}
                        checked={clubId === c.id}
                        onSelect={() => {
                          setClubId(c.id);
                          clearError("club");
                        }}
                      >
                        <ClubBadge club={c} className="size-8" />
                        <span className="min-w-0 pr-3 text-[0.75rem] leading-tight font-semibold sm:text-[0.8125rem]">
                          {c.name}
                        </span>
                      </ChoiceCard>
                    ))}
                  </div>
                  <div className="mt-4">
                    <Combobox
                      id={ids.clubSearch}
                      label="¿No está tu equipo? Búscalo"
                      placeholder="Escribe el nombre de tu equipo"
                      emptyText="No encontramos ese equipo."
                      options={CLUB_OPTIONS}
                      value={clubId}
                      onChange={(next) => {
                        setClubId(next);
                        clearError("club");
                      }}
                    />
                  </div>
                  {errors.club && (
                    <div className="mt-2">
                      <FieldError id={`${ids.club}-error`}>
                        {errors.club}
                      </FieldError>
                    </div>
                  )}
                </fieldset>

                {/* Repaso y envío */}
                <div className={`mt-10 ${STACK_ONLY}`}>
                  <p className="mb-4 text-sm font-semibold text-black/80">
                    Así quedará tu voto
                  </p>
                  {card}
                </div>

                <div className="mt-8 flex flex-col gap-4">
                  <AuthNote icon={<Lock aria-hidden="true" />}>
                    Tu voto es único y definitivo: una vez enviado, no podrás
                    cambiarlo.
                  </AuthNote>
                  {sendError && (
                    <FieldError id={`${id}-envio-error`}>
                      {sendError}
                    </FieldError>
                  )}
                  {/* Sin separación propia: la casilla solo ocupa espacio cuando aparece. */}
                  <div className="flex flex-col">
                    <button
                      type="submit"
                      disabled={status === "sending"}
                      className={PRIMARY_BUTTON}
                    >
                      {status === "sending" ? (
                        <>
                          <Spinner />
                          Enviando voto…
                        </>
                      ) : (
                        <>
                          <Vote
                            aria-hidden="true"
                            className="size-[1.125rem]"
                          />
                          Enviar voto
                        </>
                      )}
                    </button>
                    <CaptchaHint show={captchaAwaiting} />
                    {/* Solo se ve si Cloudflare pide marcar la casilla. */}
                    <div
                      ref={turnstileRef}
                      className={captchaVisible ? "mt-4" : undefined}
                    />
                  </div>
                </div>
              </form>
            )}
          </div>
        </section>
      </main>
    </AccountFrame>
  );
}

function Legend({ step, children }: { step: number; children: ReactNode }) {
  return (
    <legend className="flex items-center gap-3 text-lg font-bold tracking-tight">
      <span
        aria-hidden="true"
        className="flex size-7 items-center justify-center rounded-full bg-brand-blue text-sm text-white"
      >
        {step}
      </span>
      {children}
    </legend>
  );
}

/** Opción seleccionable con un radio nativo (teclado y lectores de pantalla). */
function ChoiceCard({
  name,
  checked,
  onSelect,
  children,
}: {
  name: string;
  checked: boolean;
  onSelect: () => void;
  children: ReactNode;
}) {
  return (
    <label
      className={`relative flex min-h-12 cursor-pointer items-center gap-2.5 rounded-xl border bg-white px-3 py-2 transition-[border-color,background-color,box-shadow] has-[:focus-visible]:outline-2 has-[:focus-visible]:outline-offset-2 has-[:focus-visible]:outline-results-blue ${
        checked
          ? "border-results-blue bg-[#eef4fd] shadow-[0_0_0_1px_var(--color-results-blue)]"
          : "border-black/12 hover:border-black/25 hover:bg-[#f7f9fd]"
      }`}
    >
      <input
        type="radio"
        name={name}
        checked={checked}
        onChange={onSelect}
        className="sr-only"
      />
      {children}
      {checked && (
        <span
          aria-hidden="true"
          className="absolute top-1.5 right-1.5 flex size-4 items-center justify-center rounded-full bg-results-blue text-white"
        >
          <Check className="size-3" strokeWidth={3} />
        </span>
      )}
    </label>
  );
}

function ScopeOption({
  name,
  checked,
  onSelect,
  icon,
  title,
  subtitle,
}: {
  name: string;
  checked: boolean;
  onSelect: () => void;
  icon: ReactNode;
  title: string;
  subtitle: string;
}) {
  return (
    <label
      className={`flex cursor-pointer flex-col gap-3 rounded-2xl border p-4 transition-[border-color,background-color,box-shadow] has-[:focus-visible]:outline-2 has-[:focus-visible]:outline-offset-2 has-[:focus-visible]:outline-results-blue ${
        checked
          ? "border-results-blue bg-[#eef4fd] shadow-[0_0_0_1px_var(--color-results-blue)]"
          : "border-black/12 bg-white hover:border-black/25 hover:bg-[#f7f9fd]"
      }`}
    >
      <input
        type="radio"
        name={name}
        checked={checked}
        onChange={onSelect}
        className="sr-only"
      />
      <span
        className={`flex size-10 items-center justify-center rounded-xl [&>svg]:size-5 ${
          checked
            ? "bg-brand-blue text-white"
            : "bg-[#eef4fd] text-results-blue"
        }`}
      >
        {icon}
      </span>
      <span>
        <span className="block text-[0.9375rem] font-bold">{title}</span>
        <span className="block text-[0.8125rem] text-black/55">{subtitle}</span>
      </span>
    </label>
  );
}

function Success({ card }: { card: ReactNode }) {
  return (
    <div role="status">
      <AuthPanelHeader
        icon={<CircleCheckBig aria-hidden="true" className="size-7" />}
        title="¡Tu voto quedó registrado!"
      >
        <p>Gracias por ser parte del Censo Único del Ecuador.</p>
      </AuthPanelHeader>
      <div className={`mt-14 ${STACK_ONLY}`}>{card}</div>
      <Link
        href={AUTH_ROUTES.results}
        prefetch={false}
        className={`mt-8 ${PRIMARY_BUTTON}`}
      >
        Ver resultados
      </Link>
    </div>
  );
}
