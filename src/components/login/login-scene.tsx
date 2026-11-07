import {
  ECUADOR_PROVINCES,
  GALAPAGOS_ID,
} from "@/components/home/results/ecuador-map-data";

const MAINLAND = ECUADOR_PROVINCES.filter(({ id }) => id !== GALAPAGOS_ID);

/**
 * Puntos que se encienden sobre algunas ciudades, en el lienzo del mapa (565x643):
 * Quito, Guayaquil, Cuenca y Ambato. Solo decoran: no representan datos.
 */
const PULSES = [
  { x: 259.7, y: 185.2, color: "#EB2323", delay: "0s" },
  { x: 134.7, y: 358.5, color: "#FFD016", delay: "0.7s" },
  { x: 215.7, y: 422.8, color: "#376CD3", delay: "1.4s" },
  { x: 249, y: 270.8, color: "#085FC3", delay: "2.1s" },
] as const;

/**
 * Fondo decorativo de la página de inicio de sesión: cielo azul claro, luces suaves
 * con los colores de la bandera, una cancha en perspectiva y la silueta de Ecuador
 * con sus provincias. Ocupa todo su contenedor, que debe tener `relative`.
 */
export function LoginScene() {
  return (
    <div
      aria-hidden="true"
      className="pointer-events-none absolute inset-0 -z-10 overflow-hidden bg-[linear-gradient(160deg,#f7fbff_0%,#e4efff_48%,#cddff9_100%)]"
    >
      {/* Luces con los colores de la bandera. */}
      <div className="absolute -top-[12%] -left-[10%] size-[55%] rounded-full bg-[#FFD016]/25 blur-3xl" />
      <div className="absolute top-[30%] -right-[15%] size-[50%] rounded-full bg-[#376CD3]/20 blur-3xl" />
      <div className="absolute -bottom-[20%] left-[5%] size-[45%] rounded-full bg-[#EB2323]/10 blur-3xl" />

      {/* Cancha en perspectiva, que se desvanece hacia arriba. */}
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

      {/* Silueta de Ecuador con sus provincias. */}
      <svg
        viewBox="0 0 565 643"
        className="absolute top-[4%] right-[-36%] h-[96%] max-w-none drop-shadow-[0_1.5rem_2.5rem_rgba(29,58,115,0.18)] tablet:top-[3%] tablet:right-[-30%] tablet:h-[58%] tablet:landscape:top-auto tablet:landscape:right-[-26%] tablet:landscape:bottom-[4%] tablet:landscape:h-[70%] wide:top-[6%] wide:right-[-12%] wide:h-[100%] lg:top-auto lg:right-[-22%] lg:bottom-[3%] lg:h-[74%]"
      >
        <g
          fill="#ffffff"
          fillOpacity="0.55"
          stroke="#376cd3"
          strokeOpacity="0.28"
          strokeWidth="1"
          strokeLinejoin="round"
        >
          {MAINLAND.map(({ id, d }) => (
            <path
              key={id}
              d={d}
              fillRule="evenodd"
              vectorEffect="non-scaling-stroke"
            />
          ))}
        </g>
        {PULSES.map(({ x, y, color, delay }) => (
          <g key={`${x}-${y}`} style={{ color }}>
            <circle
              cx={x}
              cy={y}
              r="14"
              fill="currentColor"
              fillOpacity="0.35"
              style={{ animationDelay: delay, transformBox: "fill-box" }}
              className="origin-center animate-ping [animation-duration:2.8s] motion-reduce:animate-none"
            />
            <circle
              cx={x}
              cy={y}
              r="5.5"
              fill="currentColor"
              stroke="#ffffff"
              strokeWidth="2"
            />
          </g>
        ))}
      </svg>
    </div>
  );
}
