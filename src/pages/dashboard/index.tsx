import { ReactElement } from 'react';

// material-ui
import { Grid, Typography } from '@mui/material';
// project import
import Layout from 'layout';
import Page from 'components/Page';
import MainCard from 'components/MainCard';
import SideBar from 'layout/MainLayout/SideBar';
import DashboardHeader from 'layout/MainLayout/DashboardHeader';
import PublicationDateTimeLineChart from 'components/widgets/TimelineWidget';
import population from 'data/population';

// ==============================|| DASHBOARD - DEFAULT ||============================== //

const DashboardDefault = () => {
  return (
    <Page title="Default Dashboard">
      <Grid container rowSpacing={4.5} columnSpacing={2.75}>
        <Grid item xs={12} sx={{ mb: -2.25 }}>
          <Typography variant="h5">Dashboard</Typography>
        </Grid>
        <Grid item xs={12}>
          <Grid container rowSpacing={4.5} columnSpacing={2.75}>
            <Grid item xs={12} sm={3}>
              <SideBar />
            </Grid>
            <Grid item xs={12} sm={9}>
              <Grid container direction="column">
                <Grid item xs={2} lg={2}>
                  <DashboardHeader />
                </Grid>
                <Grid item xs={10} lg={10}>
                  <Grid container rowSpacing={3} columnSpacing={3}>
                    <Grid item xs={12} sm={12}>
                      <MainCard content={false} sx={{ mt: 1.5 }}>
                        <PublicationDateTimeLineChart data={population} />
                      </MainCard>
                    </Grid>
                  </Grid>
                </Grid>
              </Grid>
            </Grid>
          </Grid>
        </Grid>
      </Grid>
    </Page>
  );
};

DashboardDefault.getLayout = function getLayout(page: ReactElement) {
  return <Layout>{page}</Layout>;
};

export default DashboardDefault;
