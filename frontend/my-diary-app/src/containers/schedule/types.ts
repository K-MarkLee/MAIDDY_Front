export interface Schedule {
  id: number;
  title: string;
  content?: string;
  time: string;
  select_date: string;
  pinned: boolean;
  user?: string;
}

export interface ScheduleDetailProps {
  schedule: Schedule;
  onUpdate: (id: number, updatedData: Partial<Schedule>) => void;
}

export interface AddScheduleModalProps {
  isOpen: boolean;
  onClose: () => void;
  onAdd: (schedule: Omit<Schedule, 'id' | 'pinned' | 'user'>) => void;
  date: string;
}

export interface ScheduleCardProps {
  schedule: Schedule;
  onDelete: (id: number) => void;
  onTogglePin: (id: number) => void;
  onUpdate: (id: number, updatedData: Partial<Schedule>) => void;
}

