export interface DiaryData {
  id?: number;
  title?: string;
  content: string;
  select_date: string;
  user?: string;
}

export interface DiaryProps {
  date: string;
}
