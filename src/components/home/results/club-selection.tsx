"use client";

import {
  createContext,
  useContext,
  useMemo,
  useState,
  type ReactNode,
} from "react";
import type { LeaderClub } from "@/lib/results/province-leaders";

interface ClubSelection {
  readonly selectedClub: LeaderClub | null;
  readonly toggleClub: (club: LeaderClub) => void;
  readonly clearClub: () => void;
}

const ClubSelectionContext = createContext<ClubSelection>({
  selectedClub: null,
  toggleClub: () => {},
  clearClub: () => {},
});

export const useClubSelection = () => useContext(ClubSelectionContext);

/** Comparte el club elegido en el TOP 5 con el mapa, sin añadir elementos a la página. */
export function ClubSelectionProvider({ children }: { children: ReactNode }) {
  const [selectedClub, setSelectedClub] = useState<LeaderClub | null>(null);

  const value = useMemo<ClubSelection>(
    () => ({
      selectedClub,
      toggleClub: (club) =>
        setSelectedClub((current) => (current?.id === club.id ? null : club)),
      clearClub: () => setSelectedClub(null),
    }),
    [selectedClub],
  );

  return (
    <ClubSelectionContext.Provider value={value}>
      {children}
    </ClubSelectionContext.Provider>
  );
}

interface SelectableClubRowProps {
  club: LeaderClub;
  /** Texto para lectores de pantalla: el botón cubre la fila y no tiene texto propio. */
  label: string;
  className: string;
  children: ReactNode;
}

/**
 * Fila del TOP 5 que elige su club. El botón es una capa sobre la fila: fuera de la
 * rejilla, para no cambiar sus medidas. Pulsarla otra vez quita la selección.
 */
export function SelectableClubRow({
  club,
  label,
  className,
  children,
}: SelectableClubRowProps) {
  const { selectedClub, toggleClub } = useClubSelection();
  const isSelected = selectedClub?.id === club.id;
  const isDimmed = selectedClub !== null && !isSelected;

  return (
    <li
      className={`relative outline-offset-2 outline-black transition-[opacity,scale,box-shadow] duration-200 ease-out has-[:focus-visible]:outline-2 motion-reduce:transition-none ${
        isSelected
          ? "z-10 scale-[1.03] shadow-[0_0.5rem_1.25rem_rgba(15,30,60,0.22)] motion-reduce:scale-100"
          : ""
      } ${isDimmed ? "opacity-45" : ""} ${className}`}
    >
      {children}
      <button
        type="button"
        aria-pressed={isSelected}
        aria-label={label}
        onClick={() => toggleClub(club)}
        className="absolute inset-0 cursor-pointer outline-none hover:bg-black/5"
      />
    </li>
  );
}
