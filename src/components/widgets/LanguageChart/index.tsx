// @ts-nocheck
import * as d3 from 'd3';
import { useEffect, useState, useMemo, useRef } from 'react';
import { Box, Menu, MenuItem, Stack, Typography, useTheme } from '@mui/material';
import useResizeObserver from 'hooks/useResizeObserver';
import { useDispatch, useSelector } from 'store';
import NextLink from 'next/link';
import MainCard from 'components/MainCard';
import { setLanguageRangedData } from 'store/reducers/dashboard';
import IconButton from 'components/@extended/IconButton';
import { languageCSVHeaders } from 'data/react-table';
import { DownloadOutlined } from '@ant-design/icons';
import { CSVLink } from 'react-csv';
import { saveAs } from 'file-saver';

const MARGIN = { top: 20, right: 20, bottom: 20, left: 25 };

export const LanguageChart = ({ detailPage = false }) => {
  const theme = useTheme();
  const dispatch = useDispatch();
  const inputRef = useRef(null);
  const { languageData: modifiedDataHistogram, languageRangedData: storedLanguageRangedData } = useSelector((state) => state.dashboard);
  const chartWrapper = useRef();
  const dimensions = useResizeObserver(chartWrapper);
  let width = dimensions?.width || 500;
  let height = width / 2;
  const boundsWidth = width - MARGIN.right - MARGIN.left;
  const boundsHeight = height - MARGIN.top - MARGIN.bottom;
  interface LangCount {
    lang: string, 
    count: number
  }
  const [langCounts, setLangCounts] = useState<LangCount[]>([]);

  const [anchorEl, setAnchorEl] = useState<Element | ((element: Element) => Element) | null | undefined>(null);
  const open = Boolean(anchorEl);

  const handleClick = (event: React.MouseEvent<HTMLButtonElement> | undefined) => {
    setAnchorEl(event?.currentTarget);
  };

  const handleClose = () => {
    setAnchorEl(null);
  };

  useEffect(() => {
    fetch(`https://tools.htrc.illinois.edu/ef-api/worksets/6409650730000004085ce312/metadata?fields=metadata.language`)
      .then(response => {
        if (response.status !== 200) {
          console.log(`There was a problem: ${response.status}`)
          return
        }
        response.json().then(languagedata => {
          interface Langs {
            [key: string]: number
          }
          var langs: Langs = {}
          for (var vol in languagedata.data) {
            if (Array.isArray(languagedata.data[vol].metadata.language)) {
              for (let l in languagedata.data[vol].metadata.language) {
                if (languagedata.data[vol].metadata.language[l] in langs) {
                  langs[languagedata.data[vol].metadata.language[l]] += 1;
                }
                else {
                  langs[languagedata.data[vol].metadata.language[l]] = 1;
                }
              }
            }
            else {
              if (languagedata.data[vol].metadata.language in langs) {
                langs[languagedata.data[vol].metadata.language] += 1;
              }
              else {
                langs[languagedata.data[vol].metadata.language] = 1;
              }
            }
          }

          var output_langs = [];
          for (let lang in langs) {
            output_langs.push({ lang: lang, count: langs[lang] });
          }

          setLangCounts(output_langs);
        })
      })
  }, []);

  useEffect(() => {
    // Check if the data has actually changed
    if (JSON.stringify(storedLanguageRangedData) !== JSON.stringify(langCounts)) {
      dispatch(setLanguageRangedData(langCounts));
    }
  }, [langCounts, storedLanguageRangedData, dispatch]);

  useEffect(() => {
    arcs({ inputRef }, langCounts)
  }, [langCounts])

/*  const colors = d3.scaleOrdinal(d3.schemeCategory10);
  const radius = Math.min(width, height) / 2,
  outerRadius = radius - 10;
  const counts = langCounts.map((d) => d.count);
  console.log(langCounts)
  console.log(counts)

  const pieGenerator = d3.pie();
  const arcs = pieGenerator(counts);
  console.log(arcs);
  console.log(arcs.length)

  const constructedArcs = arcs.map((arc, i) => {
    const constructedArc = d3.arc()({
      innerRadius: 0,
      outerRadius: outerRadius,
      startAngle: arc['startAngle'],
      endAngle: arc['endAngle']
    })

    return (
      <path
        key={i}
        d={constructedArc!}
        fill={colors(String(arc['index']))}
        transform={`translate(${width/2},${height/2})`}
      />
    )
  })*/

  const arcs = ({ inputRef }, langCs : LangCount[]) => {
    const container = d3.select(inputRef.current);
    console.log(container.selectAll('svg'))
    console.log(typeof(container.selectAll('svg')))
    container.selectAll('svg').remove();
    const colors = d3.scaleOrdinal(d3.schemeCategory10);
    const radius = Math.min(width, height) / 2,
    outerRadius = radius - 10;

    const svgColor = container
      .append('svg')
      .attr('width', width)
      .attr('height', height)
      .attr('viewBox', [0, 0, width, height])
      .style('overflow', 'visible')
      .style('display', 'block');

    console.log(svgColor)
    console.log(typeof(svgColor))

    const counts = langCs.map((d) => d.count);
    console.log(counts.reduce((partialSum, a) => partialSum + a, 0))

    const pieGenerator = d3.pie();
    const arcs = pieGenerator(counts);
    const generatedArcs = svgColor.selectAll("path")
      .data(arcs)
    
    console.log(arcs)
    generatedArcs.enter()
      .append('path')
      .attr('d',function(d) {
        console.log(d);
        return d3.arc()({
          innerRadius: 0,
          outerRadius: outerRadius,
          startAngle: d['startAngle'],
          endAngle: d['endAngle']
        })
      })
      .attr('fill',function(d) {
        return colors(String(d['index']))
      })
      .attr('transform', `translate(${width/2},${height/2})`)
  }

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
        <Typography variant="h3" sx={{ color: '#1e98d7' }}>
          Workset Languages
        </Typography>
      ) : (
        <NextLink href="/widget-details/language">
          <Typography variant="h3" sx={{ color: '#1e98d7', cursor: 'pointer' }}>
            Workset Languages
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
              data={langCounts}
              filename={`Language_Data${new Date().toISOString().split('T')[0]}.csv`}
              headers={languageCSVHeaders}
              style={{ textDecoration: 'none', color: 'inherit' }}
            >
              <MenuItem onClick={() => downloadData('csv')}>CSV data</MenuItem>
            </CSVLink>
          </Menu>
        </Stack>
      )}
      <Box sx={{ width: '100%', marginTop: '50px' }} ref={chartWrapper}>
        <div id="graph-container" ref={inputRef}>
          <svg width={width} height={height}>
            <g width={boundsWidth} height={boundsHeight}>
              
            </g>
          </svg>
        </div>
      </Box>
    </MainCard>
  );
};