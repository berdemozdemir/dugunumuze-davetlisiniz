/** `orpc_weddings_listMine` yanıtındaki tek kayıt (UI için). */
export type DashboardWeddingListItem = {
  id: string;
  slug: string;
  partner1Name: string;
  partner2Name: string;
  dateTime: Date;
  publishedAt: Date | null;
  createdAt: Date;
};
