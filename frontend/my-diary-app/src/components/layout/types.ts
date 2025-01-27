import { ReactNode } from 'react';
import { LucideIcon } from 'lucide-react';

export interface SharedLayoutProps {
  children: ReactNode;
  contentClass?: string;
}

export interface NavigationItem {
  icon: LucideIcon;
  path: string;
  label: string;
}