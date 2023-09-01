import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import { getCountryCounts, getWorksetMetadata, setFeaturedState } from 'services';
// types
import { IDashboardProps } from 'types/dashboard';
import { convertToTimelineChartData } from 'utils/helpers';

// initial state
const initialState: IDashboardProps = {
  dashboards: [],
  worksets: [],
  filtering: {},
  mapData: [],
  mapRangedData: [],
  unfilteredData: [],
  timelineData: [],
  timelineRangedData: [],
  selectedWorksetId: null,
  selectedDashboard: null,
  tooltipId: '',
  error: null,
  loading: false,
  loadingMap: false
};

// ==============================|| SLICE - MENU ||============================== //
const slice = createSlice({
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
    setSelectedWorksetIdSuccess(state, action) {
      state.selectedWorksetId = action.payload;
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
    setTimelineRangedData(state, action) {
      state.timelineRangedData = action.payload;
    },
    setMapRangedData(state, action) {
      state.mapRangedData = action.payload;
    }
  },
  extraReducers: (builder) => {
    builder
      .addCase(setSelectedWorksetId.pending, (state) => {
        state.loading = true;
      })
      .addCase(setSelectedWorksetId.fulfilled, (state, action) => {
        state.loading = false;
      })
      .addCase(setSelectedWorksetId.rejected, (state, action) => {
        state.loading = false;
      });
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
  setSelectedWorksetIdSuccess,
  setTooltipId,
  setSelectedDashboard,
  setWorksets,
  setTimelineRangedData,
  setMapRangedData
} = slice.actions;

export const setSelectedWorksetId = createAsyncThunk<void, string, {}>(
  'dashboard/setSelectedWorksetId',
  async (worksetId, { dispatch, getState }) => {
    try {
      dispatch(setSelectedWorksetIdSuccess(worksetId));

      const featuredState = JSON.parse(localStorage.getItem('featured_state') ?? '{}') ?? {};
      featuredState.worksetId = worksetId;
      await setFeaturedState(JSON.stringify(featuredState));

      localStorage.setItem('featured_state', JSON.stringify(featuredState));

      const response = await getWorksetMetadata(worksetId);
      const data = response.data;

      dispatch(getTimeLineDataSuccess(convertToTimelineChartData(data.data)));
      dispatch(getUnfilteredDataSuccess(data.data));

      const countryCounts = await getCountryCounts(data.data);
      dispatch(getMapDataSuccess(countryCounts));
    } catch (error) {
      console.error(error);
      // throw error;
    }
  }
);

export default slice.reducer;
