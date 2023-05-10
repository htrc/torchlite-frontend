import * as d3 from 'd3';
import styles from './publicationTimeLineChart.module.css';
import { AxisBottom } from './AxisBottom';
import { useEffect, useState, useMemo, useRef } from 'react';
import { Box } from '@mui/material';
import { ITimelineChart } from 'types/chart';
import CustomSlider from 'components/CustomSlider';
import useResizeObserver from 'hooks/useResizeObserver';

const MARGIN = { top: 20, right: 20, bottom: 20, left: 20 };

type TimeLineplotProps = {
  data: ITimelineChart[];
};

export const PublicationTimeLineChart = ({ data }: TimeLineplotProps) => {
  const chartWrapper = useRef();
  const dimensions = useResizeObserver(chartWrapper);
  const [dateRange, setDateRange] = useState<number[]>([]);

  const chartData = useMemo(() => {
    return [...data].filter((item) => item.x >= dateRange[0] && item.x <= dateRange[1]);
  }, [data, dateRange]);

  const minDate = useMemo(() => {
    return Math.min(...data.map((item) => item.x));
  }, [data]);

  const maxDate = useMemo(() => {
    return Math.max(...data.map((item) => item.x));
  }, [data]);

  useEffect(() => {
    setDateRange([minDate, maxDate]);
  }, [minDate, maxDate]);

  let width = dimensions?.width || 500;
  let height = width / 2;
  const boundsWidth = width - MARGIN.right - MARGIN.left;
  const boundsHeight = height - MARGIN.top - MARGIN.bottom;

  const [hoveredGroup, setHoveredGroup] = useState<string | null>(null);

  const yScale = d3.scaleLinear().domain([35, 85]).range([boundsHeight, 0]);
  const xScale = d3.scaleLinear().domain([dateRange[0], dateRange[1]]).range([0, boundsWidth]);
  const allGroups = chartData.map((d) => String(d.group));
  const colorScale = d3.scaleOrdinal<string>().domain(allGroups).range(['#e0ac2b', '#e85252', '#6689c6', '#9a6fb0', '#a53253']);

  const allShapes = chartData.map((d, i) => {
    const className = hoveredGroup && d.group !== hoveredGroup ? styles.scatterplotCircle + ' ' + styles.dimmed : styles.scatterplotCircle;

    return (
      <circle
        key={i}
        r={5}
        cx={xScale(d.x)}
        cy={yScale(d.y)}
        className={className}
        stroke={colorScale(d.group)}
        fill={colorScale(d.group)}
        onMouseOver={() => {
          setHoveredGroup(d.group);
        }}
        onMouseLeave={() => {
          setHoveredGroup(null);
        }}
      />
    );
  });

  const handleSliderChange = (event: any) => {
    setDateRange(event.target.value);
  };
  return (
    <Box sx={{ width: '100%' }} ref={chartWrapper}>
      <svg width={width} height={height}>
        <g width={boundsWidth} height={boundsHeight} transform={`translate(${[MARGIN.left, MARGIN.top].join(',')})`}>
          <g transform={`translate(0, ${boundsHeight})`}>
            <AxisBottom xScale={xScale} numberOfTicks={dateRange[1] - dateRange[0]} pixelsPerTick={40} />
          </g>
          {allShapes}
        </g>
      </svg>
      <CustomSlider value={dateRange} minValue={minDate} maxValue={maxDate} step={10} handleSliderChange={handleSliderChange} />
    </Box>
  );
};
