import React from 'react';
import useSWR from 'swr';
import { ChorloplethMap } from './ChorloplethMap';
import { PublicationTimeLineChart } from './PublicationTimeLineChart';
import MainCard from 'components/MainCard';
import { Box, CircularProgress, Typography, useTheme } from '@mui/material';
import { WidgetType } from 'data/constants';

type WidgetProps = {
  dashboardId: string;
  widgetType: string;
};

const fetchWidgetData = (dashboardId: string, widgetType: string) => `/api/dashboards/${dashboardId}/widgets/${widgetType}/data`;

const Widget = ({ dashboardId, widgetType }: WidgetProps) => {
  const theme = useTheme();

  const { data, error } = useSWR(fetchWidgetData(dashboardId, widgetType), async (url) => {
    const response = await fetch(url);
    if (!response.ok) {
      throw new Error('Network response was not ok');
    }
    return response.json();
  });

  return (
    <MainCard
      content={false}
      sx={{
        padding: theme.spacing(4),
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        position: 'relative'
      }}
    >
      {error || !data ? (
        <>
          <Typography variant="h3" sx={{ color: '#1e98d7' }}>
            {widgetType === WidgetType.MappingContributorData
              ? 'Mapping Contributor Data'
              : widgetType === WidgetType.PublicationDateTimeline
              ? 'Publication Date Timeline'
              : ''}
          </Typography>
          {error ? <Typography variant="h5">Error loading data.</Typography> : !data && <CircularProgress sx={{ my: 3 }} color="primary" />}
        </>
      ) : (
        <>
          {widgetType === WidgetType.MappingContributorData && <ChorloplethMap data={data} />}
          {widgetType === WidgetType.PublicationDateTimeline && <PublicationTimeLineChart data={data} />}
        </>
      )}
    </MainCard>
  );
};

export default Widget;
