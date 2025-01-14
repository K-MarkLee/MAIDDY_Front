export interface Schedule {
  id: number;
  title: string;
  content: string;
  time: string;
  select_date: string;
  is_pinned: boolean;
}

export interface CalendarDay {
  day: number;
  isCurrentMonth: boolean;
  pinnedSchedules?: Schedule[];
}
