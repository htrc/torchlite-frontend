import { ReactElement } from 'react';
import { shallowEqual } from 'react-redux';
import { Box, Grid } from '@mui/material';

import Layout from 'layout';
import Page from 'components/Page';
import { LanguageChart } from 'components/widgets/LanguageChart';
import { useSelector } from 'store';
import DataTable from 'components/DataTable';
import { languageColumns, languageCSVHeaders } from 'data/react-table';
import DetailsPageHeader from 'layout/MainLayout/DetailsPageHeader';
import NestedList from 'sections/widget-details/NestedList';

const LanguageWidgetDetails = () => {
  const storedLanguageRangedData = useSelector((state) => state.dashboard.languageRangedData, shallowEqual);

  return (
    <Page title="TORCHLITE Dashboard">
      <Box>
        <Box>
          <DetailsPageHeader />
          <Grid container spacing={3}>
            <Grid item xs={12} md={9}>
              <LanguageChart detailPage={true} />
            </Grid>
            <Grid item xs={12} md={3}>
              <NestedList widgetType="language" />
            </Grid>
          </Grid>
        </Box>
        <Box sx={{ marginTop: '2rem' }}>
          <Grid container spacing={3}>
            <Grid item md={1}></Grid>
            <Grid item xs={12} md={7}>
              <DataTable
                data={storedLanguageRangedData}
                columns={languageColumns}
                title={'Language Data'}
                csvHeaders={languageCSVHeaders}
                sort
              />
            </Grid>
          </Grid>
        </Box>
      </Box>
    </Page>
  );
};

LanguageWidgetDetails.getLayout = function getLayout(page: ReactElement) {
  return <Layout>{page}</Layout>;
};

export default LanguageWidgetDetails;
