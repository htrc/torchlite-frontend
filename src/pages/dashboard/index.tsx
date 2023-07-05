import { ReactElement, useEffect } from 'react';
import axios from 'axios';
import { Box, Typography } from '@mui/material';

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
import { getDashboards, getMapWidgetData, getTimeLineData, getWorksets } from 'services';
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
    getTimeLineData().then((data) => {
      dispatch(getTimeLineDataSuccess(data.data));
    });

    getMapWidgetData(selectedWorkset?.id).then((data) => {
      dispatch(getMapDataSuccess(data));
    });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [selectedWorkset]);

  return (
    <Page title="TORCHLITE Dashboard">
      <Box
        sx={{
          display: 'grid',
          gridTemplateColumns: 'repeat(1, 1fr)',
          gap: 2,
          gridTemplateAreas: `"title"
  " content"`
        }}
      >
        <Box sx={{ gridArea: 'title' }}>
          <Typography variant="h5">TORCHLITE Dashboard</Typography>
        </Box>
        <Box sx={{ gridArea: 'content' }}>
          <DashboardHeader />
          <Box
            sx={{
              display: 'grid',
              gridTemplateColumns: '1fr 1fr',
              gridTemplateRows: '1fr 1fr',
              gap: 2,
              gridTemplateAreas: `
                "map timeline"
                "pie ."
              `
            }}
          >
            <Box
              sx={{
                gridArea: 'map'
              }}
            >
              <ChorloplethMap />
            </Box>
            <Box
              sx={{
                gridArea: 'timeline'
              }}
            >
              <PublicationTimeLineChart />
            </Box>
            <Box sx={{ gridArea: 'pie' }}></Box>
          </Box>
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
