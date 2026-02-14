import { CalendarDay } from './types';

export const getFirstDayOfMonth = (date: Date): number => {
  return new Date(date.getFullYear(), date.getMonth(), 1).getDay();
};

export const getDaysInMonth = (date: Date): number => {
  return new Date(date.getFullYear(), date.getMonth() + 1, 0).getDate();
};

export const getDaysInPrevMonth = (date: Date): number => {
  return new Date(date.getFullYear(), date.getMonth(), 0).getDate();
};

export const generateCalendarDays = (currentDate: Date): CalendarDay[] => {
  const firstDayOfMonth = getFirstDayOfMonth(currentDate);
  const daysInMonth = getDaysInMonth(currentDate);
  const daysInPrevMonth = getDaysInPrevMonth(currentDate);

  const prevMonthDays = Array.from({ length: firstDayOfMonth }, (_, i) => ({
    day: daysInPrevMonth - firstDayOfMonth + i + 1,
    isCurrentMonth: false,
  }));

  const currentMonthDays = Array.from({ length: daysInMonth }, (_, i) => ({
    day: i + 1,
    isCurrentMonth: true,
  }));

  const remainingDays = (7 - ((firstDayOfMonth + daysInMonth) % 7)) % 7;
  const nextMonthDays = Array.from({ length: remainingDays }, (_, i) => ({
    day: i + 1,
    isCurrentMonth: false,
  }));

  return [...prevMonthDays, ...currentMonthDays, ...nextMonthDays];
};

export const formatDate = (year: number, month: number, day: number): string => {
  return `${year}-${String(month + 1).padStart(2, '0')}-${String(day).padStart(2, '0')}`;
};