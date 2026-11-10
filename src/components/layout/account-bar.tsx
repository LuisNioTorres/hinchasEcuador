"use client";

import {
  useEffect,
  useId,
  useRef,
  useState,
  useSyncExternalStore,
  type ReactNode,
} from "react";
import { ChevronDown, LogOut, Mail, TriangleAlert, X } from "lucide-react";
import {
  FieldError,
  SECONDARY_BUTTON,
  Spinner,
} from "@/components/login/auth-ui";
import { GoogleIcon } from "@/components/login/google-icon";
import type { SessionAccount } from "@/lib/auth/account";
import { forgetEmail } from "@/lib/auth/pending-email";
import { AUTH_ROUTES } from "@/lib/auth/routes";
import { requestSignOut } from "@/lib/auth/session-client";
import {
  accountChangedOnLoad,
  broadcastSession,
} from "@/lib/auth/session-sync";
import { useSessionGuard } from "@/lib/auth/use-session-guard";

const noSubscribe = () => () => {};

/**
 * Franja fija arriba de las pantallas previas al voto (tu nombre y formulario de
 * voto): dice con qué cuenta se está votando y permite cerrar sesión.
 *
 * Además vigila que la cuenta siga siendo la misma. Todas las pestañas del navegador
 * comparten una sesión: si en otra se cierra sesión, esta vuelve al registro; si se
 * entra con otra cuenta, esta se recarga y avisa. El servidor igual rechaza el voto
 * si la cuenta no coincide (src/lib/vote/actions.ts).
 */
export function AccountFrame({
  account,
  children,
}: {
  account: SessionAccount;
  children: ReactNode;
}) {
  useSessionGuard(account.userId);

  return (
    <div className="[--account-bar-h:calc(2.75rem+env(safe-area-inset-top,0px))] wide:[--account-bar-h:2.375rem]">
      <div className="sticky top-0 z-40 font-montserrat text-black">
        <AccountBar account={account} />
        <AccountChangedNotice />
      </div>
      {children}
    </div>
  );
}

