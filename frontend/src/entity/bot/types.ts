export interface IBot {
  id: number;
  order: number;
  slug: string;
  title: string;
  disabled?: boolean;
}

export interface IBotStatisticsItem {
  id: number;
  name: string;
  progress: number;
  value: number;
  maxValue: number;
  unit?: string;
}
