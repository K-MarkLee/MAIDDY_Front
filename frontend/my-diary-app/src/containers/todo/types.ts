export interface TodoItem {
  id: number;
  content: string;
  is_completed: boolean;
  select_date: string;
  user?: string;
  created_at?: string;
}

export interface TodoProps {
  date: string;
}
