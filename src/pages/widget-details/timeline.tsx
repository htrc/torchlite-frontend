import { ReactElement } from 'react';
import { shallowEqual } from 'react-redux';
import { Box, Grid } from '@mui/material';

import Layout from 'layout';
import Page from 'components/Page';
import { PublicationTimeLineChart } from 'components/widgets/PublicationTimeLineChart';
import { useSelector } from 'store';
import DataTable from 'components/DataTable';
import { timelineColumns, timelineCSVHeaders } from 'data/react-table';
import DetailsPageHeader from 'layout/MainLayout/DetailsPageHeader';
import NestedList from 'sections/widget-details/NestedList';

const TimelineWidgetDetails = () => {
  const storedTimelineRangedData = useSelector((state) => state.dashboard.timelineRangedData, shallowEqual);

  return (
    <Page title="TORCHLITE Dashboard">
      <Box>
        <Box>
          <DetailsPageHeader />
          <Grid container spacing={3}>
            <Grid item xs={12} md={9}>
              <PublicationTimeLineChart hideDownload={false} />
            </Grid>
            <Grid item xs={12} md={3}>
              <NestedList />
            </Grid>
          </Grid>
        </Box>
        <Box sx={{ marginTop: '2rem' }}>
          <Grid container spacing={3}>
            <Grid item md={1}></Grid>
            <Grid item xs={12} md={7}>
              <DataTable
                data={storedTimelineRangedData}
                columns={timelineColumns}
                title={'Timeline Data'}
                csvHeaders={timelineCSVHeaders}
                sort
              />
            </Grid>
          </Grid>
        </Box>
      </Box>
    </Page>
  );
};

TimelineWidgetDetails.getLayout = function getLayout(page: ReactElement) {
  return <Layout>{page}</Layout>;
};

export default TimelineWidgetDetails;
