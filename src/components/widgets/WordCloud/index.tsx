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
import NextLink from 'next/link';
import React from 'react';
import Select from 'react-select';
import { volumeCSVHeaders } from 'data/react-table'; 
import {fetchWidgetData} from './../../widgets'
import WordCloud from 'react-d3-cloud';
import { WordCloudChart } from './WordCloudChart'
import './WordCloud.module.css';

const MARGIN = { top: 20, right: 20, bottom: 20, left: 20 };
const BUCKET_PADDING = 1;

export const WordCloudTag = ({ data, widgetType, isDetailsPage = false }) => {
  const theme = useTheme();
  const [wordsData, setWordsData] = useState([]);
  const inputRef = useRef(null);
  const chartWrapper = useRef();
  const dimensions = useResizeObserver(chartWrapper);

  //const dimensions = useResizeObserver(inputRef);
  const [loading, setLoading] = useState(true);
  const [wCloud, setwordCloudData] = useState([]);
  //console.log("cloudData");
  //console.log(data);

  const [anchorEl, setAnchorEl] = useState<Element | ((element: Element) => Element) | null | undefined>(null);

  const handleClick = (event: React.MouseEvent<HTMLButtonElement> | undefined) => {
    setAnchorEl(event?.currentTarget);
  };

  const handleClose = () => {
    setAnchorEl(null);
  };
  
  useEffect(() => {
    // Convert the data object into an array, sort it, and take the top 100
    //const sortedData = Object.entries(data).sort((a, b) => b[1] - a[1]).slice(0, 100);
  
    const newWordCloudData = data.map(entry => ({
      text: entry[0],
      value: entry[1],
    }));
  
    setwordCloudData(newWordCloudData);
  }, [data]);

  console.log("wCloud data before passing to WordCloudChart:",wCloud);

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
            {/*<CSVLink
              data={chartDataHistogram}
              filename={`Timeline_Data${new Date().toISOString().split('T')[0]}.csv`}
              headers={CSVHeaders[widgetType]}
              style={{ textDecoration: 'none', color: 'inherit' }}
            >
              <MenuItem onClick={() => downloadData('csv')}>CSV data</MenuItem>
          </CSVLink>*/}
          </Menu>
        </Stack> 
      )}
      
      <Box sx={{ height: '400px', position: 'relative' }} ref={chartWrapper}>
        
        <>
        <WordCloudChart data={wCloud}></WordCloudChart> 
        </>
        
        
      </Box>
    </>
  );
};

export default WordCloudTag;
