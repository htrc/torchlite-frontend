import { ReactElement, useEffect, useState } from 'react';
import { Box, Typography, useTheme } from '@mui/material';
import _ from 'lodash';

import Layout from 'layout';
import Page from 'components/Page';
import MainCard from 'components/MainCard';
import SideBar from 'layout/MainLayout/SideBar';
import DashboardHeader from 'layout/MainLayout/DashboardHeader';
import { PublicationTimeLineChart } from 'components/widgets/PublicationTimeLineChart';
import { useDispatch, useSelector } from 'store';
import { getTimeLineData } from 'store/reducers/dashboard';
import { ITimelineChart } from 'types/chart';

const DashboardDefault = () => {
  const theme = useTheme();
  const { timelineData, selectedWorkset } = useSelector((state) => state.dashboard);
  const [data, setData] = useState<ITimelineChart[]>([]);
  const dispatch = useDispatch();
  useEffect(() => {
    if (!_.isEmpty(selectedWorkset)) {
      setData(() => [...timelineData].filter((item) => item.group === selectedWorkset.name && item.creator === selectedWorkset.creator));
    }
  }, [selectedWorkset, timelineData]);

  useEffect(() => {
    setData(timelineData);
  }, [timelineData]);

  useEffect(() => {
    dispatch(getTimeLineData());
  }, []);

  return (
    <Page title="Dashboard">
      <Box
        sx={{
          display: 'grid',
          gridTemplateColumns: 'repeat(4, 1fr)',
          gap: 2,
          gridTemplateAreas: `"title title title title"
  "sidebar content content content"`
        }}
      >
        <Box sx={{ gridArea: 'title' }}>
          <Typography variant="h5">Dashboard</Typography>
        </Box>
        <Box sx={{ gridArea: 'sidebar' }}>
          <SideBar />
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
                sx={{ mt: 1.5, padding: theme.spacing(4), display: 'flex', flexDirection: 'column', alignItems: 'center' }}
              >
                <Typography variant="h3" sx={{ color: '#1e98d7' }}>
                  Publication Date Timeline
                </Typography>
                <PublicationTimeLineChart data={data} />
              </MainCard>
            </Box>
            <Box sx={{ gridArea: 'pieChart' }}></Box>
          </Box>
        </Box>
      </Box>
    </Page>
  );
};

DashboardDefault.getLayout = function getLayout(page: ReactElement) {
  return <Layout>{page}</Layout>;
};

export default DashboardDefault;
