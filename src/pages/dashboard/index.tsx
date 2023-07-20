import { ReactElement, useEffect } from 'react';
import axios from 'axios';
import { Box, Typography, Grid } from '@mui/material';

import Layout from 'layout';
import Page from 'components/Page';
import DashboardHeader from 'layout/MainLayout/DashboardHeader';
import { PublicationTimeLineChart } from 'components/widgets/PublicationTimeLineChart';
import { ChorloplethMap } from 'components/widgets/ChorloplethMap';
import { useDispatch, useSelector } from 'store';
import {
  setSelectedWorkset,
  setSelectedDashboard,
  setDashboards,
  setWorksets,
  setLoading,
  getTimeLineDataSuccess,
  getMapDataSuccess
} from 'store/reducers/dashboard';
import { getDashboards, getCountryCounts, getWorksets, getVolumnsMetadata } from 'services';
import CustomBackdrop from 'components/Backdrop';

const DashboardDefault = () => {
  const dispatch = useDispatch();
  const { selectedWorkset, loading } = useSelector((state) => state.dashboard);

  useEffect(() => {
    Promise.all([getDashboards(), getWorksets()])
      .then((values) => {
        const dashboards: any[] = values[0];
        const worksets: any[] = values[1];

        dispatch(setDashboards(dashboards));
        dispatch(setWorksets(worksets));

        const defaultDashboard = dashboards[0];
        dispatch(setSelectedDashboard(defaultDashboard));

        const selectedWorkset = worksets.filter((item) => item.id === defaultDashboard?.workset)?.[0] ?? null;
        dispatch(setSelectedWorkset(selectedWorkset));
      })
      .catch((err) => {
        console.log(err);
      });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useEffect(() => {
    // Get Publication Timeline widget data
    if (selectedWorkset?.id) {
      getVolumnsMetadata(selectedWorkset?.id).then((data) => {
        dispatch(getTimeLineDataSuccess(data));
        getCountryCounts(data).then((res) => {
          dispatch(getMapDataSuccess(res));
        });
      });
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [selectedWorkset]);

  return (
    <Page title="TORCHLITE Dashboard">
      <Box>
        <Box>
          <Typography variant="h5">TORCHLITE Dashboard</Typography>
        </Box>
        <Box>
          <DashboardHeader />
          <Grid container spacing={3}>
            <Grid item xs={12} md={6}>
              <ChorloplethMap />
            </Grid>
            <Grid item xs={12} md={6}>
              <PublicationTimeLineChart />
            </Grid>
          </Grid>
        </Box>
      </Box>
      <CustomBackdrop loading={loading} />
    </Page>
  );
};

DashboardDefault.getLayout = function getLayout(page: ReactElement) {
  return <Layout>{page}</Layout>;
};

export default DashboardDefault;
