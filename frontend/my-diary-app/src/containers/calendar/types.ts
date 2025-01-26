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

export interface PinnedSchedule {
  id: number;
  title: string;
  is_completed: boolean;
  date: string;
  time: string;
  pinned: boolean;
}