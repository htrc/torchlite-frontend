import axios from 'utils/axios';

export function confirmWorkset(dashboard_id: string, selected_workset_id: string) {
  return axios.put(`/dashboards/${dashboard_id}/workset/${selected_workset_id}`);
}

export function getDashboards() {
  return axios.get(`/dashboards`);
}

export function getWorksets() {
  return axios.get(`/worksets`);
}

export function getTimeLineData(dashboard: any) {
  return axios.get(`/dashboards/${dashboard.id}/widget/${'default_widget'}/data`);
}