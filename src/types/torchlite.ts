import { z } from 'zod';
import { toZod } from 'tozod';

type VolumeMetadata = {
  htid: string; // the HathiTrust volume identifier
  title: string; // the volume title
  pubDate?: number; // the publication date
  genre: string | string[]; // one or more genre categories
  typeOfResource?: string; // the type of resource
  category?: string | string[]; // one or more categories
  contributor?: string | string[]; // one or more contributors
  publisher?: string | string[]; // one or more publishers
  accessRights: string; // the volume access rights
  pubPlace?: string | string[]; // the place of publication
  language?: string | string[]; // one or more languages
  sourceInstitution: string; // the source institution code
};

export type WorksetSummary = {
  id: string; // the workset identifier
  name: string; // the workset name
  description?: string; // the (optional) workset description
  author: string; // the workset author
  isPublic: boolean; // whether the workset is public or not
  numVolumes: number; // the number of volumes in the workset
};

export type WorksetInfo = WorksetSummary & {
  volumes: VolumeMetadata[]; // list of volume metadata for each volume in the workset
};

export type FilterSettings = {
  titles?: string[];
  pubDates?: number[];
  genres?: string[];
  typesOfResources?: string[];
  categories?: string[];
  contributors?: string[];
  publishers?: string[];
  accessRights?: string[];
  pubPlaces?: string[];
  languages?: string[];
  sourceInstitutions?: string[];
};

export type Widget = {
  type: string; // the widget type (PubDateTimeline, ContributorMap, ...)
};

export type DashboardSummary = {
  id: string; // the unique dashboard identifier
  owner?: string; // the dashboard owner (or undefined if anonymous)
  // title: string; // the dashboard title
  // description?: string; // (optional) the dashboard description
  worksetId: string; // the selected workset id
  filters: FilterSettings; // the filter selections for the dashboard
  widgets: Widget[]; // the widgets selected for the dashboard
  isShared: boolean; // whether the dashboard has been shared or not
};

export type DashboardState = DashboardSummary & {
  worksetInfo: WorksetInfo; // details about the selected workset
};

export type DashboardStatePatch = {
  worksetId?: string;
  filters?: FilterSettings;
  widgets?: Widget[];
  isShared?: boolean;
};

export const DashboardStatePatchSchema: toZod<DashboardStatePatch> = z.object({
  worksetId: z.string().optional(),
  filters: z
    .object({
      titles: z.string().array().optional(),
      pubDates: z.number().array().optional(),
      genres: z.string().array().optional(),
      typesOfResources: z.string().array().optional(),
      categories: z.string().array().optional(),
      contributors: z.string().array().optional(),
      publishers: z.string().array().optional(),
      accessRights: z.string().array().optional(),
      pubPlaces: z.string().array().optional(),
      languages: z.string().array().optional(),
      sourceInstitutions: z.string().array().optional()
    })
    .optional(),
  widgets: z
    .object({
      type: z.string()
    })
    .array()
    .optional(),
  isShared: z.boolean().optional()
});

export type DashboardContextProps = {
  dashboardState?: DashboardState;
  onChangeMode: () => void;
  onChangeMenuOrientation: () => void;
  onChangeMiniDrawer: () => void;
};
