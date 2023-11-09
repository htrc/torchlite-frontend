import { ReactElement } from 'react';
import { Box, Grid } from '@mui/material';

import { NextPageContext } from 'next';
import { getProviders, getCsrfToken } from 'next-auth/react';
import Layout from 'layout';
import Page from 'components/Page';
import DashboardHeader from 'layout/MainLayout/DashboardHeader';
import { PublicationTimeLineChart } from 'components/widgets/PublicationTimeLineChart';
import { ChorloplethMap } from 'components/widgets/ChorloplethMap';
import { useSelector } from 'store';
import CustomBackdrop from 'components/Backdrop';

const DashboardDefault = ({ csrfToken }: any) => {
  const { loading } = useSelector((state) => state.dashboard);

  return (
    <Page title="TORCHLITE Dashboard">
      <Box>
        <Box>
          <DashboardHeader csrfToken={csrfToken} />
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

export async function getServerSideProps(context: NextPageContext) {
  const providers = await getProviders();
  const csrfToken = await getCsrfToken(context);

  return {
    props: { providers, csrfToken }
  };
}

export default DashboardDefault;
