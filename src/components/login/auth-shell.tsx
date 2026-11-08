import type { ReactNode } from "react";
import Image from "next/image";
import Link from "next/link";
import { ArrowLeft } from "lucide-react";
import { ownerAssets } from "@/config/owner-assets";
import { LoginScene } from "@/components/login/login-scene";

/** Pantalla dividida: escenario con el saludo a la izquierda y panel a la derecha. */
const SPLIT_MAIN =
  "tablet:landscape:grid tablet:landscape:grid-cols-[minmax(0,1.08fr)_minmax(0,1fr)] lg:grid lg:grid-cols-[minmax(0,1.08fr)_minmax(0,1fr)]";

/**
 * Estructura común de todas las pantallas de acceso (login, revisa tu correo,
 * enlace vencido, tu nombre). Referencia (solo boceto):
 * design/references/loguin/BOCETO INICIO SESION.png.
 *
 * - lg+ y tablet en horizontal: pantalla dividida.
 * - tablet en vertical: el escenario cubre la pantalla, con el saludo y una tarjeta
 *   flotante centrados. Por eso ahí la sección del saludo es `static`: el escenario
 *   toma como referencia todo el `main`.
 * - phone: escenario compacto arriba y el panel como una hoja que sube sobre él.
 * - wide (teléfono girado): dos columnas compactas.
 */
export function AuthShell({ children }: { children: ReactNode }) {
  return (
    <main
      className={`relative isolate flex min-h-svh flex-col bg-bone font-montserrat text-black tablet:justify-center tablet:py-20 tablet:landscape:py-0 wide:grid wide:grid-cols-2 ${SPLIT_MAIN}`}
    >
      <Link
        href="/"
        className="absolute top-[max(1rem,env(safe-area-inset-top))] right-(--page-x) z-30 flex h-10 items-center gap-1.5 rounded-full border border-black/10 bg-white/80 px-4 text-sm font-semibold text-black/80 backdrop-blur transition-colors hover:bg-white focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-results-blue max-[21.25rem]:px-3 lg:top-8 lg:right-10"
      >
        <ArrowLeft aria-hidden="true" className="size-4" />
        <span className="max-[21.25rem]:sr-only">Volver al inicio</span>
      </Link>

      <section className="relative isolate flex flex-col px-(--page-x) pt-[max(1rem,env(safe-area-inset-top))] pb-16 tablet:static tablet:mx-auto tablet:w-[min(100%-5rem,30rem)] tablet:p-0 tablet:landscape:relative tablet:landscape:mx-0 tablet:landscape:w-auto tablet:landscape:min-h-svh tablet:landscape:justify-center tablet:landscape:px-[5vw] tablet:landscape:py-24 wide:min-h-svh wide:justify-center wide:py-6 lg:min-h-svh lg:justify-center lg:px-[6vw] lg:py-16">
        <LoginScene />

        <Link
          href="/"
          aria-label="Ir a la página principal"
          className="w-fit rounded-lg focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-results-blue tablet:landscape:absolute tablet:landscape:top-6 tablet:landscape:left-[5vw] wide:absolute wide:top-4 wide:left-(--page-x) lg:absolute lg:top-8 lg:left-[6vw]"
        >
          <Image
            src={ownerAssets.companyIcon.src}
            alt={ownerAssets.companyIcon.alt}
            width={ownerAssets.companyIcon.width}
            height={ownerAssets.companyIcon.height}
            preload
            className="h-auto w-[6.5rem] tablet:w-[7rem] wide:w-[5.5rem] lg:w-[clamp(8rem,9vw,11rem)]"
          />
        </Link>

        <div className="mt-8 max-w-[34rem] tablet:mt-10 tablet:landscape:mt-0 wide:mt-10 lg:mt-0 lg:max-w-[min(40rem,44vw)]">
          <h1 className="font-tiro text-[clamp(2.25rem,11vw,3rem)] leading-[1.05] text-[#0b1f3f] italic tablet:text-[clamp(2.75rem,6.5vw,3.5rem)] tablet:landscape:text-[clamp(2.5rem,4.8vw,3.25rem)] wide:text-[clamp(1.75rem,4.6vw,2.5rem)] lg:text-[clamp(3.25rem,4.4vw,5.5rem)]">
            BIENVENIDO, CRACK
          </h1>
          <p className="mt-4 max-w-[30rem] text-[0.8125rem] leading-relaxed font-semibold tracking-wide text-[#0b1f3f]/75 uppercase tablet:mt-4 tablet:text-sm wide:mt-3 wide:text-xs lg:mt-7 lg:max-w-[34rem] lg:text-[clamp(0.875rem,1vw,1.0625rem)]">
            Registrate en el censo iniciando sesión con una de tus cuentas. Es
            totalmente gratuito.
          </p>
        </div>
      </section>

      <section className="relative z-10 -mt-8 flex-1 rounded-t-[1.75rem] bg-white px-(--page-x) pt-8 pb-[max(2rem,env(safe-area-inset-bottom))] shadow-[0_-0.75rem_2rem_rgba(29,58,115,0.1)] tablet:mx-auto tablet:mt-8 tablet:w-[min(100%-5rem,30rem)] tablet:flex-none tablet:rounded-3xl tablet:p-10 tablet:shadow-[0_1.5rem_3rem_rgba(29,58,115,0.16)] tablet:landscape:m-0 tablet:landscape:flex tablet:landscape:w-auto tablet:landscape:items-center tablet:landscape:rounded-none tablet:landscape:px-[5vw] tablet:landscape:py-20 tablet:landscape:shadow-none wide:mt-0 wide:flex wide:items-center wide:rounded-none wide:py-14 wide:shadow-none lg:mt-0 lg:flex lg:items-center lg:justify-center lg:rounded-none lg:px-[6vw] lg:py-24 lg:shadow-none">
        <div className="mx-auto w-full max-w-[26rem] lg:max-w-[28rem]">
          {children}
        </div>
      </section>
    </main>
  );
}

/** Título y subtítulo del panel derecho, iguales en todas las pantallas de acceso. */
export function AuthPanelHeader({
  icon,
  title,
  children,
}: {
  icon?: ReactNode;
  title: string;
  children: ReactNode;
}) {
  return (
    <header>
      {icon && (
        <span className="mb-5 flex size-14 items-center justify-center rounded-2xl bg-[#eef4fd] text-results-blue wide:mb-3 wide:size-11">
          {icon}
        </span>
      )}
      <h2 className="text-[1.625rem] leading-tight font-bold tracking-tight tablet:text-[1.875rem] wide:text-[1.375rem] lg:text-[clamp(1.875rem,2.2vw,2.375rem)]">
        {title}
      </h2>
      <div className="mt-2 text-[0.9375rem] text-black/60 wide:text-sm">
        {children}
      </div>
    </header>
  );
}
