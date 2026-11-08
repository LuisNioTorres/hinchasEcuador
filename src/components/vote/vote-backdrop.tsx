/**
 * Fondo decorativo del formulario de voto: el mismo cielo azul claro, las luces de
 * la bandera y la cancha en perspectiva del login (src/components/login/login-scene.tsx),
 * sin la silueta grande de Ecuador, porque aquí el protagonista es la tarjeta del
 * hincha. Ocupa todo su contenedor, que debe tener `relative`.
 */
export function VoteBackdrop() {
  return (
    <div
      aria-hidden="true"
      className="pointer-events-none absolute inset-0 -z-10 overflow-hidden bg-[linear-gradient(160deg,#f7fbff_0%,#e4efff_48%,#cddff9_100%)]"
    >
      <div className="absolute -top-[8%] -left-[8%] size-[30%] rounded-full bg-[#FFD016]/15 blur-3xl" />
      <div className="absolute top-[30%] -right-[15%] size-[50%] rounded-full bg-[#376CD3]/20 blur-3xl" />
      <div className="absolute -bottom-[20%] left-[5%] size-[45%] rounded-full bg-[#EB2323]/10 blur-3xl" />

      <div className="absolute inset-x-[-35%] bottom-[-18%] h-[70%] [mask-image:linear-gradient(to_top,black_35%,transparent)] [perspective:900px]">
        <svg
          viewBox="0 0 1050 680"
          preserveAspectRatio="xMidYMax meet"
          className="size-full origin-bottom [transform:rotateX(58deg)]"
          fill="none"
          stroke="#ffffff"
          strokeWidth="4"
          strokeOpacity="0.9"
        >
          <rect x="2" y="2" width="1046" height="676" rx="6" />
          <line x1="525" y1="2" x2="525" y2="678" />
          <circle cx="525" cy="340" r="91.5" />
          <circle cx="525" cy="340" r="5" fill="#ffffff" />
          <rect x="2" y="138.5" width="165" height="403" />
          <rect x="883" y="138.5" width="165" height="403" />
          <rect x="2" y="248.5" width="55" height="183" />
          <rect x="993" y="248.5" width="55" height="183" />
        </svg>
      </div>
    </div>
  );
}
