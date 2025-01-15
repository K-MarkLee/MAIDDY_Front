
import { ReactNode } from 'react';


export interface SharedLayoutProps {
  children: ReactNode;
  contentClass?: string;
}

export interface NavigationItem {
  icon: any;
  path: string;
  label: string;
}

export interface NavigationItem {
  icon: LucideIcon;
  path: string;
  label: string;
}