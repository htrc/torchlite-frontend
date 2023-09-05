// @ts-nocheck
import React, { useState, useEffect, useRef, useMemo } from 'react';
import * as d3 from 'd3';
// @ts-ignore
import * as topojson from 'topojson-client';
import { useDispatch, useSelector } from 'store';
import NextLink from 'next/link';
import MainCard from 'components/MainCard';
import CustomSlider from 'components/CustomSlider';
import { Box, CircularProgress, Typography, useTheme, Stack, Menu, MenuItem } from '@mui/material';
import useResizeObserver from 'hooks/useResizeObserver';
import { IMapData } from 'types/chart';
import { setMapRangedData } from 'store/reducers/dashboard';
import IconButton from 'components/@extended/IconButton';
import { DownloadOutlined } from '@ant-design/icons';
import { CSVLink } from 'react-csv';
import { transformMapDataForDataTable } from 'utils/helpers';
import { mapCSVHeaders } from 'data/react-table';
import { saveAs } from 'file-saver';

export const ChorloplethMap = ({ detailPage = false }) => {
  const theme = useTheme();
  const dispatch = useDispatch();
  const inputRef = useRef(null);
  const dimensions = useResizeObserver(inputRef);
  let width = dimensions?.width || 500;
  let height = width / 2;
  const { mapData, loadingMap, mapRangedData: storedMapRangedData } = useSelector((state) => state.dashboard);
  const [dateRange, setDateRange] = useState<number[]>([]);
  const [world, setWorld] = useState({});
  const [drawData, setDrawData] = useState({});
  const [countries, setCountries] = useState({});
  const [countryMesh, setCountryMesh] = useState({});
  const [maxPopulation, setMaxPopulation] = useState(0);

  const [anchorEl, setAnchorEl] = useState<Element | ((element: Element) => Element) | null | undefined>(null);
  const open = Boolean(anchorEl);

  const handleClick = (event: React.MouseEvent<HTMLButtonElement> | undefined) => {
    setAnchorEl(event?.currentTarget);
  };

  const handleClose = () => {
    setAnchorEl(null);
  };

  // console.log(mapData);
  //group by dob mapData
  const modifiedDataHistogram = useMemo(() => {
    return mapData.reduce((prev: any, curr: IMapData) => {
      const dob = Number(curr.dob.slice(0, 4));
      if (prev[dob]) return { ...prev, [dob]: prev[dob] + 1 };
      else return { ...prev, [dob]: 1 };
    }, {});
  }, [mapData]);

  // console.log(modifiedDataHistogram);
  const handleMarkerClick = (event, d) => {
    const div = d3.select('#tooltip');
    div.style('opacity', 0.9);
    div
      .html(`<strong>Location: ${d.name}<br/> Contributors: ${d.population}</strong>`)
      .style('left', event.pageX + 10 + 'px')
      .style('top', event.pageY - 12 + 'px')
      .style('position', 'absolute');
  };

  const mapDataHistogram = useMemo(() => {
    return mapData.filter((item) => Number(item.dob.slice(0, 4)) >= dateRange[0] && Number(item.dob.slice(0, 4)) <= dateRange[1]);
  }, [mapData, dateRange]);

  const datatableData = transformMapDataForDataTable(mapDataHistogram);

  useEffect(() => {
    // Check if the data has actually changed
    if (JSON.stringify(storedMapRangedData) !== JSON.stringify(mapDataHistogram)) {
      dispatch(setMapRangedData(mapDataHistogram));
    }
  }, [mapDataHistogram, storedMapRangedData, dispatch]);

  const cities = useMemo(() => {
    const cityMap = mapDataHistogram.reduce((map, item) => {
      if (item.city.trim() === '' || item.cityCoords.trim() === '') {
        return map;
      }
      const coords = item.cityCoords.replace('Point(', '').replace(')', '').split(' ');
      const city = map.get(item.city) || { name: item.city, coordinates: [parseFloat(coords[0]), parseFloat(coords[1])], population: 0 };
      city.population++;
      return map.set(item.city, city);
    }, new Map());
    const cities = Array.from(cityMap.values());
    return cities;
  }, [mapDataHistogram]);

  useEffect(() => {
    if (cities.length > 0) {
      const maxPop = Math.max(...cities.map((city) => city.population));
      setMaxPopulation(maxPop);
    }
  }, [cities]);

  const minDate = useMemo(() => {
    return Object.keys(modifiedDataHistogram).length ? Math.min(...Object.keys(modifiedDataHistogram).map((item: any) => Number(item))) : 0;
  }, [modifiedDataHistogram]);
  const maxDate = useMemo(() => {
    return Object.keys(modifiedDataHistogram).length ? Math.max(...Object.keys(modifiedDataHistogram).map((item: any) => Number(item))) : 0;
  }, [modifiedDataHistogram]);

  useEffect(() => {
    setDateRange([minDate, maxDate]);
  }, [minDate, maxDate]);

  useEffect(() => {
    fetch('/countries-50m.json').then((response) => {
      if (response.status !== 200) {
        console.log(`There was a problem: ${response.status}`);
        return;
      }
      response.json().then((worlddata) => {
        setWorld(worlddata);
        let con = topojson.feature(worlddata, worlddata.objects.countries);
        setCountries(con);
        let com = topojson.mesh(worlddata, worlddata.objects.countries, (a, b) => a !== b);
        setCountryMesh(com);
      });
    });
  }, []);

  useEffect(() => {
    if (mapDataHistogram.length) {
      let counts = {};
      for (let item of mapDataHistogram) {
        const { countryiso } = item;
        if (countryiso in counts) {
          // @ts-ignore
          counts[countryiso]++;
        } else {
          // @ts-ignore
          counts[countryiso] = 1;
        }
      }
      if (Object.keys(world).length !== 0) {
        let map_data = reformatCountData(counts, world);
        setDrawData(map_data);
      }
    }
  }, [mapDataHistogram, world]);

  useEffect(() => {
    if (Object.keys(drawData).length !== 0 && Object.keys(world).length !== 0 && Object.keys(drawData).length !== 0) {
      choropleth({ inputRef }, drawData, {
        id: (d) => d.country, // country name, e.g. Zimbabwe
        value: (d) => d.count, // health-adjusted life expectancy
        range: d3.interpolateOrRd,
        features: countries,
        //  featureId: d => d.properties.name, // i.e., not ISO 3166-1 numeric
        borders: countryMesh,
        projection: d3.geoEqualEarth()
      });
    }
  }, [drawData, world]);
  const handleSliderChange = (event: any) => {
    setDateRange(event.target.value);
  };
  // @ts-ignore
  const reformatCountData = (data, worldData) => {
    var formatted_data = [];
    for (var entry in data) {
      formatted_data.push({ country: entry, count: data[entry] });
    }
    for (var country_geo in worldData['objects']['countries']['geometries']) {
      if (!(worldData['objects']['countries']['geometries'][country_geo]['properties']['name'] in data)) {
        formatted_data.push({ country: worldData['objects']['countries']['geometries'][country_geo]['properties']['name'], count: NaN });
      }
    }
    return formatted_data;
  };

  const choropleth = (
    { inputRef },
    data,
    {
      id = (d) => d.id, // given d in data, returns the feature id
      value = () => undefined, // given d in data, returns the quantitative value
      title, // given a feature f and possibly a datum d, returns the hover text
      format, // optional format specifier for the title
      scale = d3.scaleSequential, // type of color scale
      domain, // [min, max] values; input of color scale
      range = d3.interpolateBlues, // output of color scale
      // width = 640, // outer width, in pixels
      // height = 350, // outer height, in pixels
      projection, // a D3 projection; null for pre-projected geometry
      features, // a GeoJSON feature collection
      featureId = (d) => d.id, // given a feature, returns its id
      borders, // a GeoJSON object for stroking borders
      outline = projection && projection.rotate ? { type: 'Sphere' } : null, // a GeoJSON object for the background
      unknown = '#ccc', // fill color for missing data
      fill = 'white', // fill color for outline
      stroke = 'white', // stroke color for borders
      strokeLinecap = 'round', // stroke line cap for borders
      strokeLinejoin = 'round', // stroke line join for borders
      strokeWidth, // stroke width for borders
      strokeOpacity // stroke opacity for borders
    } = {}
  ) => {
    // Compute values.
    const N = d3.map(data, id);
    const V = d3.map(data, value).map((d) => (d == null ? NaN : +d));
    const Im = new d3.InternMap(N.map((id, i) => [id, i]));
    const If = d3.map(features.features, featureId);
    const container = d3.select(inputRef.current);
    container.selectAll('svg').remove();
    // Compute default domains.
    if (domain === undefined) domain = d3.extent(V);

    // Construct scales.
    const color = scale(domain, range);
    if (color.unknown && unknown !== undefined) color.unknown(unknown);
    //draw color bar
    const ticks = width / 64;
    const tickSize = 6;
    let tickFormat, tickValues;
    const svgColor = container
      .append('svg')
      .attr('width', width / 2)
      .attr('height', 50)
      .attr('viewBox', [0, 0, width / 2, 50])
      .style('overflow', 'visible')
      .style('display', 'block');

    let tickAdjust = (g) => g.selectAll('.tick line').attr('y1', 18 + 22 - 50);
    let x;

    // Continuous
    if (color.interpolate) {
      const n = Math.min(color.domain().length, color.range().length);

      x = color.copy().rangeRound(d3.quantize(d3.interpolate(0, width / 2 - marginRight), n));

      svgColor
        .append('image')
        .attr('x', 0)
        .attr('y', 18)
        .attr('width', width / 2)
        .attr('height', 50 - 18 - 22)
        .attr('preserveAspectRatio', 'none')
        .attr('xlink:href', ramp(color.copy().domain(d3.quantize(d3.interpolate(0, 1), n))).toDataURL());
    }

    // Sequential
    else if (color.interpolator) {
      x = Object.assign(color.copy().interpolator(d3.interpolateRound(0, width / 2)), {
        range() {
          return [0, width / 2];
        }
      });

      svgColor
        .append('image')
        .attr('x', 0)
        .attr('y', 18)
        .attr('width', width / 2)
        .attr('height', 10)
        .attr('preserveAspectRatio', 'none')
        .attr('xlink:href', ramp(color.interpolator()).toDataURL());

      // scaleSequentialQuantile doesn’t implement ticks or tickFormat.
      if (!x.ticks) {
        if (tickValues === undefined) {
          const n = Math.round(ticks + 1);
          tickValues = d3.range(n).map((i) => d3.quantile(color.domain(), i / (n - 1)));
        }
        if (typeof tickFormat !== 'function') {
          tickFormat = d3.format(tickFormat === undefined ? ',f' : tickFormat);
        }
      }
    }

    // Threshold
    else if (color.invertExtent) {
      const thresholds = color.thresholds
        ? color.thresholds() // scaleQuantize
        : color.quantiles
        ? color.quantiles() // scaleQuantile
        : color.domain(); // scaleThreshold

      const thresholdFormat = tickFormat === undefined ? (d) => d : typeof tickFormat === 'string' ? d3.format(tickFormat) : tickFormat;

      x = d3
        .scaleLinear()
        .domain([-1, color.range().length - 1])
        .rangeRound([marginLeft, width / 2]);

      svgColor
        .append('g')
        .selectAll('rect')
        .data(color.range())
        .join('rect')
        .attr('x', (d, i) => x(i - 1))
        .attr('y', 0)
        .attr('width', (d, i) => x(i) - x(i - 1))
        .attr('height', 10)
        .attr('fill', (d) => d);

      tickValues = d3.range(thresholds.length);
      tickFormat = (i) => thresholdFormat(thresholds[i], i);
    }

    // Ordinal
    else {
      x = d3
        .scaleBand()
        .domain(color.domain())
        .rangeRound([0, width / 2]);

      svgColor
        .append('g')
        .selectAll('rect')
        .data(color.domain())
        .join('rect')
        .attr('x', x)
        .attr('y', 18)
        .attr('width', Math.max(0, x.bandwidth() - 1))
        .attr('height', 10)
        .attr('fill', color);

      tickAdjust = () => {};
    }

    svgColor
      .append('g')
      .attr('transform', `translate(0,${28})`)
      .call(
        d3
          .axisBottom(x)
          .ticks(ticks, typeof tickFormat === 'string' ? tickFormat : undefined)
          .tickFormat(typeof tickFormat === 'function' ? tickFormat : undefined)
          .tickSize(tickSize)
          .tickValues(tickValues)
      )
      .call(tickAdjust)
      .call((g) => g.select('.domain').remove())
      .call((g) =>
        g
          .append('text')
          .attr('x', 0)
          .attr('y', 18 + 22 - 50 - 6)
          .attr('fill', 'currentColor')
          .attr('text-anchor', 'start')
          .attr('font-weight', 'bold')
          .attr('class', 'title')
          .text('Contributors by country of origin in workset')
      );

    // Compute titles.
    if (title === undefined) {
      format = color.tickFormat(100, format);
      title = (f, i) => `${f.properties.name}\n${format(V[i])}`;
    } else if (title !== null) {
      const T = title;
      const O = d3.map(data, (d) => d);
      title = (f, i) => T(f, O[i]);
    }

    // Compute the default height. If an outline object is specified, scale the projection to fit
    // the width, and then compute the corresponding height.
    if (height === undefined) {
      if (outline === undefined) {
        height = 400;
      } else {
        const [[x0, y0], [x1, y1]] = d3.geoPath(projection.fitWidth(width, outline)).bounds(outline);
        const dy = Math.ceil(y1 - y0),
          l = Math.min(Math.ceil(x1 - x0), dy);
        projection.scale((projection.scale() * (l - 1)) / l).precision(0.2);
        height = dy;
      }
    }

    // Construct a path generator.
    const path = d3.geoPath(projection);
    const svg = container
      .append('svg')
      .attr('width', width)
      .attr('height', height)
      .attr('viewBox', [0, 0, width, height])
      .attr('style', 'width: 100%; height: auto; height: intrinsic;');

    const zoom = d3.zoom().scaleExtent([0.5, 8]).on('zoom', zoomed);

    const g = svg.append('g');

    g.selectAll('path')
      .data(features.features)
      .join('path')
      .attr('fill', (d, i) => color(V[Im.get(If[i])]))
      .attr('d', path)
      .append('title')
      .text((d, i) => title(d, Im.get(If[i])));

    if (borders != null)
      g.append('path')
        .attr('pointer-events', 'none')
        .attr('fill', 'none')
        .attr('stroke', stroke)
        .attr('stroke-linecap', strokeLinecap)
        .attr('stroke-linejoin', strokeLinejoin)
        .attr('stroke-width', strokeWidth)
        .attr('stroke-opacity', strokeOpacity)
        .attr('d', path(borders));

    if (outline != null) g.append('path').attr('fill', 'none').attr('stroke', 'currentColor').attr('d', path(outline));

    // Append markers
    const markersG = svg
      .append('g')
      // .attr('transform', 'translate(0, 0) scale(0.5)')
      .selectAll('.marker')
      .data(cities)
      .enter()
      .append('circle')
      .attr('class', 'marker')
      .attr('cx', (d) => projection(d.coordinates)[0])
      .attr('cy', (d) => projection(d.coordinates)[1])
      .attr('r', (d) => (8 / maxPopulation) * d.population)
      // .attr('r', (d) => (maxPopulation > 8 ? (8 / maxPopulation) * d.population : d.population * 1.5))
      .each(function (d) {
        d.initialRadius = d3.select(this).attr('r');
      })
      .attr('fill', '#E91E63')
      .attr('stroke', '#FFFFFF')
      .on('mouseover', (event, d) => handleMarkerClick(event, d))
      .on('mouseout', () => {
        const div = d3.select('#tooltip');
        div.style('opacity', 0);
      });

    svg.call(zoom);

    function zoomed(event) {
      const { transform } = event;
      g.attr('transform', transform);
      g.attr('stroke-width', 1 / transform.k);

      markersG.attr('transform', transform);
      markersG.attr('stroke-width', 1 / transform.k);
      markersG.attr('r', (d) => d.initialRadius / transform.k);

      // markersG.selectAll("circle")
      //       .attr("r", d => d.initialRadius / transform.k);
    }
    function ramp(color, n = 256) {
      const canvas = document.createElement('canvas');
      canvas.width = n;
      canvas.height = 1;
      const context = canvas.getContext('2d');
      for (let i = 0; i < n; ++i) {
        context.fillStyle = color(i / (n - 1));
        context.fillRect(i, 0, 1, 1);
      }
      return canvas;
    }
    //return Object.assign(svg.node(), { scales: { color } });
  };

  const downloadData = (format: string) => {
    const container = document.getElementById('graph-container');
    const svgElements = Array.from(container.querySelectorAll('svg'));

    const newSvg = document.createElementNS('http://www.w3.org/2000/svg', 'svg');
    let yOffset = 0;
    const rightMargin = 10;

    svgElements.forEach((svgElement, index) => {
      const clonedSvg = svgElement.cloneNode(true);

      if (index === 1) {
        yOffset += svgElements[0].getBoundingClientRect().height;
      }
      clonedSvg.setAttribute('x', 10);
      clonedSvg.setAttribute('y', yOffset);
      newSvg.appendChild(clonedSvg);
    });

    // Adjust the width and height of the new SVG
    newSvg.setAttribute('width', container.offsetWidth + rightMargin);
    newSvg.setAttribute('height', yOffset + svgElements[1].getBoundingClientRect().height);
    if (format === 'svg') {
      const svgData = new XMLSerializer().serializeToString(newSvg);
      const blob = new Blob([svgData], { type: 'image/svg+xml;charset=utf-8' });
      saveAs(blob, 'map.svg');
    } else if (format === 'png') {
      const canvas = document.createElement('canvas');
      const ctx = canvas.getContext('2d');
      const DOMURL = window.URL || window.webkitURL || window;
      const svgData = new XMLSerializer().serializeToString(newSvg);

      const img = new Image();

      img.onload = function () {
        canvas.width = img.width;
        canvas.height = img.height;
        ctx.drawImage(img, 0, 0);
        const pngData = canvas.toDataURL('image/png');
        saveAs(pngData, 'map.png');
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
          Mapping Contributor Data
        </Typography>
      ) : (
        <NextLink href="/widget-details/mapping">
          <Typography variant="h3" sx={{ color: '#1e98d7', cursor: 'pointer' }}>
            Mapping Contributor Data
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
              data={datatableData}
              filename={`Contributor_Data${new Date().toISOString().split('T')[0]}.csv`}
              headers={mapCSVHeaders}
              style={{ textDecoration: 'none', color: 'inherit' }}
            >
              <MenuItem onClick={() => downloadData('csv')}>CSV data</MenuItem>
            </CSVLink>
          </Menu>
        </Stack>
      )}
      <Box sx={{ width: '100%', position: 'relative' }}>
        <div id="graph-container" ref={inputRef} />
        {loadingMap ? <CircularProgress color="inherit" sx={{ position: 'absolute', left: width / 2, top: height - 50 }} /> : ''}
        <CustomSlider value={dateRange} minValue={minDate} maxValue={maxDate} step={10} handleSliderChange={handleSliderChange} />
      </Box>
    </MainCard>
  );
};
