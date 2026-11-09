import type { Metadata } from "next";
import { UserHeader } from "@/components/layout/user-header";
import {
  UserInfoScreen,
  type FanLocation,
} from "@/components/user-info/user-info-screen";
import { clubOf, PROVINCE_NAME } from "@/mocks/catalog-lookup";
import { CONTINENTS } from "@/mocks/catalogs";
import { CURRENT_USER } from "@/mocks/current-user";

export const metadata: Metadata = {
  title: "Mi información · Censo Único del Ecuador",
  robots: { index: false, follow: false },
};

/** Información del usuario logueado. SIMULACIÓN: datos de src/mocks/current-user.ts. */
export default function UserInfoPage() {
  const { location: place } = CURRENT_USER;
  const location: FanLocation =
    place.kind === "nacional"
      ? {
          kind: "nacional",
          province: PROVINCE_NAME.get(place.provinceId) ?? "",
          country: place.country,
        }
      : {
          kind: "internacional",
          continent:
            CONTINENTS.find((c) => c.id === place.continentId)?.name ?? "",
        };

  return (
    <>
      <UserHeader fullName={CURRENT_USER.fullName} />
      <UserInfoScreen
        initialName={{
          firstName: CURRENT_USER.firstName,
          lastName: CURRENT_USER.lastName,
        }}
        fanNumber={CURRENT_USER.fanNumber}
        location={location}
        club={clubOf(CURRENT_USER.clubId)}
      />
    </>
  );
}
