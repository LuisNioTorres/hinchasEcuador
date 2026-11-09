import type { ReactNode } from "react";
import { LoaderCircle } from "lucide-react";

/** Estilos comunes de los controles de las pantallas de acceso. */
export const PRIMARY_BUTTON =
  "group flex h-12 w-full cursor-pointer items-center justify-center gap-2 rounded-xl bg-brand-blue text-[0.9375rem] font-semibold text-white shadow-[0_0.5rem_1.25rem_rgba(21,78,142,0.28)] transition-[background-color,box-shadow] hover:bg-[#0f3f75] focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-results-blue disabled:cursor-wait disabled:bg-[#0f3f75]/85";

export const SECONDARY_BUTTON =
  "flex h-12 w-full cursor-pointer items-center justify-center gap-3 rounded-xl border border-black/15 bg-white text-[0.9375rem] font-semibold text-black shadow-[0_1px_2px_rgba(0,0,0,0.05)] transition-colors hover:bg-[#f4f7fc] focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-results-blue disabled:cursor-wait disabled:text-black/60";

export const TEXT_LINK =
  "cursor-pointer rounded font-semibold text-results-blue underline-offset-4 hover:underline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-results-blue disabled:cursor-not-allowed disabled:text-black/40 disabled:no-underline";

export const FIELD_LABEL = "text-sm font-semibold text-black/80";

export function textInputClass(hasError: boolean) {
  return `h-12 w-full rounded-xl border bg-white px-4 text-[0.9375rem] text-black transition-[border-color,box-shadow] outline-none placeholder:text-black/35 focus:ring-4 ${
    hasError
      ? "border-[#d92d20] focus:ring-[#d92d20]/15"
      : "border-black/15 focus:border-results-blue focus:ring-results-blue/15"
  }`;
}

export function FieldError({ id, children }: { id: string; children: string }) {
  return (
    <p id={id} role="alert" className="text-sm text-[#b42318]">
      {children}
    </p>
  );
}

export function Spinner() {
  return (
    <LoaderCircle
      aria-hidden="true"
      className="size-[1.125rem] animate-spin motion-reduce:animate-none"
    />
  );
}

/** Recuadro azul suave con icono, para avisos y ayudas. */
export function AuthNote({
  icon,
  id,
  children,
}: {
  icon: ReactNode;
  id?: string;
  children: ReactNode;
}) {
  return (
    <p
      id={id}
      className="flex items-start gap-2 rounded-xl bg-[#eef4fd] px-3.5 py-3 text-[0.8125rem] leading-snug text-black/70 [&>svg]:mt-px [&>svg]:size-4 [&>svg]:shrink-0 [&>svg]:text-results-blue"
    >
      {icon}
      <span>{children}</span>
    </p>
  );
}
