import type { Metadata } from "next";
import { Montserrat, Tiro_Bangla } from "next/font/google";
import "./globals.css";

// Tipografía de las pantallas 1 y 3 (y del header).
const tiroBangla = Tiro_Bangla({
  variable: "--font-tiro-bangla",
  weight: "400",
  style: ["normal", "italic"],
  subsets: ["latin", "latin-ext"],
  display: "swap",
});

// Tipografía de la pantalla 2 (resultados). Fuente variable: todos los pesos.
const montserrat = Montserrat({
  variable: "--font-montserrat-family",
  style: ["normal", "italic"],
  subsets: ["latin", "latin-ext"],
  display: "swap",
});

export const metadata: Metadata = {
  title: "Censo Único del Ecuador",
  description: "Ayúdanos a descubrir cuál es el equipo más popular del país.",
};

export default function RootLayout({ children }: LayoutProps<"/">) {
  return (
    <html
      lang="es"
      className={`${tiroBangla.variable} ${montserrat.variable} antialiased`}
    >
      <body className="min-h-svh">{children}</body>
    </html>
  );
}
