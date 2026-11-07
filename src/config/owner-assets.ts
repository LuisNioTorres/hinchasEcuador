/**
 * Inventario de imágenes e iconos que proporciona el dueño del proyecto.
 *
 * Originales en `imagenes/` (no se modifican); copias servidas desde
 * `public/images/` con nombre en kebab-case y extensión según su formato real.
 *
 * Si un asset futuro aún no existe, `src: null` muestra un marcador neutro
 * (ver `OwnerImage`). `width` y `height` son las dimensiones intrínsecas reales.
 */
export interface OwnerAsset {
  readonly src: string | null;
  readonly alt: string;
  readonly width: number;
  readonly height: number;
}

export const ownerAssets = {
  /**
   * Logo TEMPORAL de la empresa (header). PNG con fondo transparente;
   * el dibujo ocupa x 72–1130, y 22–648 del lienzo de 1200x675.
   */
  companyIcon: {
    src: "/images/logo-empresa-temp.png",
    alt: "Logo del proyecto",
    width: 1200,
    height: 675,
  },
  /** Bandera del Ecuador sin escudo (Sección 1). JPEG opaco, sin márgenes. */
  ecuadorFlag: {
    src: "/images/bandera-ecuador-sin-escudo.jpg",
    alt: "Bandera del Ecuador",
    width: 582,
    height: 568,
  },
  /** Escudo del Ecuador (Sección 1). WebP con fondo transparente, sin márgenes. */
  ecuadorCoatOfArms: {
    src: "/images/escudo-ecuador.webp",
    alt: "Escudo del Ecuador",
    width: 800,
    height: 960,
  },
  /**
   * Balón de fútbol (Sección 1). WebP con fondo transparente;
   * el balón ocupa x/y 22–936 del lienzo de 960x960 (margen ~2,3%).
   */
  footballBall: {
    src: "/images/balon-futbol.webp",
    alt: "Balón de fútbol",
    width: 960,
    height: 960,
  },
  /**
   * PENDIENTE — Imagen con los escudos de los equipos participantes
   * (Sección 3). Medidas del bloque en la referencia.
   */
  participatingClubsCrests: {
    src: null,
    alt: "Escudos de los equipos participantes en el censo",
    width: 766,
    height: 590,
  },
} as const satisfies Record<string, OwnerAsset>;
