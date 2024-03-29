// @ts-nocheck
import * as d3 from 'd3';
import { useEffect, useState, useMemo, useRef } from 'react';
import { Box, Menu, MenuItem, Stack, Typography, useTheme } from '@mui/material';
import CustomSlider from 'components/CustomSlider';
import useResizeObserver from 'hooks/useResizeObserver';
import { useDispatch, useSelector } from 'store';
import MainCard from 'components/MainCard';
import { setTimelineRangedData } from 'store/reducers/dashboard';
import IconButton from 'components/@extended/IconButton';
import { DownloadOutlined } from '@ant-design/icons';
import { CSVLink } from 'react-csv';
import { saveAs } from 'file-saver';
import useDashboardState from 'hooks/useDashboardState';
import { CSVHeaders } from 'data/constants';

const MARGIN = { top: 20, right: 25, bottom: 20, left: 25 };
const BUCKET_PADDING = 1;

export const PublicationTimeLineChart = ({ data, widgetType, isDetailsPage = false }) => {
  const theme = useTheme();
  const dispatch = useDispatch();
  const axesRef = useRef(null);
  const chartWrapper = useRef(null);
  const dimensions = useResizeObserver(chartWrapper);
  const { onChangeWidgetState } = useDashboardState();

  const yearsOfBirth = data?.map((item) => item.year).filter((year) => year !== null && year !== undefined);
  const minYear = Math.min(...yearsOfBirth);
  const maxYear = Math.max(...yearsOfBirth);

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
    return data.filter((item) => item.year >= dateRange[0] && item.year <= dateRange[1]);
  }, [data, dateRange]);

  useEffect(() => {
    onChangeWidgetState({
      widgetType: widgetType,
      minYear: minYear,
      maxYear: maxYear,
      data: chartDataHistogram
    });
  }, [chartDataHistogram, minYear, maxYear, widgetType]);

  useEffect(() => {
    setDateRange([minYear, maxYear]);
  }, [minYear, maxYear]);

  //Histogram properties
  let width = dimensions?.width || 500;
  let height = width / 2;
  const boundsWidth = width - MARGIN.right - MARGIN.left;
  const boundsHeight = height - MARGIN.top - MARGIN.bottom;

  //x-axis scale for Histogram
  const xScaleHistogram = d3.scaleLinear().domain([dateRange[0], dateRange[1]+1]).range([0, boundsWidth]);
  //y-axis scale for Histogram
  const maxDataValue = Math.max(...data.map((item) => item.count));
  const yScaleHistogram: any = d3.scaleLinear().domain([0, maxDataValue]).range([boundsHeight, 0]).nice();

  useEffect(() => {
    const svgElement = d3.select(axesRef.current);
    svgElement.selectAll('*').remove();

    const xAxisGenerator = d3.axisBottom(xScaleHistogram);
    const dateSpread = dateRange[1] - dateRange[0] > 0 ? dateRange[1] - dateRange[0] : 1;
    if (dateSpread < 10) {
      xAxisGenerator.ticks(dateSpread).tickFormat((d) => Math.round(d));
    }
    else {
      xAxisGenerator.tickFormat((d) => Math.round(d));
    }
    svgElement
      .append('g')
      .attr('transform', `translate(0,${boundsHeight})`)
      .call(xAxisGenerator);

    // @ts-ignore
    const yAxisGenerator: any = d3.axisLeft(yScaleHistogram)
    if (maxDataValue < 10) {
      yAxisGenerator.ticks(maxDataValue).tickFormat(d3.format('~d'));
    }
    else {
      yAxisGenerator.ticks().tickFormat(d3.format('~d'));
    }
    svgElement.append('g').call(yAxisGenerator);
  }, [xScaleHistogram, yScaleHistogram, boundsHeight, maxDataValue, dateRange]);

  const allRects = chartDataHistogram.map((bucket, i) => {
    return (
      <rect
        key={i}
        fill="#6689c6"
        x={xScaleHistogram(bucket.year) + BUCKET_PADDING / 2}
        width={Math.abs(1 + dateRange[1] - dateRange[0] == 0 ? 10 : boundsWidth / (1 + dateRange[1] - dateRange[0]) - BUCKET_PADDING)}
        y={yScaleHistogram(bucket.count)}
        height={boundsHeight - yScaleHistogram(bucket.count)}
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
    <>
      {isDetailsPage && (
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
              headers={CSVHeaders[widgetType]}
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
        <CustomSlider label="Adjust publication years on timeline" value={dateRange} minValue={minYear} maxValue={maxYear} step={10} handleSliderChange={handleSliderChange} />
      </Box>
    </>
  );
};
