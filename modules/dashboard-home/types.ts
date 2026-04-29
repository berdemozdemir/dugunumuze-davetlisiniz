export type DashboardEventListItem = {
  id: string;
  slug: string;
  primaryName: string;
  secondaryName?: string;
  dateTime: Date;
  publishedAt?: Date;
  createdAt: Date;
};