function AccountBar({ account }: { account: SessionAccount }) {
  const panelId = useId();
  const rootRef = useRef<HTMLDivElement>(null);
  const buttonRef = useRef<HTMLButtonElement>(null);
  const [open, setOpen] = useState(false);
  const [leaving, setLeaving] = useState(false);
  const [signOutError, setSignOutError] = useState(false);

  useEffect(() => {
    if (!open) return;
    const onPointerDown = (event: PointerEvent) => {
      if (!rootRef.current?.contains(event.target as Node)) setOpen(false);
    };
    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key !== "Escape") return;
      setOpen(false);
      buttonRef.current?.focus();
    };
    document.addEventListener("pointerdown", onPointerDown);
    document.addEventListener("keydown", onKeyDown);
    return () => {
      document.removeEventListener("pointerdown", onPointerDown);
      document.removeEventListener("keydown", onKeyDown);
    };
  }, [open]);

  const handleSignOut = async () => {
    setLeaving(true);
    setSignOutError(false);
    const ok = await requestSignOut();
    if (!ok) {
      setSignOutError(true);
      setLeaving(false);
      return;
    }
    forgetEmail();
    broadcastSession({ type: "signed-out" });
    window.location.replace(AUTH_ROUTES.login);
  };

  const method = account.provider === "google" ? "Google" : "Correo";

  return (
    <div
      ref={rootRef}
      onBlur={(event) => {
        if (!rootRef.current?.contains(event.relatedTarget as Node | null)) {
          setOpen(false);
        }
      }}
      className="relative h-(--account-bar-h) border-b border-black/5 bg-white/85 pt-[env(safe-area-inset-top)] backdrop-blur-md"
    >
      <div className="flex h-full items-center justify-center px-(--page-x)">
        <button
          ref={buttonRef}
          type="button"
          aria-expanded={open}
          aria-controls={panelId}
          onClick={() => setOpen((v) => !v)}
          className="flex h-9 max-w-full min-w-0 cursor-pointer items-center gap-2 rounded-full py-1 pr-2.5 pl-1.5 text-[0.8125rem] transition-colors hover:bg-black/[0.05] focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-results-blue aria-expanded:bg-black/[0.05] wide:h-8 sm:text-sm"
        >
          <ProviderMark provider={account.provider} className="size-6" />
          <span className="shrink-0 text-black/55">Votas con</span>
          <span className="min-w-0 truncate font-semibold text-black/85">
            {account.email}
          </span>
          <ChevronDown
            aria-hidden="true"
            className={`size-4 shrink-0 text-black/50 transition-transform motion-reduce:transition-none ${open ? "rotate-180" : ""}`}
          />
        </button>
      </div>

      <div
        id={panelId}
        hidden={!open}
        className="absolute top-[calc(100%+0.5rem)] left-1/2 w-[min(21rem,calc(100vw-2rem))] -translate-x-1/2 rounded-2xl border border-black/10 bg-white p-4 shadow-[0_1rem_2.5rem_rgba(29,58,115,0.18)]"
      >
        <div className="flex items-center gap-3">
          <ProviderMark provider={account.provider} className="size-10" />
          <div className="min-w-0">
            {account.fullName && (
              <p className="truncate text-[0.9375rem] font-bold">
                {account.fullName}
              </p>
            )}
            <p className="text-sm break-all text-black/65">
              {account.email}
              <span className="text-black/45"> · {method}</span>
            </p>
          </div>
        </div>

        <div className="mt-4 border-t border-black/8 pt-4">
          <p className="text-sm text-black/60">¿No eres tú?</p>
          <button
            type="button"
            onClick={handleSignOut}
            disabled={leaving}
            className={`mt-2 h-11! ${SECONDARY_BUTTON}`}
          >
            {leaving ? (
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
          {signOutError && (
            <div className="mt-2">
              <FieldError id={`${panelId}-error`}>
                No pudimos cerrar sesión. Inténtalo de nuevo.
              </FieldError>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

/** Aviso que aparece cuando la pestaña se recargó porque la cuenta cambió. */
function AccountChangedNotice() {
  const changed = useSyncExternalStore(
    noSubscribe,
    accountChangedOnLoad,
    () => false,
  );
  const [dismissed, setDismissed] = useState(false);
  if (!changed || dismissed) return null;

  return (
    <div
      role="alert"
      className="flex items-start justify-center gap-2 border-b border-[#fedf89] bg-[#fffaeb] px-(--page-x) py-2.5 text-[0.8125rem] leading-snug text-[#7a2e0e] sm:items-center sm:text-sm"
    >
      <TriangleAlert
        aria-hidden="true"
        className="mt-px size-4 shrink-0 text-[#dc6803] sm:mt-0"
      />
      <p className="min-w-0">
        La cuenta cambió en este navegador. Revisa con qué cuenta vas a votar.
      </p>
      <button
        type="button"
        onClick={() => setDismissed(true)}
        aria-label="Cerrar aviso"
        className="-my-1 flex size-7 shrink-0 cursor-pointer items-center justify-center rounded-full transition-colors hover:bg-[#7a2e0e]/10 focus-visible:outline-2 focus-visible:outline-results-blue"
      >
        <X aria-hidden="true" className="size-4" />
      </button>
    </div>
  );
}

function ProviderMark({
  provider,
  className,
}: {
  provider: SessionAccount["provider"];
  className: string;
}) {
  return (
    <span
      aria-hidden="true"
      className={`flex shrink-0 items-center justify-center rounded-full ${
        provider === "google"
          ? "border border-black/10 bg-white"
          : "bg-[#eef4fd] text-results-blue"
      } ${className}`}
    >
      {provider === "google" ? (
        <GoogleIcon className="size-[58%]" />
      ) : (
        <Mail className="size-[55%]" />
      )}
    </span>
  );
}
