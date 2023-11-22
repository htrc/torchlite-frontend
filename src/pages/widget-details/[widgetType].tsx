import { useRouter } from 'next/router';
import { ReactElement } from 'react';
import { Box, Grid } from '@mui/material';
import { NextPageContext } from 'next';
import { getProviders, getCsrfToken } from 'next-auth/react';
import Layout from 'layout';
import Page from 'components/Page';
import DashboardHeader from 'layout/MainLayout/DashboardHeader';
import DataTable from 'components/DataTable';
import CustomBackdrop from 'components/Backdrop';
import useDashboardState from 'hooks/useDashboardState';
import Widget from 'components/widgets';
import NestedList from 'sections/widget-details/NestedList';
import { CSVHeaders, TableColumns, TableHeader } from 'data/constants';

const WidgetDetails = ({ csrfToken }: any) => {
  const { dashboardState, widgetState } = useDashboardState();
  const router = useRouter();
  const widgetType = router.query.widgetType as string;

  if (!dashboardState) {
    return <CustomBackdrop loading={true} />;
  }

  return (
    <Page title="TORCHLITE Dashboard">
      <Box>
        <Box>
          <DashboardHeader csrfToken={csrfToken} />
          <Grid container spacing={3}>
            <Grid item xs={12} md={9}>
              <Widget dashboardState={dashboardState} widgetType={widgetType} isDetailsPage />
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
                data={widgetState[widgetType]?.data ?? []}
                columns={TableColumns[widgetType]}
                title={TableHeader[widgetType]}
                csvHeaders={CSVHeaders[widgetType]}
                sort
              />
            </Grid>
          </Grid>
        </Box>
      </Box>
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
