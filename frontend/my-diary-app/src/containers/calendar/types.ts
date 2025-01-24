export interface DiaryData {
  title: string;
  content: string;
  select_date: string;
  id?: string;
}

export interface AiCommentProps {
  params: {
    date: string;
  };
}

export interface CalendarDay {
  day: number;
  isCurrentMonth: boolean;
}