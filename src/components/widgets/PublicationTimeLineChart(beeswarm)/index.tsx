import * as d3 from 'd3';
import styles from './publicationTimeLineChart.module.css';
import {AxisBottom} from './AxisBottom';
import {useEffect, useState, useMemo, useRef} from 'react';
import {Box} from '@mui/material';
import {ITimelineChart} from 'types/chart';
import CustomSlider from 'components/CustomSlider';
import useResizeObserver from 'hooks/useResizeObserver';
import {useSelector} from 'store';

const MARGIN = {top: 20, right: 20, bottom: 20, left: 20};

export const PublicationTimeLineChart = () => {
  const {timelineData} = useSelector((state) => state.dashboard);
  const chartWrapper = useRef();
  const dimensions = useResizeObserver(chartWrapper);
  const modifiedData = useMemo(() => {
    return timelineData.reduce((prev: any, curr: ITimelineChart) => {
      const decadeRange = [Math.floor(curr.pubDate / 10) * 10 + 0, Math.floor(curr.pubDate / 10) * 10 + 9];
      if (prev[decadeRange[0]]) return {...prev, [decadeRange[0]]: prev[decadeRange[0]] + 1};
      else return {...prev, [decadeRange[0]]: 1};
    }, {});
  }, [timelineData]);

  const [dateRange, setDateRange] = useState<number[]>([]);

  const chartData = useMemo(() => {
    return Object.keys(modifiedData)
      .filter((item) => Number(item) >= dateRange[0] && Number(item) <= dateRange[1])
      .map((item) => ({date: item, value: modifiedData[item]}));
  }, [modifiedData, dateRange]);

  const minDate = useMemo(() => {
    return Object.keys(modifiedData).length ? Math.min(...Object.keys(modifiedData).map((item: any) => Number(item))) : "";
  }, [modifiedData]);

  const maxDate = useMemo(() => {
    return Object.keys(modifiedData).length ? Math.max(...Object.keys(modifiedData).map((item: any) => Number(item))) : "";
  }, [modifiedData]);

  useEffect(() => {
    setDateRange([minDate, maxDate]);
  }, [minDate, maxDate]);

  let width = dimensions?.width || 500;
  let height = width / 2;
  const boundsWidth = width - MARGIN.right - MARGIN.left;
  const boundsHeight = height - MARGIN.top - MARGIN.bottom;

  const [hoveredGroup, setHoveredGroup] = useState<string | null>(null);

  const yScale = d3
    .scaleLinear()
    .domain([0, Math.max(...Object.values(modifiedData).map((item: any) => Number(item)))])
    .range([boundsHeight, 0]);
  const xScale = d3.scaleLinear().domain([dateRange[0], dateRange[1]]).range([0, boundsWidth]);
  const allGroups = chartData.map((d) => String(d.date));
  const colorScale = d3.scaleOrdinal<string>().domain(allGroups).range(['#6689c6']);
  const allShapes = chartData.map((d, i) => {
    const className = hoveredGroup && d.date !== hoveredGroup ? styles.scatterplotCircle + ' ' + styles.dimmed : styles.scatterplotCircle;

    var div = d3.select('#tooltip');
    return (
      <circle
        key={i}
        r={5}
        cx={xScale(Number(d.date))}
        cy={yScale(d.value)}
        className={className}
        stroke={colorScale(d.date)}
        fill={colorScale(d.date)}
        onMouseOver={(e) => {
          setHoveredGroup(d.date);
          div.style('opacity', 0.9);
          div
            .html(`<strong>${d.value}</strong>`)
            .style('left', e.pageX + 10 + 'px')
            .style('top', e.pageY - 12 + 'px')
            .style('position', 'absolute');
        }}
        onMouseLeave={(e) => {
          setHoveredGroup(null);
          div.style('opacity', 0);
        }}
      />
    );
  });

  const handleSliderChange = (event: any) => {
    setDateRange(event.target.value);
  };
  return (
    <Box sx={{width: '100%'}} ref={chartWrapper}>
      <svg width={width} height={height}>
        <g width={boundsWidth} height={boundsHeight} transform={`translate(${[MARGIN.left, MARGIN.top].join(',')})`}>
          <g transform={`translate(0, ${boundsHeight})`}>
            <AxisBottom xScale={xScale} numberOfTicks={dateRange[1] - dateRange[0]} pixelsPerTick={40}/>
          </g>
          {allShapes}
        </g>
      </svg>
      <CustomSlider value={dateRange} minValue={minDate} maxValue={maxDate} step={10}
                    handleSliderChange={handleSliderChange}/>
    </Box>
  );
};
