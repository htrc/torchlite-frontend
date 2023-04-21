import { createSlice } from '@reduxjs/toolkit';

// project import
import axios from 'utils/axios';

import { dispatch } from '../index';

// types
import { DashboardProps } from 'types/menu';

// initial state
const initialState: DashboardProps = {
  worksets: [],
  timelineData: [],
  selectedWorkset: {},
  error: null
};

// ==============================|| SLICE - MENU ||============================== //
const dashboard = createSlice({
  name: 'dashboard',
  initialState,
  reducers: {
    hasError(state, action) {
      state.error = action.payload;
    },
    getWorksetSuccess(state, action) {
      state.worksets = action.payload;
    },
    getTimeLineDataSuccess(state, action) {
      state.timelineData = action.payload;
    },
    setSelectedWorkset(state, action) {
      state.selectedWorkset = action.payload
    }
  }
});
export const { getTimeLineDataSuccess, setSelectedWorkset } = dashboard.actions;
export default dashboard.reducer;

export function getWorksets(query: string) {
  return async () => {
    try {
      const response = await axios.get('/api/dashboard/workset', { params: { query } });
      dispatch(dashboard.actions.getWorksetSuccess(response.data));
    } catch (error) {
      dispatch(dashboard.actions.hasError(error));
    }
  };
}

export function getTimeLineData(query?: string) {
  return async () => {
    try {
      const response = await axios.get('/api/dashboard/publicationDateTimeLine', { params: { query } });
      dispatch(dashboard.actions.getTimeLineDataSuccess(response.data));
    } catch (error) {
      dispatch(dashboard.actions.hasError(error));
    }
  };
}
