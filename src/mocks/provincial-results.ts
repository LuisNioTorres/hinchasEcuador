/**
 * DATOS MOCK — Votos por provincia para el mapa (Sección 2).
 *
 * Votos FICTICIOS, solo para ver cómo se verá el mapa con ganadores. NO son
 * resultados reales ni opiniones sobre la afición de cada provincia. Suman los 3000
 * "hinchas censados" del mock nacional. Se reemplazarán por datos del backend.
 *
 * Napo tiene un empate a propósito, para ver el desempate alfabético.
 */
import {
  getProvinceLeaders,
  type ProvinceVotes,
} from "@/lib/results/province-leaders";
import { mockClubs } from "@/mocks/national-results";

const EMELEC = "emelec";
const BARCELONA = "barcelona";
const NACIONAL = "el-nacional";
const LIGA = "liga-de-quito";
const CHACARITA = "chacarita";

export const mockProvinceVotes: ProvinceVotes = {
  "EC-A": {
    [BARCELONA]: 72,
    [LIGA]: 58,
    [NACIONAL]: 30,
    [EMELEC]: 16,
    [CHACARITA]: 4,
  },
  "EC-B": {
    [NACIONAL]: 13,
    [LIGA]: 9,
    [BARCELONA]: 6,
    [EMELEC]: 1,
    [CHACARITA]: 1,
  },
  "EC-F": {
    [BARCELONA]: 16,
    [LIGA]: 12,
    [NACIONAL]: 8,
    [EMELEC]: 3,
    [CHACARITA]: 1,
  },
  "EC-C": {
    [LIGA]: 12,
    [NACIONAL]: 7,
    [BARCELONA]: 4,
    [EMELEC]: 1,
    [CHACARITA]: 1,
  },
  "EC-H": {
    [NACIONAL]: 30,
    [LIGA]: 20,
    [BARCELONA]: 14,
    [EMELEC]: 4,
    [CHACARITA]: 2,
  },
  "EC-X": {
    [NACIONAL]: 24,
    [LIGA]: 20,
    [BARCELONA]: 10,
    [EMELEC]: 4,
    [CHACARITA]: 2,
  },
  "EC-O": {
    [EMELEC]: 46,
    [BARCELONA]: 40,
    [LIGA]: 6,
    [NACIONAL]: 6,
    [CHACARITA]: 2,
  },
  "EC-E": {
    [EMELEC]: 36,
    [BARCELONA]: 28,
    [LIGA]: 8,
    [NACIONAL]: 6,
    [CHACARITA]: 2,
  },
  "EC-W": { [EMELEC]: 5, [BARCELONA]: 3, [LIGA]: 1, [NACIONAL]: 1 },
  "EC-G": {
    [BARCELONA]: 430,
    [EMELEC]: 340,
    [LIGA]: 40,
    [NACIONAL]: 20,
    [CHACARITA]: 10,
  },
  "EC-I": {
    [LIGA]: 26,
    [NACIONAL]: 18,
    [BARCELONA]: 10,
    [EMELEC]: 4,
    [CHACARITA]: 2,
  },
  "EC-L": {
    [LIGA]: 26,
    [BARCELONA]: 22,
    [NACIONAL]: 14,
    [EMELEC]: 6,
    [CHACARITA]: 2,
  },
  "EC-R": {
    [EMELEC]: 58,
    [BARCELONA]: 50,
    [LIGA]: 5,
    [NACIONAL]: 5,
    [CHACARITA]: 2,
  },
  "EC-M": {
    [BARCELONA]: 140,
    [EMELEC]: 115,
    [LIGA]: 20,
    [NACIONAL]: 10,
    [CHACARITA]: 5,
  },
  "EC-S": {
    [NACIONAL]: 10,
    [LIGA]: 8,
    [BARCELONA]: 5,
    [EMELEC]: 1,
    [CHACARITA]: 1,
  },
  "EC-N": {
    [BARCELONA]: 7,
    [LIGA]: 7,
    [NACIONAL]: 4,
    [CHACARITA]: 1,
    [EMELEC]: 1,
  },
  "EC-D": {
    [BARCELONA]: 11,
    [LIGA]: 7,
    [EMELEC]: 4,
    [NACIONAL]: 2,
    [CHACARITA]: 1,
  },
  "EC-Y": { [CHACARITA]: 6, [LIGA]: 4, [NACIONAL]: 3, [BARCELONA]: 2 },
  "EC-P": {
    [LIGA]: 310,
    [NACIONAL]: 225,
    [BARCELONA]: 110,
    [EMELEC]: 50,
    [CHACARITA]: 10,
  },
  "EC-SE": {
    [BARCELONA]: 28,
    [EMELEC]: 18,
    [LIGA]: 2,
    [NACIONAL]: 1,
    [CHACARITA]: 1,
  },
  "EC-SD": {
    [LIGA]: 22,
    [BARCELONA]: 20,
    [NACIONAL]: 10,
    [EMELEC]: 6,
    [CHACARITA]: 2,
  },
  "EC-U": {
    [CHACARITA]: 11,
    [BARCELONA]: 8,
    [LIGA]: 6,
    [EMELEC]: 3,
    [NACIONAL]: 2,
  },
  "EC-T": {
    [CHACARITA]: 34,
    [LIGA]: 20,
    [NACIONAL]: 14,
    [BARCELONA]: 10,
    [EMELEC]: 2,
  },
  "EC-Z": {
    [LIGA]: 6,
    [BARCELONA]: 4,
    [NACIONAL]: 3,
    [EMELEC]: 1,
    [CHACARITA]: 1,
  },
};

export const mockProvinceLeaders = getProvinceLeaders(
  mockProvinceVotes,
  mockClubs,
);
