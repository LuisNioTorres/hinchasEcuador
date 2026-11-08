/** Texto comparable: sin tildes, sin mayúsculas y sin espacios sobrantes. */
export function normalizeSearch(text: string) {
  return text
    .normalize("NFD")
    .replace(/[̀-ͯ]/g, "")
    .toLowerCase()
    .replace(/\s+/g, " ")
    .trim();
}

/**
 * Filtra por coincidencia parcial en cualquiera de los textos de cada opción,
 * ignorando tildes y mayúsculas ("canar" encuentra "Cañar"). Primero van las
 * opciones cuyo nombre empieza por la búsqueda.
 */
export function searchOptions<T>(
  options: readonly T[],
  query: string,
  texts: (option: T) => readonly string[],
): T[] {
  const q = normalizeSearch(query);
  if (!q) return [...options];
  const starts: T[] = [];
  const contains: T[] = [];
  for (const option of options) {
    const [main = "", ...rest] = texts(option).map(normalizeSearch);
    if (main.startsWith(q) || main.split(" ").some((w) => w.startsWith(q))) {
      starts.push(option);
    } else if (main.includes(q) || rest.some((t) => t.includes(q))) {
      contains.push(option);
    }
  }
  return [...starts, ...contains];
}
