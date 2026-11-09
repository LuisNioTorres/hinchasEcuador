"use client";

import { useState } from "react";
import { OTP_LENGTH } from "@/lib/auth/routes";

/**
 * Campo del código de un solo uso. Es un único `input` real (pegar, autocompletar
 * del teclado del móvil y lectores de pantalla funcionan con normalidad), invisible
 * sobre seis casillas que solo dibujan los dígitos.
 */
export function CodeInput({
  id,
  value,
  onChange,
  invalid,
  describedBy,
  disabled,
}: {
  id: string;
  value: string;
  onChange: (value: string) => void;
  invalid: boolean;
  describedBy?: string;
  disabled?: boolean;
}) {
  const [focused, setFocused] = useState(false);
  const active = Math.min(value.length, OTP_LENGTH - 1);
  const half = OTP_LENGTH / 2;

  const box = (index: number) => {
    const digit = value[index];
    const isActive = focused && index === active;
    return (
      <span
        key={index}
        className={`flex h-14 min-w-0 flex-1 items-center justify-center rounded-xl border bg-white text-2xl font-bold text-black tabular-nums transition-[border-color,box-shadow] wide:h-12 ${
          invalid
            ? "border-[#d92d20]"
            : isActive
              ? "border-results-blue ring-4 ring-results-blue/15"
              : digit
                ? "border-black/30"
                : "border-black/15"
        }`}
      >
        {digit ??
          (isActive && (
            <span className="h-6 w-0.5 animate-pulse rounded-full bg-results-blue motion-reduce:animate-none" />
          ))}
      </span>
    );
  };

  return (
    <div className="relative">
      <input
        id={id}
        type="text"
        inputMode="numeric"
        autoComplete="one-time-code"
        pattern="[0-9]*"
        maxLength={OTP_LENGTH}
        value={value}
        readOnly={disabled}
        onChange={(event) =>
          onChange(event.target.value.replace(/\D/g, "").slice(0, OTP_LENGTH))
        }
        onFocus={() => setFocused(true)}
        onBlur={() => setFocused(false)}
        aria-invalid={invalid}
        aria-describedby={describedBy}
        className="absolute inset-0 z-10 size-full cursor-text opacity-0"
      />
      <div aria-hidden="true" className="flex items-center gap-2">
        {Array.from({ length: half }, (_, i) => box(i))}
        <span className="h-0.5 w-2.5 shrink-0 rounded-full bg-black/20" />
        {Array.from({ length: OTP_LENGTH - half }, (_, i) => box(i + half))}
      </div>
    </div>
  );
}
