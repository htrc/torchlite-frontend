import { ITimelineChart, IMapData } from './chart';
import { WorksetInfo } from './torchlite';

export type IDashboardProps = {
  dashboards: IDashboard[];
  filtering: object;
  worksets: WorksetInfo[];
  mapData: IMapData[];
  mapRangedData: IMapData[];
  worksetMetadata: ITimelineChart[];
  filteredWorksetMetadata: ITimelineChart[];
  appliedFilters: object | null;
  timelineData: ITimelineChart[];
  timelineRangedData: ITimelineChart[];
  selectedWorksetId: string | null;
  selectedDashboard: IDashboard | null;
  tooltipId: string;
  error: object | string | null;
  loading: boolean;
  loadingMap: boolean;
  dataCleaning: string | null;
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
