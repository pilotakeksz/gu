import type { PolicySection } from "~features/handbook/types";
export const handbookApi = {
  get: async (): Promise<PolicySection[]> => {
    const response = await fetch("/data/handbook.json");
    if (!response.ok) throw new Error("The handbook could not be loaded.");
    return response.json() as Promise<PolicySection[]>;
  },
};
