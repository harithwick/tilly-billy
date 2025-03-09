export interface RefreshStore {
  refreshTrigger: number;
  triggerRefresh: () => void;
}

export const mapRefreshStore = (raw: any): RefreshStore => ({
  refreshTrigger: raw.refreshTrigger,
  triggerRefresh: raw.triggerRefresh,
});
