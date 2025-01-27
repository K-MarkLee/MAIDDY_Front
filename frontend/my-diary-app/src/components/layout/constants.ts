import { Home, CalendarIcon, PenSquare, MessageCircle } from 'lucide-react';

export const NAVIGATION_ITEMS: NavigationItem[] = [
  { icon: Home, path: '/login', label: 'Login' },
  { icon: CalendarIcon, path: '/calendar', label: 'Calendar' },
  { icon: PenSquare, path: '/todo', label: 'To Do' },
  { icon: MessageCircle, path: '/chatbot', label: 'Chat' },
];
