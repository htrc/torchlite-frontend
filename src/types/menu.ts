import { ReactNode } from 'react';

// material-ui
import { ChipProps } from '@mui/material';

import { GenericCardProps } from './root';
import { ITimelineChart } from './chart';

// ==============================|| MENU TYPES  ||============================== //

export type NavItemType = {
  breadcrumbs?: boolean;
  caption?: ReactNode | string;
  children?: NavItemType[];
  elements?: NavItemType[];
  chip?: ChipProps;
  color?: 'primary' | 'secondary' | 'default' | undefined;
  disabled?: boolean;
  external?: boolean;
  icon?: GenericCardProps['iconPrimary'] | string;
  id?: string;
  target?: boolean;
  title?: ReactNode | string;
  type?: string;
  url?: string | undefined;
};

export type LinkTarget = '_blank' | '_self' | '_parent' | '_top';

export type MenuProps = {
  openItem: string[];
  openComponent: string;
  selectedID: string | null;
  drawerOpen: boolean;
  componentDrawerOpen: boolean;
  menuDashboard: NavItemType;
  error: null;
};

export type DashboardProps = {
  worksets: IWorkset[];
  timelineData: ITimelineChart[];
  selectedWorkset: Partial<IWorkset>;
  error: object | string | null;
};

export interface IWorkset {
  name: string;
  creator: string;
  description: string;
}
