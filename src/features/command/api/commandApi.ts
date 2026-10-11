import type { CommandTier } from "~features/command/types";
export const commandApi = {
  get: async (): Promise<CommandTier[]> => {
    const response = await fetch("/data/chain.json");
    if (!response.ok)
      throw new Error("The command structure could not be loaded.");
    return response.json() as Promise<CommandTier[]>;
  },
};
