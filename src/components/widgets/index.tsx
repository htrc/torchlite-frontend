import React, { useEffect, useState } from 'react';
import { ChorloplethMap } from './ChorloplethMap';
import { PublicationTimeLineChart } from './PublicationTimeLineChart';
import MainCard from 'components/MainCard';
import { CircularProgress, useTheme } from '@mui/material';
import { WidgetType } from 'data/constants';
import { DashboardState } from 'types/torchlite';
import WidgetTitle from './WidgetTitle';

type WidgetProps = {
  dashboardState: DashboardState;
  widgetType: string;
  isDetailsPage?: boolean;
};

const fetchWidgetData = (dashboardId: string, widgetType: string) => `/api/dashboards/${dashboardId}/widgets/${widgetType}/data`;
const fetchData = async (dashboardState: DashboardState, widgetType: string) => {
  try {
    const url = fetchWidgetData(dashboardState.id, widgetType);
    const response = await fetch(url);
    if (!response.ok) {
      throw new Error('Network response was not ok');
    }
    return await response.json();
  } catch (error) {
    throw new Error('Error fetching data');
  }
};

const Widget = ({ dashboardState, widgetType, isDetailsPage }: WidgetProps) => {
  const theme = useTheme();
  const [loading, setLoading] = useState<boolean>(false);
  const [data, setData] = useState<any>([]);

  useEffect(() => {
    const init = async () => {
      try {
        setLoading(true);
        const data = await fetchData(dashboardState, widgetType);
        setData(data);
      } catch (error) {
        setData([]);
        console.error(error);
      } finally {
        setLoading(false);
      }
    };

    init();
  }, [dashboardState, widgetType]);

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
      <WidgetTitle widgetType={widgetType} isDetailsPage={isDetailsPage} />
      {loading ? (
        <CircularProgress sx={{ my: 3 }} color="primary" />
      ) : (
        <>
          {widgetType === WidgetType.MappingContributorData && (
            <ChorloplethMap data={data} widgetType={widgetType} isDetailsPage={isDetailsPage} />
          )}
          {widgetType === WidgetType.PublicationDateTimeline && (
            <PublicationTimeLineChart data={data} widgetType={widgetType} isDetailsPage={isDetailsPage} />
          )}
          {/*{widgetType === WidgetType.SimpleTagCloud && (*/}
          {/*  <WordCloudTag data={data} widgetType={widgetType} isDetailsPage={isDetailsPage} />*/}
          {/*)}*/}
        </>
      )}
    </MainCard>
  );
};

export default Widget;
