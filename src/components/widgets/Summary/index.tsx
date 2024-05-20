// @ts-nocheck
import * as d3 from 'd3';
import { useEffect, useState, useMemo, useRef } from 'react';
import { Box, Menu, MenuItem, Stack, Typography, useTheme, Grid } from '@mui/material';
import CustomSlider from 'components/CustomSlider';
import useResizeObserver from 'hooks/useResizeObserver';
import { useSelector } from 'store';
import NextLink from 'next/link';
import MainCard from 'components/MainCard';
import React from 'react'; 
import Select from 'react-select';
import IconButton from 'components/@extended/IconButton';
import { DownloadOutlined } from '@ant-design/icons'; 
import { CSVLink } from 'react-csv'; 
import DataTable from 'components/DataTable';
import { volumeColumns, volumeCSVHeaders } from 'data/react-table';
import LineGraph from './lineGraph';
import useDashboardState from 'hooks/useDashboardState';
import { CSVHeaders } from 'data/constants';


const MARGIN = { top: 20, right: 20, bottom: 20, left: 20 };
const BUCKET_PADDING = 1;

export const Summary = ({ data, widgetType, isDetailsPage = false }) => { 
  const theme = useTheme();
  const chartWrapper = useRef();
  const { onChangeWidgetState } = useDashboardState();

  const [anchorEl, setAnchorEl] = useState<Element | ((element: Element) => Element) | null | undefined>(null);
  const open = Boolean(anchorEl);

  const handleClick = (event: React.MouseEvent<HTMLButtonElement> | undefined) => {
    setAnchorEl(event?.currentTarget);
  };

  const handleClose = () => {
    setAnchorEl(null);
  };

  const chartDataHistogram = useMemo(() => {
    if (data.lengthGraph) {
      var output_array = [];
      for (const [key, value] of Object.entries(data.lengthGraph)) {
        output_array.push({ 'title': key, 'length': value, 'density': data.densityGraph[key] })
      }
      return output_array;
    }
    else {
      return [];
    }
  }, [data]);

  useEffect(() => {
    onChangeWidgetState({
      widgetType: widgetType,
      data: chartDataHistogram
    });
  }, [chartDataHistogram, widgetType]);

  const downloadData = (format: string) => {
    const container = document.getElementById('input-container');
    let yOffset = 0;
    const rightMargin = 10;

    const svg = chartWrapper.current.querySelector('div#input-container');
    const svgData = new XMLSerializer().serializeToString(svg);
    if (format === 'svg') {
      const blobSVG = new Blob([svgData], { type: 'image/svg+xml;charset=utf-8' });
      saveAs(blobSVG, 'chart.svg');
    } else if (format === 'png') {
      const canvas = document.createElement('canvas');

      const ctx = canvas.getContext('2d');
      const DOMURL = window.URL || window.webkitURL || window;
      const img = new Image();

      img.onload = function () {
        canvas.width = img.width;
        canvas.height = img.height;
        ctx.drawImage(img, 0, 0);
        const png = canvas.toDataURL('image/png');
        saveAs(png, 'chart.png');
      };
      /*img.addEventListener("error", (event) => {
        console.log(event)
      });*/

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
            <MenuItem disabled={true} onClick={() => downloadData('png')}>PNG image</MenuItem>
            <MenuItem onClick={() => downloadData('svg')}>SVG image</MenuItem>
            <CSVLink
              data={chartDataHistogram}
              filename={`Summary_Data${new Date().toISOString().split('T')[0]}.csv`}
              headers={CSVHeaders[widgetType]}
              style={{ textDecoration: 'none', color: 'inherit' }}
            >
              <MenuItem onClick={() => downloadData('csv')}>CSV data</MenuItem>
            </CSVLink>
          </Menu>
        </Stack>
      )}
      <Box sx={{ width: '100%', marginTop: '50px' }} ref={chartWrapper}>
        <div id="input-container">
          <p>This corpus has { data?.worksetSize } documents with <b>{ data?.totalWords }</b> total words and <b>{ data?.uniqueWords }</b> unique word forms. </p>

          <div>
          <div style={{ display: 'flex' }}>
            <div style={{ width: '70%' }}>
              <h4>Document Length</h4>  
            </div>
            <div style={{ width: '30%', display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
                <div className="App">
                  <LineGraph data={data?.lengthGraph} />
                </div>
            </div>
          </div>
            <div style={{ display: 'flex', width: '100%' }}>
                <p>
                  Longest: <span style={{ color: 'blue', fontSize: '14px' }}>{data?.longestDoc}; </span><br />
                  Shortest: <span style={{ color: 'blue', fontSize: '14px' }}>{data?.shortestDoc}; </span>
                </p>          
            </div>
              


            <div style={{ display: 'flex'}}>
              <div style={{ width: '70%' }}>
              <h4>Vocabulary Density</h4>
              </div>
              <div style={{ width: '30%', display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
                <div className="App">
                  <LineGraph data={data?.densityGraph} />
                </div>
              </div>
            </div>
            <div style={{ display: 'flex' }}>
              
                <p>
                  Highest: <span style={{ color: 'blue', fontSize: '14px' }}>{data?.highestDensityDoc}; </span><br />
                  Lowest: <span style={{ color: 'blue', fontSize: '14px' }}>{data?.lowestDensityDoc}; </span>
                </p>
              
              
              
            </div>

            {/* <h4>Readability Index</h4>
            <p>
              Highest: {mostReadableDoc}; <br></br>
              {leastReadableDoc}; 
            </p> */}
          </div>
        </div>
      </Box>
    </>
  );
};
