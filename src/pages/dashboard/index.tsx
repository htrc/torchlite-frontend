import { ReactElement, useEffect } from 'react';
import axios from 'axios';
import { Box, Typography, useTheme } from '@mui/material';

import Layout from 'layout';
import Page from 'components/Page';
import MainCard from 'components/MainCard';
import DashboardHeader from 'layout/MainLayout/DashboardHeader';
import { PublicationTimeLineChart } from 'components/widgets/PublicationTimeLineChart';
import { useDispatch, useSelector } from 'store';
import {
  setSelectedWorkset,
  setSelectedDashboard,
  setDashboards,
  setWorksets,
  setLoading,
  getTimeLineDataSuccess
} from 'store/reducers/dashboard';
import { getDashboards, getTimeLineData, getWorksets } from 'services';
import CustomBackdrop from 'components/Backdrop';

const DashboardDefault = () => {
  const theme = useTheme();
  const dispatch = useDispatch();
  const { selectedDashboard, loading } = useSelector((state) => state.dashboard);

  useEffect(() => {
    dispatch(setLoading(true));
    if (selectedDashboard) {
      getTimeLineData(selectedDashboard).then((data) => {
        // dispatch(getTimeLineDataSuccess(data));
        // dispatch(setLoading(false));
      });

      // mock implementation
      axios.get('/api/dashboard/publicationDateTimeLine').then((data) => {
        const timeLineData = data.data.filter((item: any) => item.worksetId === selectedDashboard.workset);
        dispatch(getTimeLineDataSuccess(timeLineData));
        dispatch(setLoading(false));
      });
    }
  }, [selectedDashboard]);

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

  return (
    <Page title="Dashboard">
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
          <Typography variant="h5">Dashboard</Typography>
        </Box>
        <Box sx={{ gridArea: 'content' }}>
          <DashboardHeader />
          <Box
            sx={{
              display: 'grid',
              gridTemplateColumns: 'repeat(2, 1fr)',
              gap: 2,
              gridTemplateAreas: `"equalEarth timeLineChart"
  "pieChart ."`
            }}
          >
            <Box
              sx={{
                gridArea: 'equalEarth'
              }}
            ></Box>
            <Box
              sx={{
                gridArea: 'timeLineChart'
              }}
            >
              <MainCard
                content={false}
                sx={{
                  mt: 1.5,
                  padding: theme.spacing(4),
                  display: 'flex',
                  flexDirection: 'column',
                  alignItems: 'center',
                  position: 'relative'
                }}
              >
                <Typography variant="h3" sx={{ color: '#1e98d7' }}>
                  Publication Date Timeline
                </Typography>
                <PublicationTimeLineChart />
              </MainCard>
            </Box>
            <Box sx={{ gridArea: 'pieChart' }}></Box>
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
