import type {
  AccessibleVehicle,
  RankSection,
  VehicleConfig,
  VehicleData,
  VehicleReference,
} from "~features/vehicles/types";
export function accessibleVehicles(
  data: VehicleData,
  section: RankSection,
): AccessibleVehicle[] {
  const seen = new Set<string>();
  const result: AccessibleVehicle[] = [];
  // The published guide gives a more senior vehicle override precedence.
  for (const rank of data.ranks) {
    if (rank.order <= section.order)
      for (const car of rank.cars) {
        if (!seen.has(car.name)) {
          seen.add(car.name);
          result.push({ car, section: rank });
        }
      }
  }
  return result;
}
export function resolveVehicle(
  data: VehicleData,
  item: AccessibleVehicle,
): VehicleConfig {
  return {
    ...data.tiers[item.section.tier],
    ...item.section.custom,
    ...item.car,
  };
}
export function referenceImages(
  data: VehicleData,
  selectedSection: RankSection,
  carName: string,
  status: Record<string, boolean>,
): VehicleReference[] {
  const slug = carName
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "");
  const storage = data.ranks
    .toSorted((a, b) => a.order - b.order)
    .find((s) => s.cars.some((c) => c.name === carName));
  const suffix =
    storage?.id === "LR" && selectedSection.id !== "LR" ? "-higher" : "";
  const folder = `assets/views/${storage?.id ?? selectedSection.id}/${slug}${suffix}`;
  return ["left", "front", "right", "back", "top"].map((angle) => ({
    src: `/${folder}/${angle}.webp`,
    label: angle.toUpperCase(),
    available: status[`${folder}/${angle}.png`] === true,
  }));
}
