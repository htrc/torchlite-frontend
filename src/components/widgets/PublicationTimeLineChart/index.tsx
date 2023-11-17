// @ts-nocheck
import * as d3 from 'd3';
import { useEffect, useState, useMemo, useRef } from 'react';
import { Box, Menu, MenuItem, Stack, Typography, useTheme } from '@mui/material';
import CustomSlider from 'components/CustomSlider';
import useResizeObserver from 'hooks/useResizeObserver';
import { useDispatch, useSelector } from 'store';
import NextLink from 'next/link';
import MainCard from 'components/MainCard';
import { setTimelineRangedData } from 'store/reducers/dashboard';
import IconButton from 'components/@extended/IconButton';
import { timelineCSVHeaders } from 'data/react-table';
import { DownloadOutlined } from '@ant-design/icons';
import { CSVLink } from 'react-csv';
import { saveAs } from 'file-saver';

const MARGIN = { top: 20, right: 20, bottom: 20, left: 25 };
const BUCKET_PADDING = 1;

export const PublicationTimeLineChart = ({ detailPage = false }) => {
  const theme = useTheme();
  const dispatch = useDispatch();
  const axesRef = useRef(null);
  const { timelineData: modifiedDataHistogram, timelineRangedData: storedTimelineRangedData } = useSelector((state) => state.dashboard);
  const chartWrapper = useRef();
  const dimensions = useResizeObserver(chartWrapper);

  const [dateRange, setDateRange] = useState<number[]>([]);

  const [anchorEl, setAnchorEl] = useState<Element | ((element: Element) => Element) | null | undefined>(null);
  const open = Boolean(anchorEl);

  const handleClick = (event: React.MouseEvent<HTMLButtonElement> | undefined) => {
    setAnchorEl(event?.currentTarget);
  };

  const handleClose = () => {
    setAnchorEl(null);
  };

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

    const xAxisGenerator = d3.axisBottom(xScaleHistogram).tickFormat((d) => Math.round(d));
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

  const downloadData = (format: string) => {
    const svg = chartWrapper.current.querySelector('svg');
    const svgData = new XMLSerializer().serializeToString(svg);
    if (format === 'svg') {
      const blobSVG = new Blob([svgData], { type: 'image/svg+xml;charset=utf-8' });
      saveAs(blobSVG, 'chart.svg');
    } else if (format === 'png') {
      const canvas = document.createElement('canvas');
      canvas.width = svg.width.baseVal.value;
      canvas.height = svg.height.baseVal.value;

      const ctx = canvas.getContext('2d');
      const DOMURL = window.URL || window.webkitURL || window;
      const img = new Image();

      img.onload = function () {
        ctx.drawImage(img, 0, 0);
        const png = canvas.toDataURL('image/png');
        saveAs(png, 'chart.png');
      };

      const svgBlob = new Blob([svgData], { type: 'image/svg+xml;charset=utf-8' });
      const url = DOMURL.createObjectURL(svgBlob);
      img.src = url;
    }
    handleClose();
  };

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
      {detailPage ? (
        <Typography variant="h3" sx={{ color: theme.palette.mode === 'light' ? '#505759' : '#ffffff'/*'#1e98d7'*/, fontFamily:`'Questrial', sans-serif` }}>
          Publication Date Timeline
        </Typography>
      ) : (
        <NextLink href="/widget-details/timeline">
          <Typography variant="h3" sx={{ color: theme.palette.mode === 'light' ? '#505759' : '#ffffff'/*'#1e98d7'*/, cursor: 'pointer', fontFamily:`'Questrial', sans-serif`, '&:hover':{color: "#C35400"} }}>
            Publication Date Timeline
          </Typography>
        </NextLink>
      )}

      {detailPage && (
        <Stack direction="row" justifyContent="flex-end" sx={{ position: 'absolute', right: '2rem' }}>
          <IconButton
            sx={{
              border: `1px solid ${theme.palette.grey[400]}`,
              '&:hover': { backgroundColor: 'transparent' }
            }}
            aria-controls={open ? 'basic-menu' : undefined}
            aria-haspopup="true"
            aria-expanded={open ? 'true' : undefined}
            onClick={handleClick}
          >
            <DownloadOutlined style={{ color: theme.palette.grey[900] }} />
          </IconButton>
          <Menu
            id="basic-menu"
            anchorEl={anchorEl}
            open={open}
            onClose={handleClose}
            MenuListProps={{
              'aria-labelledby': 'basic-button'
            }}
            anchorOrigin={{
              vertical: 'bottom',
              horizontal: 'right'
            }}
            transformOrigin={{
              vertical: 'top',
              horizontal: 'right'
            }}
          >
            <MenuItem onClick={() => downloadData('png')}>PNG image</MenuItem>
            <MenuItem onClick={() => downloadData('svg')}>SVG image</MenuItem>
            <CSVLink
              data={chartDataHistogram}
              filename={`Timeline_Data${new Date().toISOString().split('T')[0]}.csv`}
              headers={timelineCSVHeaders}
              style={{ textDecoration: 'none', color: 'inherit' }}
            >
              <MenuItem onClick={() => downloadData('csv')}>CSV data</MenuItem>
            </CSVLink>
          </Menu>
        </Stack>
      )}
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
