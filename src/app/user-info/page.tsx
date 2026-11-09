import { Suspense } from "react";
import type { Metadata } from "next";
import { UserHeader } from "@/components/layout/user-header";
import {
  UserInfoScreen,
  type FanLocation,
} from "@/components/user-info/user-info-screen";
import { requireOwnVote, requireProfile } from "@/lib/auth/current-user";
import { clubOf } from "@/mocks/catalog-lookup";

export const metadata: Metadata = {
  title: "Mi información · Censo Único del Ecuador",
  robots: { index: false, follow: false },
};

async function UserInfo() {
  const [profile, vote] = await Promise.all([
    requireProfile(),
    requireOwnVote(),
  ]);
  const location: FanLocation = vote.provincia
    ? { kind: "nacional", province: vote.provincia, country: "Ecuador" }
    : { kind: "internacional", continent: vote.continente ?? "" };

  return (
    <>
      <UserHeader fullName={profile.fullName} />
      <UserInfoScreen
        initialName={{
          firstName: profile.firstName,
          lastName: profile.lastName,
        }}
        fanNumber={vote.numero_voto}
        location={location}
        club={clubOf(vote.club_slug)}
      />
    </>
  );
}

/** Información del usuario logueado. */
export default function UserInfoPage() {
  return (
    <Suspense fallback={<div className="min-h-svh" />}>
      <UserInfo />
    </Suspense>
  );
}
