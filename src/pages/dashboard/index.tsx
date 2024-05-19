import { ReactElement } from 'react';
import { Box, Grid } from '@mui/material';
import { NextPageContext } from 'next';
import { getProviders, getCsrfToken } from 'next-auth/react';
import { WidgetType } from 'data/constants';
import Layout from 'layout';
import Page from 'components/Page';
import DashboardHeader from 'layout/MainLayout/DashboardHeader';
import useDashboardState from 'hooks/useDashboardState';
import Widget from 'components/widgets';

const DashboardDefault = ({ csrfToken }: any) => {
  const { dashboardState } = useDashboardState();

  return (
    <Page title="TORCHLITE Dashboard">
      <Box>
        <Box>
          <DashboardHeader csrfToken={csrfToken} />
          <Grid container spacing={3}>
            {Array.from(new Map(dashboardState?.widgets?.map(obj => [`${obj.type}`, obj])).values())?.map((widget, index) => {
              if (widget.type in WidgetType && dashboardState) {
                return (
                  <Grid item xs={12} md={6} key={index}>
                    <Widget dashboardState={dashboardState} widgetType={widget.type} />
                  </Grid>
                );
              }
            })}
          </Grid>
        </Box>
      </Box>
    </Page>
  );
};

DashboardDefault.getLayout = function getLayout(page: ReactElement) {
  return <Layout>{page}</Layout>;
};

export async function getServerSideProps(context: NextPageContext) {
  const providers = await getProviders();
  const csrfToken = await getCsrfToken(context);

  return {
    props: { providers, csrfToken: csrfToken ?? null }
  };
}

export default DashboardDefault;
