"use client";

import Link from "next/link";
import type { ReactNode } from "react";
import { destinationFor, useSessionStatus } from "@/lib/auth/simulated-session";

/** Botón VOTAR: su destino depende de si hay sesión y de si ya se votó. */
export function VoteLink({
  className,
  children,
}: {
  className: string;
  children: ReactNode;
}) {
  return (
    <Link href={destinationFor(useSessionStatus())} className={className}>
      {children}
    </Link>
  );
}
