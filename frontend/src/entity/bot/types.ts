export interface IBot {
  id: number;
  order: number;
  slug: string;
  title: string;
  disabled?: boolean;
}

export interface IBotStatisticsItem {
    name: string;
    title: string;
    percent: number;
    comment: string;
}