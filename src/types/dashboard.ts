import { ITimelineChart, IMapData } from './chart';

export type IDashboardProps = {
  dashboards: IDashboard[];
  filtering: object;
  worksets: IWorkset[];
  mapData: IMapData[];
  mapRangedData: IMapData[];
  unfilteredData: ITimelineChart[];
  timelineData: ITimelineChart[];
  timelineRangedData: ITimelineChart[];
  selectedWorkset: IWorkset | null;
  selectedDashboard: IDashboard | null;
  tooltipId: string;
  error: object | string | null;
  loading: boolean;
  loadingMap: boolean;
};

export interface IWorkset {
  name: string;
  author: string;
  id: string;
  volumes: number;
  description: string;
  type: string | null;
}

export interface IDashboard {
  id: string;
  workset: string;
  widgets: string[];
}

export interface IFilterKey {
  label: string;
  checked: boolean;
  value: string;
}
