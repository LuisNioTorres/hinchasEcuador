/** Tinta legible (azul muy oscuro o blanca) sobre un color de fondo en HEX (#RRGGBB). */
export function inkOn(hex: string) {
  const n = Number.parseInt(hex.slice(1), 16);
  const [r = 0, g = 0, b = 0] = [n >> 16, (n >> 8) & 255, n & 255].map((c) => {
    const s = c / 255;
    return s <= 0.03928 ? s / 12.92 : ((s + 0.055) / 1.055) ** 2.4;
  });
  return 0.2126 * r + 0.7152 * g + 0.0722 * b > 0.4 ? "#0b1f3f" : "#ffffff";
}
