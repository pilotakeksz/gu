import type { MediaEntry } from "~features/media/types";
export const mediaApi = {
  get: async (): Promise<MediaEntry[]> => {
    const response = await fetch("/data/gallery.json");
    if (!response.ok) throw new Error("The media archive could not be loaded.");
    return response.json() as Promise<MediaEntry[]>;
  },
};
