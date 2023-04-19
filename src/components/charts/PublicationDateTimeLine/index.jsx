import React, { useRef, useState, useEffect } from 'react';
import { Box } from '@mui/material';

import PublicationDateTimeLine from './PublicationDateTimeLine';

const PublicationDateTimeLineChart = ({ data, setData, minDate, maxDate }) => {
  const PublicationDateTimeLineChartArea = useRef(null);
  const [PublicationDateTimeLineChart, setPublicationDateTimeLineChart] = useState(null);
  useEffect(() => {
    if (!PublicationDateTimeLineChart) {
      setPublicationDateTimeLineChart(new PublicationDateTimeLine(PublicationDateTimeLineChartArea.current, data, setData));
    } else {
      PublicationDateTimeLineChart.update(data, setData, minDate, maxDate);
    }
  }, [PublicationDateTimeLineChart, minDate, maxDate, data, setData]);
  return (
    <Box>
      <div ref={PublicationDateTimeLineChartArea}></div>
    </Box>
  );
};

export default PublicationDateTimeLineChart;
