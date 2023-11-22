import { useRouter } from 'next/router';
import { ReactElement } from 'react';
import { Box, Grid } from '@mui/material';
import { NextPageContext } from 'next';
import { getProviders, getCsrfToken } from 'next-auth/react';
import Layout from 'layout';
import Page from 'components/Page';
import DashboardHeader from 'layout/MainLayout/DashboardHeader';
import { useSelector } from 'store';
import DataTable from 'components/DataTable';
import { timelineColumns, timelineCSVHeaders } from 'data/react-table';
import CustomBackdrop from 'components/Backdrop';
import useDashboardState from 'hooks/useDashboardState';
import Widget from 'components/widgets';
import NestedList from 'sections/widget-details/NestedList';

const WidgetDetails = ({ csrfToken }: any) => {
  const { loading } = useSelector((state) => state.dashboard);
  const { dashboardState, widgetState } = useDashboardState();
  const router = useRouter();

  if (!dashboardState) {
    return <CustomBackdrop loading={loading} />;
  }

  return (
    <Page title="TORCHLITE Dashboard">
      <Box>
        <Box>
          <DashboardHeader csrfToken={csrfToken} />
          <Grid container spacing={3}>
            <Grid item xs={12} md={9}>
              <Widget dashboardState={dashboardState} widgetType={router.query.widgetType as string} isDetailsPage />
            </Grid>
            <Grid item xs={12} md={3}>
              <NestedList widgetType={router.query.widgetType as string} />
            </Grid>
          </Grid>
        </Box>
        <Box sx={{ marginTop: '2rem' }}>
          <Grid container spacing={3}>
            <Grid item md={1}></Grid>
            <Grid item xs={12} md={7}>
              <DataTable
                data={widgetState[router.query.widgetType as string]?.data ?? []}
                columns={timelineColumns}
                title={'Timeline Data'}
                csvHeaders={timelineCSVHeaders}
                sort
              />
            </Grid>
          </Grid>
        </Box>
      </Box>
      <CustomBackdrop loading={loading} />
    </Page>
  );
};

WidgetDetails.getLayout = function getLayout(page: ReactElement) {
  return <Layout>{page}</Layout>;
};

export async function getServerSideProps(context: NextPageContext) {
  const providers = await getProviders();
  const csrfToken = await getCsrfToken(context);

  return {
    props: { providers, csrfToken: csrfToken ?? null }
  };
}

export default WidgetDetails;
