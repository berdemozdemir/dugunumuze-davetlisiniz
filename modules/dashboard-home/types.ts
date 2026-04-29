export type DashboardEventListItem = {
  id: string;
  slug: string;
  templateName: string;
  primaryName: string;
  secondaryName?: string;
  dateTime: Date;
  publishedAt?: Date;
  createdAt: Date;
};
