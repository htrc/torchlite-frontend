import { createSlice } from '@reduxjs/toolkit';
// types
import { IDashboardProps } from 'types/dashboard';

// initial state
const initialState: IDashboardProps = {
  dashboards: [],
  worksets: [],
  filtering: {},
  mapData: [],
  unfilteredData: [],
  timelineData: [],
  selectedWorkset: null,
  selectedDashboard: null,
  tooltipId: '',
  error: null,
  loading: false,
  loadingMap: false,
};

// ==============================|| SLICE - MENU ||============================== //
const dashboard = createSlice({
  name: 'dashboard',
  initialState,
  reducers: {
    hasError(state, action) {
      state.error = action.payload;
    },
    setDashboards(state, action) {
      state.dashboards = action.payload;
    },
    setWorksets(state, action) {
      state.worksets = action.payload;
    },
    getMapDataSuccess(state, action) {
      state.mapData = action.payload;
    },
    getUnfilteredDataSuccess(state, action) {
      state.unfilteredData = action.payload;
    },
    getTimeLineDataSuccess(state, action) {
      state.timelineData = action.payload;
    },
    setSelectedWorkset(state, action) {
      state.selectedWorkset = action.payload;
    },
    setSelectedDashboard(state, action) {
      state.selectedDashboard = action.payload;
    },
    setTooltipId(state, action) {
      state.tooltipId = action.payload;
    },
    setLoading(state, action) {
      state.loading = action.payload;
    },
    setLoadingMap(state, action) {
      state.loading = action.payload;
    },
  }
});
export const {
  hasError,
  getMapDataSuccess,
  getUnfilteredDataSuccess,
  getTimeLineDataSuccess,
  setDashboards,
  setLoading,
  setLoadingMap,
  setSelectedWorkset,
  setTooltipId,
  setSelectedDashboard,
  setWorksets,
} = dashboard.actions;
export default dashboard.reducer;
