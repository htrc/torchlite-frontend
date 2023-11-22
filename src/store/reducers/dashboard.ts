import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
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
  worksetMetadata: [],
  filteredWorksetMetadata: [],
  appliedFilters: {},
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
    getWorksetMetadataSuccess(state, action) {
      state.worksetMetadata = action.payload;
    },
    getTimeLineDataSuccess(state, action) {
      state.timelineData = action.payload;
    },
    setSelectedWorksetIdSuccess(state, action) {
      state.selectedWorksetId = action.payload;
    },
    setAppliedFiltersSuccess(state, action) {
      state.appliedFilters = action.payload;
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
    },
    setFilteredWorksetMetadata(state, action) {
      state.filteredWorksetMetadata = action.payload;
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
  getWorksetMetadataSuccess,
  getTimeLineDataSuccess,
  setDashboards,
  setLoading,
  setLoadingMap,
  setSelectedWorksetIdSuccess,
  setAppliedFiltersSuccess,
  setTooltipId,
  setSelectedDashboard,
  setWorksets,
  setTimelineRangedData,
  setMapRangedData,
  setFilteredWorksetMetadata
} = slice.actions;

export const setAppliedFilters = createAsyncThunk<void, object, {}>(
  'dashboard/setAppliedFilters',
  async (appliedFilters, { dispatch, getState }) => {
    try {
    } catch (error) {
      console.error(error);
      // throw error;
    }
  }
);

export const setSelectedWorksetId = createAsyncThunk<void, string, {}>(
  'dashboard/setSelectedWorksetId',
  async (worksetId, { dispatch, getState }) => {
    try {
    } catch (error) {
      console.error(error);
      // throw error;
    }
  }
);

export default slice.reducer;
