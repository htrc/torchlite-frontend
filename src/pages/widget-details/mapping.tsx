import { ReactElement, useEffect, useMemo } from 'react';
import { shallowEqual } from 'react-redux';
import { Box, Typography, Grid } from '@mui/material';

import Layout from 'layout';
import Page from 'components/Page';
import DashboardHeader from 'layout/MainLayout/DashboardHeader';
import { PublicationTimeLineChart } from 'components/widgets/PublicationTimeLineChart';
import { ChorloplethMap } from 'components/widgets/ChorloplethMap';
// import DataTable from 'components/widgets/ChorloplethMap/DataTable';
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
import DataTable from 'components/DataTable';
import { transformMapDataForDataTable } from 'utils/helpers';

const MapWidget = () => {
  const dispatch = useDispatch();
  const storedMapRangedData = useSelector((state) => state.dashboard.mapRangedData, shallowEqual);
  const data = transformMapDataForDataTable(storedMapRangedData);

  const widgetTableData = ['Widget Documentation', 'Results Insights', 'Export as Jupyter Notebook'];
  const mapFilterData = ['Additional Map Filters', 'Filter by Region', 'Filter by '];

  const columns = [
    {
      Header: 'Country ISO',
      accessor: 'countryISO',
      className: 'cell-center'
    },
    {
      Header: 'City',
      accessor: 'city',
      className: 'cell-center'
    },
    {
      Header: 'Latitude',
      accessor: 'latitude',
      className: 'cell-center'
    },
    {
      Header: 'Longitude',
      accessor: 'longitude',
      className: 'cell-center'
    },
    {
      Header: 'Year of Birth',
      accessor: 'yob',
      className: 'cell-center'
    }
  ];

  return (
    <Page title="TORCHLITE Dashboard">
      <Box>
        <Box>
          <DashboardHeader />
          <Grid container spacing={3}>
            <Grid item xs={12} md={9}>
              <Box sx={{ padding: '2rem' }}>
                <ChorloplethMap />
              </Box>
            </Grid>
            <Grid item xs={12} md={3}>
              {/* <DataTable data={widgetTableData} type="widget" title="Widget Info Links"/> */}
              {/* <MyTable data={data} /> */}
            </Grid>
          </Grid>
        </Box>
        <Box>
          <Grid container spacing={3}>
            <Grid item xs={12} md={9}>
              {/* <ContributorTable data={unfilteredData} /> */}
              <DataTable data={data} columns={columns} title={'Contributor Data'} sort />
            </Grid>
          </Grid>
        </Box>
      </Box>
    </Page>
  );
};

MapWidget.getLayout = function getLayout(page: ReactElement) {
  return <Layout>{page}</Layout>;
};

export default MapWidget;
