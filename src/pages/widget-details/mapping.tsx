import { ReactElement } from 'react';
import { shallowEqual } from 'react-redux';
import { Box, Grid } from '@mui/material';

import Layout from 'layout';
import Page from 'components/Page';
import { ChorloplethMap } from 'components/widgets/ChorloplethMap';
import { useSelector } from 'store';
import DataTable from 'components/DataTable';
import { transformMapDataForDataTable } from 'utils/helpers';
import { mapColumns, mapCSVHeaders } from 'data/react-table';
import DetailsPageHeader from 'layout/MainLayout/DetailsPageHeader';

const MapWidget = () => {
  const storedMapRangedData = useSelector((state) => state.dashboard.mapRangedData, shallowEqual);
  const data = transformMapDataForDataTable(storedMapRangedData);

  const widgetTableData = ['Widget Documentation', 'Results Insights', 'Export as Jupyter Notebook'];
  const mapFilterData = ['Additional Map Filters', 'Filter by Region', 'Filter by '];

  return (
    <Page title="TORCHLITE Dashboard">
      <Box>
        <Box>
          <DetailsPageHeader />
          <Grid container spacing={3}>
            <Grid item xs={12} md={9}>
              <ChorloplethMap hideDownload={false} />
            </Grid>
            <Grid item xs={12} md={3}>
              {/* <DataTable data={widgetTableData} type="widget" title="Widget Info Links"/> */}
              {/* <MyTable data={data} /> */}
            </Grid>
          </Grid>
        </Box>
        <Box sx={{ marginTop: '2rem' }}>
          <Grid container spacing={3}>
            <Grid item xs={12} md={9}>
              <DataTable data={data} columns={mapColumns} title={'Contributor Data'} csvHeaders={mapCSVHeaders} sort />
            </Grid>
          </Grid>
        </Box>
      </Box>
    </Page>
  );
};

MapWidget.getLayout = function getLayout(page: ReactElement) {
  return <Layout>{page}</Layout>;
};

export default MapWidget;
