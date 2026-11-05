import Image from "next/image";
import type { OwnerAsset } from "@/config/owner-assets";

interface OwnerImageProps {
  asset: OwnerAsset;
  className?: string;
  /** Muestra el nombre del asset pendiente dentro del marcador (solo si hay espacio). */
  showPlaceholderLabel?: boolean;
  sizes?: string;
  preload?: boolean;
}

/**
 * Ocupa el 100% del ancho de su contenedor: el tamaño se controla desde el padre.
 *
 * Renderiza un asset del dueño. Si todavía no fue entregado (`src === null`),
 * muestra un marcador neutro, claramente identificado como pendiente,
 * que conserva el tamaño y la relación de aspecto del asset.
 */
export function OwnerImage({
  asset,
  className = "",
  showPlaceholderLabel = false,
  sizes,
  preload = false,
}: OwnerImageProps) {
  if (asset.src !== null) {
    return (
      <Image
        src={asset.src}
        alt={asset.alt}
        width={asset.width}
        height={asset.height}
        sizes={sizes}
        preload={preload}
        className={`block h-auto w-full object-contain ${className}`}
      />
    );
  }

  return (
    <div
      role="img"
      aria-label={`${asset.alt} (asset pendiente)`}
      title={`Asset pendiente: ${asset.alt}`}
      data-asset-placeholder={asset.alt}
      style={{ aspectRatio: `${asset.width} / ${asset.height}` }}
      className={`relative w-full border border-dashed border-neutral-400 bg-neutral-100 ${className}`}
    >
      {showPlaceholderLabel && (
        <span className="absolute top-1 left-1 font-mono text-[10px] leading-tight text-neutral-500 sm:text-xs">
          [asset pendiente: {asset.alt}]
        </span>
      )}
    </div>
  );
}
