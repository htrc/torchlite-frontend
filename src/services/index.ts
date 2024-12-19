import defaultAxios from 'axios';
import idpList from 'data/idplist.json';
import { DashboardStatePatch } from 'types/torchlite';

/**
 * Get Available Worksets
 * Retrieves the public or public + private worksets, depending on authentication status
 *
 * @returns WorksetSummary[]
 */
export async function getAvailableWorksets() {
  return defaultAxios.get(`/api/worksets`).then((response) => response.data);
}

export async function updateDashboardState(dashboardId: string, body: DashboardStatePatch) {
  return defaultAxios.patch(`/api/dashboards/${dashboardId}`, body).then((response) => response.data);
}

export async function getAvailableDashboards(dashboardId?: string | null) {
  return defaultAxios.get(`/api/dashboards${dashboardId ? `?ref=${dashboardId}` : ''}`).then((response) => response.data);
}

export async function getDashboardState(dashboardId: string) {
  return defaultAxios.get(`/api/dashboards/${dashboardId}`).then((response) => response.data);
}

export async function getWidgetData(dashboardId: any, widgetType: any) {
  return defaultAxios.get(`/api/dashboards/${dashboardId}/widgets/${widgetType}/data`).then((response) => response.data);
}

export async function getStopwordsData(dashboardId: string, language: string) {
  return defaultAxios.get(`/api/dashboards/${dashboardId}/stopwords/${language}`).then((response) => response.data);
}

export async function uploadStopwordsData(dashboardId: string, formdata: FormData) {
  return defaultAxios.post(`/api/dashboards/${dashboardId}/stopwords`, formdata).then((response) => response.data);
}

export async function getIdplist() {
  return defaultAxios
    .get('https://analytics.hathitrust.org/idplist')
    .then((response) => {
      return response.data;
    })
    .catch((error) => {
      console.error('Error fetching remote data:', error);

      // If there's an error, load the local JSON file as a fallback
      return idpList;
    });
}
