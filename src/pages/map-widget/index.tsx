import { ReactElement, useEffect, useMemo } from 'react';
import axios from 'axios';
import { Box, Typography, Grid } from '@mui/material';

import Layout from 'layout';
import Page from 'components/Page';
import DashboardHeader from 'layout/MainLayout/DashboardHeader';
import { PublicationTimeLineChart } from 'components/widgets/PublicationTimeLineChart';
import { ChorloplethMap } from 'components/widgets/ChorloplethMap';
import DataTable from 'components/widgets/ChorloplethMap/DataTable';
import ContributorTable from 'components/widgets/ChorloplethMap/ContributorTable';
import { useDispatch, useSelector } from 'store';
import {
  setSelectedWorkset,
  setSelectedDashboard,
  setDashboards,
  setWorksets,
  setLoading,
  getTimeLineDataSuccess,
  getMapDataSuccess, getUnfilteredDataSuccess
} from 'store/reducers/dashboard';
import { getDashboards, getCountryCounts, getWorksets, getVolumnsMetadata } from 'services';
import CustomBackdrop from 'components/Backdrop';
import MyTable from 'components/widgets/ChorloplethMap/DataTable';

const MapWidget = () => {
  const dispatch = useDispatch();
  const { selectedWorkset, unfilteredData, loading } = useSelector((state) => state.dashboard);

  console.log(selectedWorkset, unfilteredData);
  useEffect(() => {
    dispatch(setSelectedWorkset(selectedWorkset));
    dispatch(getUnfilteredDataSuccess(unfilteredData));
    getCountryCounts(unfilteredData).then((res) => {
      dispatch(getMapDataSuccess(res));
    });
  }, [selectedWorkset, unfilteredData]);

  const widgetTableData = ['Widget Documentation', 'Results Insights', 'Export as Jupyter Notebook'];
  const mapFilterData = ['Additional Map Filters', 'Filter by Region', 'Filter by '];

  const data = useMemo(() => [
    { countryISO: 'US', city: 'New York', latitude: '40.730610', longitude: '-73.935242', yearOfBirth: '1990' },
    // ... more data
], []);

  return (
    <Page title="TORCHLITE Dashboard">
      <Box>
        <Box>
          <Typography variant="h5">Mapping Contributor Data</Typography>
        </Box>
        <Box>
          <DashboardHeader />
          <Grid container spacing={3}>
            <Grid item xs={12} md={9}>
              <ChorloplethMap />
            </Grid>
            <Grid item xs={12} md={3}>
              <DataTable data={widgetTableData} type="widget" title="Widget Info Links"/>
              {/* <MyTable data={data} /> */}
            </Grid>
          </Grid>
        </Box>
        <Box>
          <Grid container spacing={3}>
            <Grid item xs={12} md={2} >
              <DataTable data={mapFilterData} type="mapFilter"/>
            </Grid>
            <Grid item xs={12} md={6}>
              <ContributorTable data={unfilteredData} />
            </Grid>
          </Grid>
        </Box>
      </Box>
      <CustomBackdrop loading={loading} />
    </Page>
  );
};

MapWidget.getLayout = function getLayout(page: ReactElement) {
  return <Layout>{page}</Layout>;
};

export default MapWidget;
