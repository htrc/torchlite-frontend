import { ReactElement } from 'react';
import { shallowEqual } from 'react-redux';
import { Box, Grid } from '@mui/material';

import Layout from 'layout';
import Page from 'components/Page';
import DashboardHeader from 'layout/MainLayout/DashboardHeader';
import { PublicationTimeLineChart } from 'components/widgets/PublicationTimeLineChart';
// import DataTable from 'components/widgets/ChorloplethMap/DataTable';
import ContributorTable from 'components/widgets/ChorloplethMap/ContributorTable';
import { useDispatch, useSelector } from 'store';
import MyTable from 'components/widgets/ChorloplethMap/DataTable';
import DataTable from 'components/DataTable';

const TimelineWidgetDetails = () => {
  const storedTimelineRangedData = useSelector((state) => state.dashboard.timelineRangedData, shallowEqual);

  const widgetTableData = ['Widget Documentation', 'Results Insights', 'Export as Jupyter Notebook'];
  const mapFilterData = ['Additional Map Filters', 'Filter by Region', 'Filter by '];

  const columns = [
    {
      Header: 'Publication Date',
      accessor: 'date',
      className: 'cell-center'
    },
    {
      Header: 'Count',
      accessor: 'value',
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
                <PublicationTimeLineChart />
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
            <Grid item md={1}></Grid>
            <Grid item xs={12} md={7}>
              <DataTable data={storedTimelineRangedData} columns={columns} title={'Timeline Data'} sort />
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
