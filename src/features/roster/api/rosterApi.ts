import type { Trooper } from "~features/roster/types";
export const rosterApi = {
  get: async (): Promise<Trooper[]> => {
    const response = await fetch("/data/roster.json");
    if (!response.ok) throw new Error("The roster could not be loaded.");
    return response.json() as Promise<Trooper[]>;
  },
};
