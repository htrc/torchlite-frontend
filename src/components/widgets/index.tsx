import React, { useEffect, useState, useContext } from 'react';
import { ChorloplethMap } from './ChorloplethMap';
import { PublicationTimeLineChart } from './PublicationTimeLineChart';
import MainCard from 'components/MainCard';
import { CircularProgress, useTheme } from '@mui/material';
import { WidgetType } from 'data/constants';
import { DashboardState } from 'types/torchlite';
import WidgetTitle from './WidgetTitle';
import { WordCloudTag } from './WordCloud';
import { Summary } from './Summary';
import { AppContext } from 'contexts/AppContext'; // Import the AppContext

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
  const { widgetLoadingState, updateWidgetLoadingState } = useContext(AppContext); // Access AppContext
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
        updateWidgetLoadingState(widgetType, true); // Set widget as loaded in widgetLoadingState
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
          {widgetType === WidgetType.Summary && (
            <Summary data={data} widgetType={widgetType} isDetailsPage={isDetailsPage} />
          )}
          {widgetType === WidgetType.SimpleTagCloud && (
            <WordCloudTag data={data} widgetType={widgetType} isDetailsPage={isDetailsPage} />
          )}
        </>
      )}
    </MainCard>
  );
};

export default Widget;
