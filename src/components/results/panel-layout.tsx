export const TWO_COLUMNS =
  "grid grid-cols-[minmax(0,1fr)] gap-8 lg:grid-cols-[minmax(0,0.9fr)_minmax(0,1fr)] lg:gap-[clamp(2rem,4vw,4.5rem)] tablet:landscape:grid-cols-2 tablet:landscape:gap-6";

export function PanelTitle({
  title,
  subtitle,
}: {
  title: string;
  subtitle: string;
}) {
  return (
    <div className="mb-4">
      <h3 className="text-lg font-bold tracking-tight sm:text-xl">{title}</h3>
      <p className="mt-1 text-sm text-black/55">{subtitle}</p>
    </div>
  );
}
