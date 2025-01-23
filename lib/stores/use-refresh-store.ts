import { RefreshStore } from "../types/refresh-store";
import { create } from "zustand";

// This is used to refresh all the api calls
export const useRefreshStore = create<RefreshStore>((set) => ({
  refreshTrigger: 0,
  triggerRefresh: () =>
    set((state) => ({ refreshTrigger: state.refreshTrigger + 1 })),
}));
