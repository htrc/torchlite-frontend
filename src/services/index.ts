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
  console.log('updateDashboardState')
  console.log(dashboardId)
  return defaultAxios.patch(`/api/dashboards/${dashboardId}`, body).then((response) => response.data);
}

export async function getAvailableDashboards(dashboardId?: string | null) {
  console.log('getAvailableDashboards')
  console.log(dashboardId)
  return defaultAxios.get(`/api/dashboards${dashboardId ? `?ref=${dashboardId}` : ''}`).then((response) => response.data);
}

export async function getDashboardState(dashboardId: string) {
  console.log('getDashboardState')
  console.log(dashboardId)
  return defaultAxios.get(`/api/dashboards/${dashboardId}`).then((response) => response.data);
}

export async function getWidgetData(dashboardId: any, widgetType: any) {
  return defaultAxios.get(`/api/dashboards/${dashboardId}/widgets/${widgetType}/data`).then((response) => response.data);
}

export async function getWorksetData(dashboardId: any, dataType: string, filtered: boolean = false) {
  return defaultAxios
    .get(`/api/dashboards/${dashboardId}/${dataType}/${filtered}`)
    .then((response) => response.data)
    .catch((error) => {
      console.error('Error fetching workset data:', error);
      throw error;
    });
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
