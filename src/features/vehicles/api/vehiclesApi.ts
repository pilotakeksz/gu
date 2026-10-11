import type { VehicleData } from "~features/vehicles/types";
export const vehiclesApi = {
  get: async (): Promise<VehicleData> => {
    const response = await fetch("/data/vehicles.json");
    if (!response.ok) throw new Error("Vehicle rules could not be loaded.");
    return response.json() as Promise<VehicleData>;
  },
  assets: async (): Promise<Record<string, boolean>> => {
    const response = await fetch("/data/asset-status.json");
    if (!response.ok)
      throw new Error("Vehicle references could not be loaded.");
    return response.json() as Promise<Record<string, boolean>>;
  },
};
