import React, { useEffect } from 'react';
import useSWR from 'swr';
import { ChorloplethMap } from './ChorloplethMap';
import { PublicationTimeLineChart } from './PublicationTimeLineChart';
import MainCard from 'components/MainCard';
import { CircularProgress, Typography, useTheme } from '@mui/material';
import { WidgetType } from 'data/constants';
import { DashboardState } from 'types/torchlite';

type WidgetProps = {
  dashboardState: DashboardState;
  widgetType: string;
};

const fetchWidgetData = (dashboardId: string, widgetType: string) => `/api/dashboards/${dashboardId}/widgets/${widgetType}/data`;
const fetchData = async (dashboardState: DashboardState, widgetType: string, mutate: Function) => {
  try {
    // Inform useSWR that the data fetching is starting
    mutate(undefined, true);

    const url = fetchWidgetData(dashboardState.id, widgetType);
    const response = await fetch(url);
    if (!response.ok) {
      throw new Error('Network response was not ok');
    }
    const newData = await response.json();

    // Inform useSWR that the data fetching is complete
    mutate(newData);
  } catch (error) {
    // Inform useSWR about the error
    mutate(undefined, false);
    console.error('Error fetching data:', error);
  }
};

const Widget = ({ dashboardState, widgetType }: WidgetProps) => {
  const theme = useTheme();

  const { data, error, mutate } = useSWR(fetchWidgetData(dashboardState.id, widgetType), async (url) => {
    const response = await fetch(url);
    if (!response.ok) {
      throw new Error('Network response was not ok');
    }
    return response.json();
  });

  useEffect(() => {
    fetchData(dashboardState, widgetType, mutate);
  }, [dashboardState, widgetType, mutate]);

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
