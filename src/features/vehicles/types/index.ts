/** Published vehicle configuration with per-car overrides. */
export interface VehicleConfig {
  name?: string;
  cls?: string;
  lightbar?: string;
  decals?: string[];
  requiredLighting?: string[];
  optionalLighting?: string[];
  requiredAccessories?: string[];
  optionalAccessories?: string[];
  antennas?: string[];
  notes?: string[];
  placeholder?: boolean;
  showWarning?: boolean;
  showGallery?: boolean;
}
export interface Vehicle extends VehicleConfig {
  name: string;
  cls: string;
}
export interface RankSection {
  id: string;
  title: string;
  short: string;
  order: number;
  intro: string;
  tier: string;
  cars: Vehicle[];
  custom?: VehicleConfig;
}
export interface SubdivisionRank {
  name: string;
  cars: string[];
  lighting: string[];
  accessories: string[];
  decals: string[];
}
export interface SubdivisionGuide {
  ranks: SubdivisionRank[];
  antennas: string[];
  note: string;
}
export type DivisionId = "REGULAR" | "HSPU" | "SRT";
export interface VehicleData {
  tiers: Record<string, VehicleConfig>;
  ranks: RankSection[];
  divisions: {
    id: DivisionId;
    title: string;
    intro: string;
    separate: boolean;
  }[];
  separate: Record<"HSPU" | "SRT", SubdivisionGuide>;
}
export interface AccessibleVehicle {
  car: Vehicle;
  section: RankSection;
}
export interface VehicleReference {
  src: string;
  label: string;
  available: boolean;
}
