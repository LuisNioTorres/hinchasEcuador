type CurrentUserLocation =
  | { kind: "nacional"; provinceId: string; country: string }
  | { kind: "internacional"; continentId: string };

/**
 * SIMULACIÓN: usuario logueado de ejemplo. Con la autenticación real, el nombre y el
 * apellido saldrán del perfil, y el ID DEL HINCHA, la ubicación y el equipo de su voto.
 */
export const CURRENT_USER: {
  readonly firstName: string;
  readonly lastName: string;
  readonly fullName: string;
  /** ID DEL HINCHA: el número de su voto en el censo. */
  readonly fanNumber: number;
  readonly location: CurrentUserLocation;
  readonly clubId: string;
} = {
  firstName: "Andrea",
  lastName: "Morales",
  fullName: "Andrea Morales",
  fanNumber: 1284,
  location: { kind: "nacional", provinceId: "EC-G", country: "Ecuador" },
  clubId: "barcelona",
};
