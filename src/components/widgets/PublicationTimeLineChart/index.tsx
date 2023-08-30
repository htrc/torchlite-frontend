import * as d3 from 'd3';
import { useEffect, useState, useMemo, useRef } from 'react';
import { Box, Typography, useTheme } from '@mui/material';
import CustomSlider from 'components/CustomSlider';
import useResizeObserver from 'hooks/useResizeObserver';
import { useDispatch, useSelector } from 'store';
import NextLink from 'next/link';
import MainCard from 'components/MainCard';
import { setTimelineRangedData } from 'store/reducers/dashboard';

const MARGIN = { top: 20, right: 20, bottom: 20, left: 25 };
const BUCKET_PADDING = 1;

export const PublicationTimeLineChart = () => {
  const theme = useTheme();
  const dispatch = useDispatch();
  const axesRef = useRef(null);
  const { timelineData: modifiedDataHistogram, timelineRangedData: storedTimelineRangedData } = useSelector((state) => state.dashboard);
  const chartWrapper = useRef();
  const dimensions = useResizeObserver(chartWrapper);

  const [dateRange, setDateRange] = useState<number[]>([]);

  const chartDataHistogram = useMemo(() => {
    return Object.keys(modifiedDataHistogram)
      .filter((item) => Number(item) >= dateRange[0] && Number(item) <= dateRange[1])
      .map((item: any) => ({ date: item, value: modifiedDataHistogram[item] }));
  }, [modifiedDataHistogram, dateRange]);

  useEffect(() => {
    // Check if the data has actually changed
    if (JSON.stringify(storedTimelineRangedData) !== JSON.stringify(chartDataHistogram)) {
      dispatch(setTimelineRangedData(chartDataHistogram));
    }
  }, [chartDataHistogram, storedTimelineRangedData, dispatch]);

  const minDate = useMemo(() => {
    return Object.keys(modifiedDataHistogram).length ? Math.min(...Object.keys(modifiedDataHistogram).map((item: any) => Number(item))) : 0;
  }, [modifiedDataHistogram]);

  const maxDate = useMemo(() => {
    return Object.keys(modifiedDataHistogram).length ? Math.max(...Object.keys(modifiedDataHistogram).map((item: any) => Number(item))) : 0;
  }, [modifiedDataHistogram]);

  useEffect(() => {
    setDateRange([minDate, maxDate]);
  }, [minDate, maxDate]);

  //Histogram properties
  let width = dimensions?.width || 500;
  let height = width / 2;
  const boundsWidth = width - MARGIN.right - MARGIN.left;
  const boundsHeight = height - MARGIN.top - MARGIN.bottom;

  //x-axis scale for Histogram
  const xScaleHistogram = d3.scaleLinear().domain([dateRange[0], dateRange[1]]).range([0, boundsWidth]);
  //y-axis scale for Histogram
  const yScaleHistogram: any = d3
    .scaleLinear()
    .domain([0, Math.max(...Object.values(modifiedDataHistogram).map((item: any) => Number(item)))])
    .range([boundsHeight, 0]);
  const maxDataValue = Math.max(...Object.values(modifiedDataHistogram).map((item: any) => Number(item)));

  useEffect(() => {
    const svgElement = d3.select(axesRef.current);
    svgElement.selectAll('*').remove();

    const xAxisGenerator = d3.axisBottom(xScaleHistogram);
    svgElement
      .append('g')
      .attr('transform', 'translate(0,' + boundsHeight + ')')
      .call(xAxisGenerator);

    // @ts-ignore
    const yAxisGenerator: any = d3.axisLeft(yScaleHistogram).ticks(maxDataValue).tickFormat(d3.format('~d'));
    svgElement.append('g').call(yAxisGenerator);
  }, [xScaleHistogram, yScaleHistogram, boundsHeight, maxDataValue]);

  const allRects = chartDataHistogram.map((bucket, i) => {
    return (
      <rect
        key={i}
        fill="#6689c6"
        x={xScaleHistogram(Number(bucket.date)) + BUCKET_PADDING / 2}
        width={Math.abs(dateRange[1] - dateRange[0] == 0 ? 10 : boundsWidth / (dateRange[1] - dateRange[0]) - BUCKET_PADDING)}
        y={yScaleHistogram(bucket.value)}
        height={boundsHeight - yScaleHistogram(bucket.value)}
      />
    );
  });

  const handleSliderChange = (event: any) => {
    setDateRange(event.target.value);
  };
  return (
    <MainCard
      content={false}
      sx={{
        mt: 1.5,
        padding: theme.spacing(4),
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        position: 'relative'
      }}
    >
      <NextLink href="/widget-details/timeline">
        <Typography variant="h3" sx={{ color: '#1e98d7', cursor: 'pointer' }}>
          Publication Date Timeline
        </Typography>
      </NextLink>
      <Box sx={{ width: '100%', marginTop: '50px' }} ref={chartWrapper}>
        <svg width={width} height={height}>
          <g width={boundsWidth} height={boundsHeight} transform={`translate(${[MARGIN.left, MARGIN.top].join(',')})`}>
            {allRects}
          </g>
          <g width={boundsWidth} height={boundsHeight} ref={axesRef} transform={`translate(${[MARGIN.left, MARGIN.top].join(',')})`} />
        </svg>
        <CustomSlider value={dateRange} minValue={minDate} maxValue={maxDate} step={10} handleSliderChange={handleSliderChange} />
      </Box>
    </MainCard>
  );
};
