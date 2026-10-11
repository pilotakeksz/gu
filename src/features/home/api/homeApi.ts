import type { HomeStatement } from "~features/home/types";
export const homeApi = {
  get: async (): Promise<HomeStatement[]> => {
    const response = await fetch("/data/home.json");
    if (!response.ok) throw new Error("The unit overview could not be loaded.");
    return response.json() as Promise<HomeStatement[]>;
  },
};
