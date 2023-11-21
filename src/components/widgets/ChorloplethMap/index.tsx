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
  const chartWrapper = useRef(null);
  const dimensions = useResizeObserver(chartWrapper);
  let width = dimensions?.width || 500;
  console.log("Width A");
  console.log(width);
  let height = width / 2;
  console.log("Height A");
  console.log(height);
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
      const slice_size = curr.dob[0] === '-' ? 5 : 4;
      const dob = Number(curr.dob.slice(0, slice_size));
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
    return mapData.filter((item) => {
      const slice_size = item.dob[0] === '-' ? 5 : 4;
      return(Number(item.dob.slice(0, slice_size)) >= dateRange[0] && Number(item.dob.slice(0, slice_size)) <= dateRange[1])
    });
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
      choropleth(drawData, {
        id: (d) => d.country, // country name, e.g. Zimbabwe
        value: (d) => d.count, // health-adjusted life expectancy
        range: d3.interpolateYlOrRd,
        features: countries,
        //  featureId: d => d.properties.name, // i.e., not ISO 3166-1 numeric
        borders: countryMesh,
        projection: d3.geoEqualEarth()
      });
    }
  }, [drawData, world]);
  const handleSliderChange = (event: any) => {
    console.log("SLIDER CHANGE");
    let iframe = document.getElementById('map_frame');
    let iframeWindow = iframe.contentWindow;
    if (iframeWindow) {
        console.log(iframeWindow);
        console.log(event.target.value);
        iframeWindow.postMessage(event.target.value);
    }
//    const container = d3.select('#map_frame');
//    console.log(iframe);
//    console.log(drawData);
//    console.log(world);
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

  const iframeCode = `
    <div id="graph-container">
      <svg width='100%' height='100%'>
        <g>
          
        </g>
      </svg>
    </div>
    <div id="tooltip" style="position: absolute; text-align: left; width: auto; height: auto; padding: 5px 10px; font: 12px sans-serif; background: lightsteelblue; border: 0px; border-radius: 8px; pointer-events: none; z-index: 10; opacity: 0; left: 446px; top: 373px;"></div>
    <script src="https://cdn.jsdelivr.net/npm/d3@7"></script>
    <script src="https://unpkg.com/topojson-client@3"></script>
    <script type="module">
      const COUNTRIES_50M = ${JSON.stringify(world)}

      const MAP_DATA = [
        {
            "item": "http://viaf.org/viaf/42672419",
            "countryiso": "840",
            "dob": "1852-02-20T00:00:00Z",
            "city": "Erie",
            "cityCoords": "Point(-80.085213888 42.129561111)"
        },
        {
            "item": "http://viaf.org/viaf/32156757",
            "countryiso": "840",
            "dob": "1931-01-01T00:00:00Z",
            "city": "St. Louis",
            "cityCoords": "Point(-90.199444444 38.626388888)"
        },
        {
            "item": "http://viaf.org/viaf/120748592",
            "countryiso": "840",
            "dob": "1967-08-21T00:00:00Z",
            "city": "Boston",
            "cityCoords": "Point(-71.057777777 42.360277777)"
        },
        {
            "item": "http://viaf.org/viaf/4979209",
            "countryiso": "840",
            "dob": "1952-01-12T00:00:00Z",
            "city": "Los Angeles",
            "cityCoords": "Point(-118.24368 34.05223)"
        },
        {
            "item": "http://viaf.org/viaf/32188455",
            "countryiso": "840",
            "dob": "1949-04-01T00:00:00Z",
            "city": "Chicago",
            "cityCoords": "Point(-87.65005 41.85003)"
        },
        {
            "item": "http://viaf.org/viaf/84979632",
            "countryiso": "840",
            "dob": "1942-04-01T00:00:00Z",
            "city": "New York City",
            "cityCoords": "Point(-74.0 40.7)"
        },
        {
            "item": "http://viaf.org/viaf/61565157",
            "countryiso": "840",
            "dob": "1934-02-18T00:00:00Z",
            "city": "New York City",
            "cityCoords": "Point(-74.0 40.7)"
        },
        {
            "item": "http://viaf.org/viaf/85368853",
            "countryiso": "840",
            "dob": "1946-04-15T00:00:00Z",
            "city": "Philadelphia",
            "cityCoords": "Point(-75.163611111 39.952777777)"
        },
        {
            "item": "http://viaf.org/viaf/116333436",
            "countryiso": "840",
            "dob": "1957-09-01T00:00:00Z",
            "city": "Brooklyn",
            "cityCoords": "Point(-73.990277777 40.692777777)"
        },
        {
            "item": "http://viaf.org/viaf/114656846",
            "countryiso": "840",
            "dob": "1936-12-15T00:00:00Z",
            "city": "Detroit",
            "cityCoords": "Point(-83.0475 42.331666666)"
        },
        {
            "item": "http://viaf.org/viaf/205368142",
            "countryiso": "840",
            "dob": "1932-08-21T00:00:00Z",
            "city": "Chicago",
            "cityCoords": "Point(-87.65005 41.85003)"
        },
        {
            "item": "http://viaf.org/viaf/24604680",
            "countryiso": "840",
            "dob": "1936-01-01T00:00:00Z",
            "city": "Atlanta",
            "cityCoords": "Point(-84.390277777 33.756944444)"
        },
        {
            "item": "http://viaf.org/viaf/79187812",
            "countryiso": "840",
            "dob": "1928-12-28T00:00:00Z",
            "city": "Troy",
            "cityCoords": "Point(-85.967317 31.80196)"
        },
        {
            "item": "http://viaf.org/viaf/4276474",
            "countryiso": "840",
            "dob": "1963-01-01T00:00:00Z",
            "city": "Brooklyn",
            "cityCoords": "Point(-73.990277777 40.692777777)"
        },
        {
            "item": "http://viaf.org/viaf/10088",
            "countryiso": "840",
            "dob": "1818-02-14T00:00:00Z",
            "city": "Talbot County",
            "cityCoords": "Point(-76.18 38.75)"
        },
        {
            "item": "http://viaf.org/viaf/22198527",
            "countryiso": "840",
            "dob": "1858-06-20T00:00:00Z",
            "city": "Cleveland",
            "cityCoords": "Point(-81.669722222 41.482222222)"
        },
        {
            "item": "http://viaf.org/viaf/113894534",
            "countryiso": "840",
            "dob": "1884-01-02T00:00:00Z",
            "city": "Metropolis",
            "cityCoords": "Point(-88.72528 37.15306)"
        },
        {
            "item": "http://viaf.org/viaf/38589329",
            "countryiso": "840",
            "dob": "1924-07-30T00:00:00Z",
            "city": "Boonville",
            "cityCoords": "Point(-92.7417 38.965)"
        },
        {
            "item": "http://viaf.org/viaf/19770339",
            "countryiso": "840",
            "dob": "1875-12-19T00:00:00Z",
            "city": "New Canton",
            "cityCoords": "Point(-78.2994 37.7053)"
        },
        {
            "item": "http://viaf.org/viaf/70533676",
            "countryiso": "840",
            "dob": "1860-11-23T00:00:00Z",
            "city": "Wake County",
            "cityCoords": "Point(-78.65 35.79)"
        },
        {
            "item": "http://viaf.org/viaf/114534904",
            "countryiso": "840",
            "dob": "1872-06-19T00:00:00Z",
            "city": "Chatfield",
            "cityCoords": "Point(-96.4075 32.2417)"
        },
        {
            "item": "http://viaf.org/viaf/60323190",
            "countryiso": "840",
            "dob": "1843-04-17T00:00:00Z",
            "city": "Cumberland County",
            "cityCoords": "Point(-75.13 39.33)"
        },
        {
            "item": "http://viaf.org/viaf/207052572",
            "countryiso": "840",
            "dob": "1888-09-12T00:00:00Z",
            "city": "Washington, D.C.",
            "cityCoords": "Point(-77.036666666 38.895)"
        },
        {
            "item": "http://viaf.org/viaf/2481446",
            "countryiso": "840",
            "dob": "1914-03-01T00:00:00Z",
            "city": "Oklahoma City",
            "cityCoords": "Point(-97.5352 35.4823)"
        },
        {
            "item": "http://viaf.org/viaf/39400140",
            "countryiso": "840",
            "dob": "1952-08-28T00:00:00Z",
            "city": "Akron",
            "cityCoords": "Point(-81.517777777 41.073055555)"
        },
        {
            "item": "http://viaf.org/viaf/51687663",
            "countryiso": "250",
            "dob": "1937-02-11T00:00:00Z",
            "city": "Pointe-à-Pitre",
            "cityCoords": "Point(-61.533055555 16.241111111)"
        },
        {
            "item": "http://viaf.org/viaf/51687663",
            "countryiso": "250",
            "dob": "1934-02-11T00:00:00Z",
            "city": "Pointe-à-Pitre",
            "cityCoords": "Point(-61.533055555 16.241111111)"
        },
        {
            "item": "http://viaf.org/viaf/94353134",
            "countryiso": "840",
            "dob": "1934-01-01T00:00:00Z",
            "city": "Detroit",
            "cityCoords": "Point(-83.0475 42.331666666)"
        },
        {
            "item": "http://viaf.org/viaf/22150244",
            "countryiso": "036",
            "dob": "1928-01-01T00:00:00Z",
            "city": "Adelaide",
            "cityCoords": "Point(138.6 -34.9275)"
        },
        {
            "item": "http://viaf.org/viaf/14853051",
            "countryiso": "840",
            "dob": "1924-03-26T00:00:00Z",
            "city": "Hawarden",
            "cityCoords": "Point(-96.484444444 43.001111111)"
        },
        {
            "item": "http://viaf.org/viaf/24632881",
            "countryiso": "840",
            "dob": "1897-05-09T00:00:00Z",
            "city": "Washington, D.C.",
            "cityCoords": "Point(-77.036666666 38.895)"
        },
        {
            "item": "http://viaf.org/viaf/49355658",
            "countryiso": "840",
            "dob": "1963-03-12T00:00:00Z",
            "city": "Brooklyn",
            "cityCoords": "Point(-73.990277777 40.692777777)"
        },
        {
            "item": "http://viaf.org/viaf/93629125",
            "countryiso": "840",
            "dob": "1931-10-10T00:00:00Z",
            "city": "Berkeley",
            "cityCoords": "Point(-122.268055555 37.870277777)"
        },
        {
            "item": "http://viaf.org/viaf/93629125",
            "countryiso": "840",
            "dob": "1931-11-10T00:00:00Z",
            "city": "Berkeley",
            "cityCoords": "Point(-122.268055555 37.870277777)"
        },
        {
            "item": "http://viaf.org/viaf/51704538",
            "countryiso": "840",
            "dob": "1923-07-05T00:00:00Z",
            "city": "Norfolk",
            "cityCoords": "Point(-76.285277777 36.846944444)"
        },
        {
            "item": "http://viaf.org/viaf/46782756",
            "countryiso": "840",
            "dob": "1947-10-25T00:00:00Z",
            "city": "Miami",
            "cityCoords": "Point(-80.216666666 25.783333333)"
        },
        {
            "item": "http://viaf.org/viaf/49263848",
            "countryiso": "250",
            "dob": "1930-10-01T00:00:00Z",
            "city": "Lille",
            "cityCoords": "Point(3.0575 50.631944444)"
        },
        {
            "item": "http://viaf.org/viaf/7406725",
            "countryiso": "826",
            "dob": "1709-09-18T00:00:00Z",
            "city": "Lichfield",
            "cityCoords": "Point(-1.82653 52.6835)"
        },
        {
            "item": "http://viaf.org/viaf/19071210",
            "countryiso": "840",
            "dob": "1832-09-16T00:00:00Z",
            "city": "Fort Monroe",
            "cityCoords": "Point(-76.3075 37.003611)"
        },
        {
            "item": "http://viaf.org/viaf/223910377",
            "countryiso": "840",
            "dob": "1970-03-24T00:00:00Z",
            "city": "Queens",
            "cityCoords": "Point(-73.917777777 40.704166666)"
        },
        {
            "item": "http://viaf.org/viaf/18697102",
            "countryiso": "840",
            "dob": "1949-01-01T00:00:00Z",
            "city": "Mobile",
            "cityCoords": "Point(-88.052672222 30.727669444)"
        },
        {
            "item": "http://viaf.org/viaf/18697102",
            "countryiso": "840",
            "dob": "1949-01-01T00:00:00Z",
            "city": "Alabama",
            "cityCoords": "Point(-86.7 32.7)"
        },
        {
            "item": "http://viaf.org/viaf/228723087",
            "countryiso": "840",
            "dob": "1862-04-29T00:00:00Z",
            "city": "Oxford Township",
            "cityCoords": "Point(-90.3786 41.1944)"
        },
        {
            "item": "http://viaf.org/viaf/89664672",
            "countryiso": "156",
            "dob": "-0550-09-28T00:00:00Z",
            "city": "Qufu",
            "cityCoords": "Point(116.983333333 35.6)"
        },
        {
            "item": "http://viaf.org/viaf/89664672",
            "countryiso": "156",
            "dob": "-0551-10-03T00:00:00Z",
            "city": "Qufu",
            "cityCoords": "Point(116.983333333 35.6)"
        },
        {
            "item": "http://viaf.org/viaf/89664672",
            "countryiso": "156",
            "dob": "-0550-01-01T00:00:00Z",
            "city": "Qufu",
            "cityCoords": "Point(116.983333333 35.6)"
        },
        {
            "item": "http://viaf.org/viaf/27069077",
            "countryiso": "840",
            "dob": "1926-06-01T00:00:00Z",
            "city": "Los Angeles",
            "cityCoords": "Point(-118.24368 34.05223)"
        },
        {
            "item": "http://viaf.org/viaf/56612471",
            "countryiso": "756",
            "dob": "1887-10-06T00:00:00Z",
            "city": "La Chaux-de-Fonds",
            "cityCoords": "Point(6.829558333 47.099627777)"
        },
        {
            "item": "http://viaf.org/viaf/902884",
            "countryiso": "840",
            "dob": "1860-05-15T00:00:00Z",
            "city": "Savannah",
            "cityCoords": "Point(-81.103888888 32.050833333)"
        },
        {
            "item": "http://viaf.org/viaf/110963244",
            "countryiso": "124",
            "dob": "1930-05-24T00:00:00Z",
            "city": "Toronto",
            "cityCoords": "Point(-79.386666666 43.670277777)"
        },
        {
            "item": "http://viaf.org/viaf/112519589",
            "countryiso": "840",
            "dob": "1933-08-07T00:00:00Z",
            "city": "Shreveport",
            "cityCoords": "Point(-93.762777777 32.508055555)"
        },
        {
            "item": "http://viaf.org/viaf/40112714",
            "countryiso": "388",
            "dob": "1966-08-14T00:00:00Z",
            "city": "Kingston",
            "cityCoords": "Point(-76.793055555 17.971388888)"
        },
        {
            "item": "http://viaf.org/viaf/56943736",
            "countryiso": "840",
            "dob": "1966-02-10T00:00:00Z",
            "city": "New York City",
            "cityCoords": "Point(-74.0 40.7)"
        },
        {
            "item": "http://viaf.org/viaf/5023939",
            "countryiso": "826",
            "dob": "1934-06-20T00:00:00Z",
            "city": "Paisley",
            "cityCoords": "Point(-4.423888888 55.845555555)"
        },
        {
            "item": "http://viaf.org/viaf/100281565",
            "countryiso": "840",
            "dob": "1943-07-03T00:00:00Z",
            "city": "Bolton",
            "cityCoords": "Point(-78.405 34.32)"
        },
        {
            "item": "http://viaf.org/viaf/294321601",
            "countryiso": "840",
            "dob": "1888-01-01T00:00:00Z",
            "city": "Columbia",
            "cityCoords": "Point(-92.33407 38.95171)"
        },
        {
            "item": "http://viaf.org/viaf/34476326",
            "countryiso": "840",
            "dob": "1868-02-23T00:00:00Z",
            "city": "Great Barrington",
            "cityCoords": "Point(-73.3625 42.1958)"
        },
        {
            "item": "http://viaf.org/viaf/49256750",
            "countryiso": "840",
            "dob": "1936-03-12T00:00:00Z",
            "city": "Yellow Springs",
            "cityCoords": "Point(-83.892777777 39.801666666)"
        },
        {
            "item": "http://viaf.org/viaf/85689714",
            "countryiso": "840",
            "dob": "1933-01-15T00:00:00Z",
            "city": "Oscar",
            "cityCoords": "Point(-91.450833333 30.620833333)"
        },
        {
            "item": "http://viaf.org/viaf/17235442",
            "countryiso": "840",
            "dob": "1902-10-13T00:00:00Z",
            "city": "Alexandria",
            "cityCoords": "Point(-92.445194444 31.31125)"
        },
        {
            "item": "http://viaf.org/viaf/73872159",
            "countryiso": "840",
            "dob": "1903-05-30T00:00:00Z",
            "city": "Louisville",
            "cityCoords": "Point(-85.751388888 38.256111111)"
        },
        {
            "item": "http://viaf.org/viaf/24609247",
            "countryiso": "840",
            "dob": "1915-07-07T00:00:00Z",
            "city": "Birmingham",
            "cityCoords": "Point(-86.809444444 33.5175)"
        },
        {
            "item": "http://viaf.org/viaf/7145857775023020249",
            "countryiso": "840",
            "dob": "1902-08-16T00:00:00Z",
            "city": "Salt Lake City",
            "cityCoords": "Point(-111.883333333 40.75)"
        },
        {
            "item": "http://viaf.org/viaf/810591",
            "countryiso": "840",
            "dob": "1916-10-12T00:00:00Z",
            "city": "Charleston",
            "cityCoords": "Point(-79.931944444 32.783333333)"
        },
        {
            "item": "http://viaf.org/viaf/61622497",
            "countryiso": "840",
            "dob": "1939-05-31T00:00:00Z",
            "city": "Ocean Springs",
            "cityCoords": "Point(-88.79722 30.40972)"
        },
        {
            "item": "http://viaf.org/viaf/115793286",
            "countryiso": "840",
            "dob": "1950-09-07T00:00:00Z",
            "city": "Bedford",
            "cityCoords": "Point(-78.5042 40.0164)"
        },
        {
            "item": "http://viaf.org/viaf/10421072",
            "countryiso": "840",
            "dob": "1932-10-27T00:00:00Z",
            "city": "Chicago",
            "cityCoords": "Point(-87.65005 41.85003)"
        },
        {
            "item": "http://viaf.org/viaf/14792959",
            "countryiso": "840",
            "dob": "1937-08-12T00:00:00Z",
            "city": "Martinsburg",
            "cityCoords": "Point(-77.967777777 39.456388888)"
        },
        {
            "item": "http://viaf.org/viaf/34817061",
            "countryiso": "826",
            "dob": "1904-11-08T00:00:00Z",
            "city": "Stockport",
            "cityCoords": "Point(-2.149444444 53.408333333)"
        },
        {
            "item": "http://viaf.org/viaf/59300120",
            "countryiso": "840",
            "dob": "1828-01-01T00:00:00Z",
            "city": "Philadelphia",
            "cityCoords": "Point(-75.163611111 39.952777777)"
        },
        {
            "item": "http://viaf.org/viaf/59300120",
            "countryiso": "840",
            "dob": "1828-03-21T00:00:00Z",
            "city": "Philadelphia",
            "cityCoords": "Point(-75.163611111 39.952777777)"
        },
        {
            "item": "http://viaf.org/viaf/89827533",
            "countryiso": "826",
            "dob": "1944-01-23T00:00:00Z",
            "city": "Hamilton",
            "cityCoords": "Point(-4.039 55.777)"
        },
        {
            "item": "http://viaf.org/viaf/30822",
            "countryiso": "840",
            "dob": "1927-01-01T00:00:00Z",
            "city": "Louisville",
            "cityCoords": "Point(-85.751388888 38.256111111)"
        },
        {
            "item": "http://viaf.org/viaf/60504888",
            "countryiso": "840",
            "dob": "1924-01-01T00:00:00Z",
            "city": "Buffalo",
            "cityCoords": "Point(-78.878055555 42.886388888)"
        },
        {
            "item": "http://viaf.org/viaf/7386077",
            "countryiso": "840",
            "dob": "1928-04-04T00:00:00Z",
            "city": "St. Louis",
            "cityCoords": "Point(-90.199444444 38.626388888)"
        },
        {
            "item": "http://viaf.org/viaf/100177491",
            "countryiso": "250",
            "dob": "1832-11-09T00:00:00Z",
            "city": "Saujon",
            "cityCoords": "Point(-0.927777777 45.671388888)"
        },
        {
            "item": "http://viaf.org/viaf/112849684",
            "countryiso": "840",
            "dob": "1954-10-26T00:00:00Z",
            "city": "Washington, D.C.",
            "cityCoords": "Point(-77.036666666 38.895)"
        },
        {
            "item": "http://viaf.org/viaf/27186753",
            "countryiso": "840",
            "dob": "1953-01-01T00:00:00Z",
            "city": "Florida",
            "cityCoords": "Point(-81.631666666 28.133333333)"
        },
        {
            "item": "http://viaf.org/viaf/54204311",
            "countryiso": "840",
            "dob": "1957-01-29T00:00:00Z",
            "city": "Akron",
            "cityCoords": "Point(-81.517777777 41.073055555)"
        },
        {
            "item": "http://viaf.org/viaf/41943529",
            "countryiso": "840",
            "dob": "1856-02-22T00:00:00Z",
            "city": "Piscataway",
            "cityCoords": "Point(-76.9722 38.7006)"
        },
        {
            "item": "http://viaf.org/viaf/14024511",
            "countryiso": "840",
            "dob": "1963-06-26T00:00:00Z",
            "city": "Chicago",
            "cityCoords": "Point(-87.65005 41.85003)"
        },
        {
            "item": "http://viaf.org/viaf/6064675",
            "countryiso": "124",
            "dob": "1940-07-27T00:00:00Z",
            "city": "Saskatoon",
            "cityCoords": "Point(-106.683333333 52.133333333)"
        },
        {
            "item": "http://viaf.org/viaf/73171700",
            "countryiso": "840",
            "dob": "1965-08-07T00:00:00Z",
            "city": "Manhattan",
            "cityCoords": "Point(-73.994166666 40.728333333)"
        },
        {
            "item": "http://viaf.org/viaf/94063466",
            "countryiso": "840",
            "dob": "1952-01-01T00:00:00Z",
            "city": "Berkeley",
            "cityCoords": "Point(-122.268055555 37.870277777)"
        },
        {
            "item": "http://viaf.org/viaf/73186485",
            "countryiso": "840",
            "dob": "1965-09-25T00:00:00Z",
            "city": "Brooklyn",
            "cityCoords": "Point(-73.990277777 40.692777777)"
        },
        {
            "item": "http://viaf.org/viaf/29625340",
            "countryiso": "840",
            "dob": "1842-10-28T00:00:00Z",
            "city": "Philadelphia",
            "cityCoords": "Point(-75.163611111 39.952777777)"
        },
        {
            "item": "http://viaf.org/viaf/61578685",
            "countryiso": "826",
            "dob": "1922-06-08T00:00:00Z",
            "city": "Cambridgeshire",
            "cityCoords": "Point(0.0 52.333333333)"
        },
        {
            "item": "http://viaf.org/viaf/103645685",
            "countryiso": "826",
            "dob": "1924-06-23T00:00:00Z",
            "city": "Cardiff",
            "cityCoords": "Point(-3.179166666 51.481666666)"
        },
        {
            "item": "http://viaf.org/viaf/16237089",
            "countryiso": "840",
            "dob": "1878-01-30T00:00:00Z",
            "city": "North Adams",
            "cityCoords": "Point(-73.109166666 42.700833333)"
        },
        {
            "item": "http://viaf.org/viaf/283888077",
            "countryiso": "826",
            "dob": "1829-01-07T00:00:00Z",
            "city": "Baldock",
            "cityCoords": "Point(-0.188888888 51.989722222)"
        },
        {
            "item": "http://viaf.org/viaf/283721651",
            "countryiso": "826",
            "dob": "1851-01-05T00:00:00Z",
            "city": "Leeds",
            "cityCoords": "Point(-1.543611111 53.7975)"
        },
        {
            "item": "http://viaf.org/viaf/404649",
            "countryiso": "276",
            "dob": "1883-04-04T00:00:00Z",
            "city": "Brunswick",
            "cityCoords": "Point(10.521111111 52.269166666)"
        },
        {
            "item": "http://viaf.org/viaf/41888125",
            "countryiso": "826",
            "dob": "1730-12-13T00:00:00Z",
            "city": "Henley-on-Thames",
            "cityCoords": "Point(-0.902777777 51.536111111)"
        },
        {
            "item": "http://viaf.org/viaf/100300202",
            "countryiso": "840",
            "dob": "1805-12-10T00:00:00Z",
            "city": "Newburyport",
            "cityCoords": "Point(-70.877222222 42.8125)"
        },
        {
            "item": "http://viaf.org/viaf/22258358",
            "countryiso": "834",
            "dob": "1745-01-01T00:00:00Z",
            "city": "Isseke",
            "cityCoords": "Point(34.931267 -5.845883)"
        },
        {
            "item": "http://viaf.org/viaf/114575811",
            "countryiso": "840",
            "dob": "1943-03-23T00:00:00Z",
            "city": "Washington, D.C.",
            "cityCoords": "Point(-77.036666666 38.895)"
        },
        {
            "item": "http://viaf.org/viaf/2493397",
            "countryiso": "840",
            "dob": "1811-11-29T00:00:00Z",
            "city": "Boston",
            "cityCoords": "Point(-71.057777777 42.360277777)"
        },
        {
            "item": "http://viaf.org/viaf/102606627",
            "countryiso": "840",
            "dob": "1961-03-31T00:00:00Z",
            "city": "Queens",
            "cityCoords": "Point(-73.917777777 40.704166666)"
        },
        {
            "item": "http://viaf.org/viaf/91242501",
            "countryiso": "840",
            "dob": "1943-03-22T00:00:00Z",
            "city": "Louisville",
            "cityCoords": "Point(-85.751388888 38.256111111)"
        },
        {
            "item": "http://viaf.org/viaf/76414580",
            "countryiso": "840",
            "dob": "1939-12-22T00:00:00Z",
            "city": "Philadelphia",
            "cityCoords": "Point(-75.163611111 39.952777777)"
        },
        {
            "item": "http://viaf.org/viaf/53538369",
            "countryiso": "840",
            "dob": "1969-01-01T00:00:00Z",
            "city": "Kansas City",
            "cityCoords": "Point(-94.583333333 39.05)"
        },
        {
            "item": "http://viaf.org/viaf/95314512",
            "countryiso": "554",
            "dob": "1940-11-04T00:00:00Z",
            "city": "Wellington",
            "cityCoords": "Point(174.777222222 -41.288888888)"
        },
        {
            "item": "http://viaf.org/viaf/97716770",
            "countryiso": "840",
            "dob": "1911-04-08T00:00:00Z",
            "city": "Saint Paul",
            "cityCoords": "Point(-93.093611111 44.944166666)"
        },
        {
            "item": "http://viaf.org/viaf/36922585",
            "countryiso": "840",
            "dob": "1938-04-30T00:00:00Z",
            "city": "Los Angeles",
            "cityCoords": "Point(-118.24368 34.05223)"
        },
        {
            "item": "http://viaf.org/viaf/14898321",
            "countryiso": "840",
            "dob": "1894-03-17T00:00:00Z",
            "city": "Lillington",
            "cityCoords": "Point(-78.813611111 35.398611111)"
        },
        {
            "item": "http://viaf.org/viaf/2499691",
            "countryiso": "840",
            "dob": "1948-04-23T00:00:00Z",
            "city": "Evanston",
            "cityCoords": "Point(-87.6900587 42.0411414)"
        },
        {
            "item": "http://viaf.org/viaf/37519950",
            "countryiso": "840",
            "dob": "1952-03-01T00:00:00Z",
            "city": "Los Angeles",
            "cityCoords": "Point(-118.24368 34.05223)"
        },
        {
            "item": "http://viaf.org/viaf/32163533",
            "countryiso": "840",
            "dob": "1916-05-12T00:00:00Z",
            "city": "Nokomis",
            "cityCoords": "Point(-87.5647 31.0103)"
        },
        {
            "item": "http://viaf.org/viaf/75095023",
            "countryiso": "840",
            "dob": "1932-04-28T00:00:00Z",
            "city": "Chattanooga",
            "cityCoords": "Point(-85.267222222 35.045555555)"
        },
        {
            "item": "http://viaf.org/viaf/53334688",
            "countryiso": "840",
            "dob": "1928-10-03T00:00:00Z",
            "city": "Allegan",
            "cityCoords": "Point(-85.855277777 42.529166666)"
        },
        {
            "item": "http://viaf.org/viaf/105601809",
            "countryiso": "840",
            "dob": "1936-07-09T00:00:00Z",
            "city": "Harlem",
            "cityCoords": "Point(-73.948372222 40.809033333)"
        },
        {
            "item": "http://viaf.org/viaf/225230825",
            "countryiso": "840",
            "dob": "1912-11-19T00:00:00Z",
            "city": "Greenville",
            "cityCoords": "Point(-91.0483 33.3986)"
        },
        {
            "item": "http://viaf.org/viaf/225230825",
            "countryiso": "840",
            "dob": "1911-11-19T00:00:00Z",
            "city": "Greenville",
            "cityCoords": "Point(-91.0483 33.3986)"
        },
        {
            "item": "http://viaf.org/viaf/225230825",
            "countryiso": "840",
            "dob": "1911-11-19T00:00:00Z",
            "city": "Greenville",
            "cityCoords": "Point(-91.0483 33.3986)"
        },
        {
            "item": "http://viaf.org/viaf/114558743",
            "countryiso": "840",
            "dob": "1932-06-04T00:00:00Z",
            "city": "New Franklin",
            "cityCoords": "Point(-92.7383 39.0161)"
        },
        {
            "item": "http://viaf.org/viaf/77754753",
            "countryiso": "840",
            "dob": "1914-01-01T00:00:00Z",
            "city": "Madisonville",
            "cityCoords": "Point(-87.50194 37.3325)"
        },
        {
            "item": "http://viaf.org/viaf/79153789",
            "countryiso": "840",
            "dob": "1907-06-02T00:00:00Z",
            "city": "Boston",
            "cityCoords": "Point(-71.057777777 42.360277777)"
        },
        {
            "item": "http://viaf.org/viaf/32104515",
            "countryiso": "332",
            "dob": "1969-01-19T00:00:00Z",
            "city": "Port-au-Prince",
            "cityCoords": "Point(-72.338611111 18.5425)"
        },
        {
            "item": "http://viaf.org/viaf/32104515",
            "countryiso": "332",
            "dob": "1969-01-01T00:00:00Z",
            "city": "Port-au-Prince",
            "cityCoords": "Point(-72.338611111 18.5425)"
        },
        {
            "item": "http://viaf.org/viaf/32104515",
            "countryiso": "332",
            "dob": "1969-01-19T00:00:00Z",
            "city": "Haiti",
            "cityCoords": "Point(-72.8 19.0)"
        },
        {
            "item": "http://viaf.org/viaf/32104515",
            "countryiso": "332",
            "dob": "1969-01-01T00:00:00Z",
            "city": "Haiti",
            "cityCoords": "Point(-72.8 19.0)"
        },
        {
            "item": "http://viaf.org/viaf/84546714",
            "countryiso": "840",
            "dob": "1951-10-18T00:00:00Z",
            "city": "Port Huron",
            "cityCoords": "Point(-82.4375 42.980277777)"
        },
        {
            "item": "http://viaf.org/viaf/1644426",
            "countryiso": "840",
            "dob": "1948-09-11T00:00:00Z",
            "city": "Boston",
            "cityCoords": "Point(-71.057777777 42.360277777)"
        },
        {
            "item": "http://viaf.org/viaf/27256563",
            "countryiso": "840",
            "dob": "1916-01-04T00:00:00Z",
            "city": "New Haven",
            "cityCoords": "Point(-72.925 41.308333333)"
        },
        {
            "item": "http://viaf.org/viaf/27256563",
            "countryiso": "840",
            "dob": "1916-01-14T00:00:00Z",
            "city": "New Haven",
            "cityCoords": "Point(-72.925 41.308333333)"
        },
        {
            "item": "http://viaf.org/viaf/21090495",
            "countryiso": "840",
            "dob": "1948-11-01T00:00:00Z",
            "city": "Chicago",
            "cityCoords": "Point(-87.65005 41.85003)"
        },
        {
            "item": "http://viaf.org/viaf/21090495",
            "countryiso": "840",
            "dob": "1948-11-16T00:00:00Z",
            "city": "Chicago",
            "cityCoords": "Point(-87.65005 41.85003)"
        },
        {
            "item": "http://viaf.org/viaf/48498679",
            "countryiso": "840",
            "dob": "1891-12-28T00:00:00Z",
            "city": "Columbus",
            "cityCoords": "Point(-88.415 33.501666666)"
        },
        {
            "item": "http://viaf.org/viaf/262958884",
            "countryiso": "826",
            "dob": "1947-01-01T00:00:00Z",
            "city": "England",
            "cityCoords": "Point(22.771277777 53.207777777)"
        },
        {
            "item": "http://viaf.org/viaf/262958884",
            "countryiso": "826",
            "dob": "1947-01-01T00:00:00Z",
            "city": "England",
            "cityCoords": "Point(-1.0 53.0)"
        },
        {
            "item": "http://viaf.org/viaf/51135516",
            "countryiso": "840",
            "dob": "1916-09-13T00:00:00Z",
            "city": "Washington, D.C.",
            "cityCoords": "Point(-77.036666666 38.895)"
        },
        {
            "item": "http://viaf.org/viaf/50903316",
            "countryiso": "840",
            "dob": "1952-12-31T00:00:00Z",
            "city": "Washington, D.C.",
            "cityCoords": "Point(-77.036666666 38.895)"
        },
        {
            "item": "http://viaf.org/viaf/59130011",
            "countryiso": "840",
            "dob": "1910-10-12T00:00:00Z",
            "city": "Paducah",
            "cityCoords": "Point(-88.6275 37.072222222)"
        },
        {
            "item": "http://viaf.org/viaf/48939433",
            "countryiso": "840",
            "dob": "1902-12-05T00:00:00Z",
            "city": "Darlington County",
            "cityCoords": "Point(-79.96 34.33)"
        },
        {
            "item": "http://viaf.org/viaf/27062769",
            "countryiso": "840",
            "dob": "1789-09-15T00:00:00Z",
            "city": "Burlington",
            "cityCoords": "Point(-74.8525 40.0784)"
        },
        {
            "item": "http://viaf.org/viaf/97644708",
            "countryiso": "840",
            "dob": "1924-08-02T00:00:00Z",
            "city": "Harlem",
            "cityCoords": "Point(-73.948372222 40.809033333)"
        },
        {
            "item": "http://viaf.org/viaf/49261062",
            "countryiso": "840",
            "dob": "1882-04-27T00:00:00Z",
            "city": "Camden County",
            "cityCoords": "Point(-74.96 39.8)"
        },
        {
            "item": "http://viaf.org/viaf/64053034",
            "countryiso": "840",
            "dob": "1939-03-25T00:00:00Z",
            "city": "New York City",
            "cityCoords": "Point(-74.0 40.7)"
        },
        {
            "item": "http://viaf.org/viaf/84582743",
            "countryiso": "840",
            "dob": "1925-12-05T00:00:00Z",
            "city": "Jackson",
            "cityCoords": "Point(-90.184722222 32.298888888)"
        },
        {
            "item": "http://viaf.org/viaf/7390509",
            "countryiso": "826",
            "dob": "1892-03-09T00:00:00Z",
            "city": "Brighton",
            "cityCoords": "Point(-0.1375 50.820833333)"
        },
        {
            "item": "http://viaf.org/viaf/29539664",
            "countryiso": "840",
            "dob": "1938-02-22T00:00:00Z",
            "city": "Chattanooga",
            "cityCoords": "Point(-85.267222222 35.045555555)"
        },
        {
            "item": "http://viaf.org/viaf/79308808",
            "countryiso": "780",
            "dob": "1922-09-01T00:00:00Z",
            "city": "Diego Martin",
            "cityCoords": "Point(-61.5581 10.708)"
        },
        {
            "item": "http://viaf.org/viaf/111981061",
            "countryiso": "840",
            "dob": "1916-09-05T00:00:00Z",
            "city": "Augusta",
            "cityCoords": "Point(-81.975 33.47)"
        },
        {
            "item": "http://viaf.org/viaf/110080240",
            "countryiso": "840",
            "dob": "1895-02-25T00:00:00Z",
            "city": "Providence",
            "cityCoords": "Point(-71.41283 41.82399)"
        },
        {
            "item": "http://viaf.org/viaf/92522828",
            "countryiso": "840",
            "dob": "1904-05-31T00:00:00Z",
            "city": "Harlem",
            "cityCoords": "Point(-73.948372222 40.809033333)"
        },
        {
            "item": "http://viaf.org/viaf/30423716",
            "countryiso": "840",
            "dob": "1927-02-06T00:00:00Z",
            "city": "Philadelphia",
            "cityCoords": "Point(-75.163611111 39.952777777)"
        },
        {
            "item": "http://viaf.org/viaf/17242572",
            "countryiso": "840",
            "dob": "1922-12-25T00:00:00Z",
            "city": "Pittsburgh",
            "cityCoords": "Point(-80.0 40.441666666)"
        },
        {
            "item": "http://viaf.org/viaf/10744733",
            "countryiso": "328",
            "dob": "1898-12-18T00:00:00Z",
            "city": "Georgetown",
            "cityCoords": "Point(-58.150833333 6.805833333)"
        },
        {
            "item": "http://viaf.org/viaf/108440088",
            "countryiso": "840",
            "dob": "1939-01-27T00:00:00Z",
            "city": "St. Louis",
            "cityCoords": "Point(-90.199444444 38.626388888)"
        },
        {
            "item": "http://viaf.org/viaf/19706779",
            "countryiso": "840",
            "dob": "1931-09-12T00:00:00Z",
            "city": "Philadelphia",
            "cityCoords": "Point(-75.163611111 39.952777777)"
        },
        {
            "item": "http://viaf.org/viaf/54160783",
            "countryiso": "388",
            "dob": "1941-09-15T00:00:00Z",
            "city": "Lucea",
            "cityCoords": "Point(-78.17356 18.45095)"
        },
        {
            "item": "http://viaf.org/viaf/92181742",
            "countryiso": "840",
            "dob": "1923-05-08T00:00:00Z",
            "city": "Haverstraw",
            "cityCoords": "Point(-73.966944444 41.196388888)"
        },
        {
            "item": "http://viaf.org/viaf/49244542",
            "countryiso": "840",
            "dob": "1937-11-01T00:00:00Z",
            "city": "New York City",
            "cityCoords": "Point(-74.0 40.7)"
        },
        {
            "item": "http://viaf.org/viaf/27442137",
            "countryiso": "388",
            "dob": "1886-10-15T00:00:00Z",
            "city": "Jamaica",
            "cityCoords": "Point(-77.4 18.18)"
        },
        {
            "item": "http://viaf.org/viaf/87061403",
            "countryiso": "332",
            "dob": "1953-04-13T00:00:00Z",
            "city": "Port-au-Prince",
            "cityCoords": "Point(-72.338611111 18.5425)"
        },
        {
            "item": "http://viaf.org/viaf/235439",
            "countryiso": "840",
            "dob": "1961-01-01T00:00:00Z",
            "city": "The Bronx",
            "cityCoords": "Point(-73.873207 40.84676)"
        },
        {
            "item": "http://viaf.org/viaf/93986181",
            "countryiso": "840",
            "dob": "1962-01-01T00:00:00Z",
            "city": "Los Angeles",
            "cityCoords": "Point(-118.24368 34.05223)"
        },
        {
            "item": "http://viaf.org/viaf/120212810",
            "countryiso": "840",
            "dob": "1956-12-22T00:00:00Z",
            "city": "Fort Eisenhower",
            "cityCoords": "Point(-82.135277777 33.413333333)"
        },
        {
            "item": "http://viaf.org/viaf/100269725",
            "countryiso": "840",
            "dob": "1939-07-22T00:00:00Z",
            "city": "St. Louis",
            "cityCoords": "Point(-90.199444444 38.626388888)"
        },
        {
            "item": "http://viaf.org/viaf/10107885",
            "countryiso": "780",
            "dob": "1957-01-15T00:00:00Z",
            "city": "Trinidad and Tobago",
            "cityCoords": "Point(-61.516666666 10.666666666)"
        },
        {
            "item": "http://viaf.org/viaf/115553031",
            "countryiso": "826",
            "dob": "1960-02-02T00:00:00Z",
            "city": "London",
            "cityCoords": "Point(-0.1275 51.507222222)"
        },
        {
            "item": "http://viaf.org/viaf/79117120",
            "countryiso": "840",
            "dob": "1963-02-12T00:00:00Z",
            "city": "Columbus",
            "cityCoords": "Point(-83.000555555 39.962222222)"
        },
        {
            "item": "http://viaf.org/viaf/59266210",
            "countryiso": "840",
            "dob": "1966-01-05T00:00:00Z",
            "city": "Tallahassee",
            "cityCoords": "Point(-84.280633333 30.438736111)"
        },
        {
            "item": "http://viaf.org/viaf/92573570",
            "countryiso": "840",
            "dob": "1956-01-01T00:00:00Z",
            "city": "Kansas City",
            "cityCoords": "Point(-94.676388888 39.106666666)"
        },
        {
            "item": "http://viaf.org/viaf/4984569",
            "countryiso": "840",
            "dob": "1956-01-01T00:00:00Z",
            "city": "Philadelphia",
            "cityCoords": "Point(-75.163611111 39.952777777)"
        },
        {
            "item": "http://viaf.org/viaf/4984569",
            "countryiso": "840",
            "dob": "1957-01-01T00:00:00Z",
            "city": "Philadelphia",
            "cityCoords": "Point(-75.163611111 39.952777777)"
        },
        {
            "item": "http://viaf.org/viaf/18946940",
            "countryiso": "840",
            "dob": "1932-06-16T00:00:00Z",
            "city": "Washington, D.C.",
            "cityCoords": "Point(-77.036666666 38.895)"
        },
        {
            "item": "http://viaf.org/viaf/76313268",
            "countryiso": "250",
            "dob": "1953-12-03T00:00:00Z",
            "city": "Fort-de-France",
            "cityCoords": "Point(-61.066666666 14.6)"
        },
        {
            "item": "http://viaf.org/viaf/114552168",
            "countryiso": "840",
            "dob": "1929-03-01T00:00:00Z",
            "city": "New York City",
            "cityCoords": "Point(-74.0 40.7)"
        },
        {
            "item": "http://viaf.org/viaf/7835148574367824430003",
            "countryiso": "840",
            "dob": "1957-04-11T00:00:00Z",
            "city": "Benson",
            "cityCoords": "Point(-95.6 45.315)"
        },
        {
            "item": "http://viaf.org/viaf/59702657",
            "countryiso": "840",
            "dob": "1953-01-01T00:00:00Z",
            "city": "Philadelphia",
            "cityCoords": "Point(-75.163611111 39.952777777)"
        },
        {
            "item": "http://viaf.org/viaf/51705494",
            "countryiso": "840",
            "dob": "1934-06-06T00:00:00Z",
            "city": "Plainview",
            "cityCoords": "Point(-83.427777777 33.571944444)"
        },
        {
            "item": "http://viaf.org/viaf/34476825",
            "countryiso": "840",
            "dob": "1910-01-08T00:00:00Z",
            "city": "Noblesville",
            "cityCoords": "Point(-86.0214 40.05)"
        },
        {
            "item": "http://viaf.org/viaf/68948451",
            "countryiso": "840",
            "dob": "1934-07-20T00:00:00Z",
            "city": "Sweet Home",
            "cityCoords": "Point(-92.243333333 34.681388888)"
        },
        {
            "item": "http://viaf.org/viaf/67861420",
            "countryiso": "840",
            "dob": "1949-07-19T00:00:00Z",
            "city": "Hampton",
            "cityCoords": "Point(-76.360126 37.034946)"
        },
        {
            "item": "http://viaf.org/viaf/79294800",
            "countryiso": "780",
            "dob": "1911-02-12T00:00:00Z",
            "city": "Port of Spain",
            "cityCoords": "Point(-61.516666666 10.666666666)"
        },
        {
            "item": "http://viaf.org/viaf/44315795",
            "countryiso": "840",
            "dob": "1901-02-01T00:00:00Z",
            "city": "Joplin",
            "cityCoords": "Point(-94.5131 37.0842)"
        },
        {
            "item": "http://viaf.org/viaf/108495772",
            "countryiso": "840",
            "dob": "1944-02-09T00:00:00Z",
            "city": "Eatonton",
            "cityCoords": "Point(-83.387777777 33.326388888)"
        },
        {
            "item": "http://viaf.org/viaf/100247116",
            "countryiso": "840",
            "dob": "1909-06-24T00:00:00Z",
            "city": "Glen Ellyn",
            "cityCoords": "Point(-88.063055555 41.871111111)"
        },
        {
            "item": "http://viaf.org/viaf/100247116",
            "countryiso": "840",
            "dob": "1912-06-22T00:00:00Z",
            "city": "Glen Ellyn",
            "cityCoords": "Point(-88.063055555 41.871111111)"
        },
        {
            "item": "http://viaf.org/viaf/100247116",
            "countryiso": "840",
            "dob": "1909-06-24T00:00:00Z",
            "city": "Chicago",
            "cityCoords": "Point(-87.65005 41.85003)"
        },
        {
            "item": "http://viaf.org/viaf/100247116",
            "countryiso": "840",
            "dob": "1912-06-22T00:00:00Z",
            "city": "Chicago",
            "cityCoords": "Point(-87.65005 41.85003)"
        },
        {
            "item": "http://viaf.org/viaf/2480890",
            "countryiso": "826",
            "dob": "1685-06-30T00:00:00Z",
            "city": "Barnstaple",
            "cityCoords": "Point(-4.0489 51.0823)"
        },
        {
            "item": "http://viaf.org/viaf/112248361",
            "countryiso": "840",
            "dob": "1912-11-30T00:00:00Z",
            "city": "Fort Scott",
            "cityCoords": "Point(-94.701944444 37.835277777)"
        },
        {
            "item": "http://viaf.org/viaf/2489917",
            "countryiso": "840",
            "dob": "1908-10-12T00:00:00Z",
            "city": "Old Saybrook",
            "cityCoords": "Point(-72.3762 41.29177)"
        },
        {
            "item": "http://viaf.org/viaf/2489917",
            "countryiso": "840",
            "dob": "1908-10-12T00:00:00Z",
            "city": "Old Saybrook",
            "cityCoords": "Point(-72.3825 41.293888888)"
        },
        {
            "item": "http://viaf.org/viaf/50532638",
            "countryiso": "840",
            "dob": "1874-09-06T00:00:00Z",
            "city": "Smithfield",
            "cityCoords": "Point(-80.7806 40.2708)"
        },
        {
            "item": "http://viaf.org/viaf/121884197",
            "countryiso": "840",
            "dob": "1921-08-31T00:00:00Z",
            "city": "Pennsylvania",
            "cityCoords": "Point(-77.5 41.0)"
        },
        {
            "item": "http://viaf.org/viaf/54167278",
            "countryiso": "840",
            "dob": "1909-07-14T00:00:00Z",
            "city": "Chicago",
            "cityCoords": "Point(-87.65005 41.85003)"
        },
        {
            "item": "http://viaf.org/viaf/3997852",
            "countryiso": "840",
            "dob": "1932-08-28T00:00:00Z",
            "city": "Detroit",
            "cityCoords": "Point(-83.0475 42.331666666)"
        },
        {
            "item": "http://viaf.org/viaf/33142854",
            "countryiso": "388",
            "dob": "1940-06-05T00:00:00Z",
            "city": "Westmoreland Parish",
            "cityCoords": "Point(-78.15 18.233333333)"
        },
        {
            "item": "http://viaf.org/viaf/79339139",
            "countryiso": "840",
            "dob": "1927-10-08T00:00:00Z",
            "city": "D'Lo",
            "cityCoords": "Point(-89.9011 31.9867)"
        },
        {
            "item": "http://viaf.org/viaf/79061366",
            "countryiso": "328",
            "dob": "1926-08-13T00:00:00Z",
            "city": "Georgetown",
            "cityCoords": "Point(-58.150833333 6.805833333)"
        },
        {
            "item": "http://viaf.org/viaf/109339260",
            "countryiso": "276",
            "dob": "1900-03-23T00:00:00Z",
            "city": "Elberfeld",
            "cityCoords": "Point(7.149167 51.257222)"
        },
        {
            "item": "http://viaf.org/viaf/70175028",
            "countryiso": "840",
            "dob": "1916-01-01T00:00:00Z",
            "city": "Richmond",
            "cityCoords": "Point(-77.436666666 37.540833333)"
        },
        {
            "item": "http://viaf.org/viaf/56616931",
            "countryiso": "840",
            "dob": "1906-09-27T00:00:00Z",
            "city": "Anadarko",
            "cityCoords": "Point(-98.246111111 35.069166666)"
        },
        {
            "item": "http://viaf.org/viaf/17250651",
            "countryiso": "840",
            "dob": "1933-12-25T00:00:00Z",
            "city": "Baltimore",
            "cityCoords": "Point(-76.615 39.286388888)"
        },
        {
            "item": "http://viaf.org/viaf/39374972",
            "countryiso": "840",
            "dob": "1939-06-26T00:00:00Z",
            "city": "Philadelphia",
            "cityCoords": "Point(-75.163611111 39.952777777)"
        },
        {
            "item": "http://viaf.org/viaf/73052410",
            "countryiso": "840",
            "dob": "1952-10-22T00:00:00Z",
            "city": "Long Island City",
            "cityCoords": "Point(-73.948136111 40.750422222)"
        },
        {
            "item": "http://viaf.org/viaf/92812022",
            "countryiso": "840",
            "dob": "1959-01-01T00:00:00Z",
            "city": "Columbus",
            "cityCoords": "Point(-84.940277777 32.492222222)"
        },
        {
            "item": "http://viaf.org/viaf/79444970",
            "countryiso": "840",
            "dob": "1919-12-17T00:00:00Z",
            "city": "Cheyenne",
            "cityCoords": "Point(-104.801944444 41.145555555)"
        },
        {
            "item": "http://viaf.org/viaf/113723435",
            "countryiso": "840",
            "dob": "1917-06-07T00:00:00Z",
            "city": "Topeka",
            "cityCoords": "Point(-95.67804 39.04833)"
        },
        {
            "item": "http://viaf.org/viaf/80007399",
            "countryiso": "840",
            "dob": "1921-08-11T00:00:00Z",
            "city": "Ithaca",
            "cityCoords": "Point(-76.5 42.443333333)"
        },
        {
            "item": "http://viaf.org/viaf/79257115",
            "countryiso": "840",
            "dob": "1941-09-23T00:00:00Z",
            "city": "Chicago",
            "cityCoords": "Point(-87.65005 41.85003)"
        },
        {
            "item": "http://viaf.org/viaf/10407251",
            "countryiso": "840",
            "dob": "1908-09-18T00:00:00Z",
            "city": "Indianapolis",
            "cityCoords": "Point(-86.158055555 39.768611111)"
        },
        {
            "item": "http://viaf.org/viaf/10407251",
            "countryiso": "840",
            "dob": "1908-01-01T00:00:00Z",
            "city": "Indianapolis",
            "cityCoords": "Point(-86.158055555 39.768611111)"
        },
        {
            "item": "http://viaf.org/viaf/6972499",
            "countryiso": "840",
            "dob": "1927-06-24T00:00:00Z",
            "city": "McKeesport",
            "cityCoords": "Point(-79.845005555 40.341877777)"
        },
        {
            "item": "http://viaf.org/viaf/92928559",
            "countryiso": "840",
            "dob": "1970-01-01T00:00:00Z",
            "city": "Boston",
            "cityCoords": "Point(-71.057777777 42.360277777)"
        },
        {
            "item": "http://viaf.org/viaf/95317952",
            "countryiso": "376",
            "dob": "1940-12-22T00:00:00Z",
            "city": "Tiberias",
            "cityCoords": "Point(35.524722222 32.789722222)"
        },
        {
            "item": "http://viaf.org/viaf/93148367",
            "countryiso": "840",
            "dob": "1954-05-22T00:00:00Z",
            "city": "Los Angeles",
            "cityCoords": "Point(-118.24368 34.05223)"
        },
        {
            "item": "http://viaf.org/viaf/92788858",
            "countryiso": "840",
            "dob": "1968-01-01T00:00:00Z",
            "city": "Monroe",
            "cityCoords": "Point(-92.1183 32.5094)"
        },
        {
            "item": "http://viaf.org/viaf/75951930",
            "countryiso": "840",
            "dob": "1956-01-18T00:00:00Z",
            "city": "Trenton",
            "cityCoords": "Point(-74.756111111 40.221666666)"
        },
        {
            "item": "http://viaf.org/viaf/66606242",
            "countryiso": "840",
            "dob": "1891-04-13T00:00:00Z",
            "city": "Chicago",
            "cityCoords": "Point(-87.65005 41.85003)"
        },
        {
            "item": "http://viaf.org/viaf/69151887",
            "countryiso": "840",
            "dob": "1969-11-06T00:00:00Z",
            "city": "New York City",
            "cityCoords": "Point(-74.0 40.7)"
        },
        {
            "item": "http://viaf.org/viaf/102136079",
            "countryiso": "840",
            "dob": "1969-03-23T00:00:00Z",
            "city": "New York City",
            "cityCoords": "Point(-74.0 40.7)"
        },
        {
            "item": "http://viaf.org/viaf/74641935",
            "countryiso": "840",
            "dob": "1947-11-22T00:00:00Z",
            "city": "Willimantic",
            "cityCoords": "Point(-72.2173387 41.7152799)"
        },
        {
            "item": "http://viaf.org/viaf/74641935",
            "countryiso": "840",
            "dob": "1947-11-22T00:00:00Z",
            "city": "Windham County",
            "cityCoords": "Point(-71.99 41.83)"
        },
        {
            "item": "http://viaf.org/viaf/56826697",
            "countryiso": "840",
            "dob": "1959-05-04T00:00:00Z",
            "city": "Detroit",
            "cityCoords": "Point(-83.0475 42.331666666)"
        },
        {
            "item": "http://viaf.org/viaf/72065552",
            "countryiso": "840",
            "dob": "1941-11-30T00:00:00Z",
            "city": "Pittsburgh",
            "cityCoords": "Point(-80.0 40.441666666)"
        },
        {
            "item": "http://viaf.org/viaf/75565863",
            "countryiso": "840",
            "dob": "1930-05-20T00:00:00Z",
            "city": "Rennert",
            "cityCoords": "Point(-79.080555555 34.813055555)"
        },
        {
            "item": "http://viaf.org/viaf/58346640",
            "countryiso": "840",
            "dob": "1963-09-25T00:00:00Z",
            "city": "Fort Lauderdale",
            "cityCoords": "Point(-80.141944444 26.135833333)"
        },
        {
            "item": "http://viaf.org/viaf/165884191",
            "countryiso": "840",
            "dob": "1972-02-03T00:00:00Z",
            "city": "New York City",
            "cityCoords": "Point(-74.0 40.7)"
        },
        {
            "item": "http://viaf.org/viaf/111109777",
            "countryiso": "840",
            "dob": "1939-01-01T00:00:00Z",
            "city": "Kansas City",
            "cityCoords": "Point(-94.676388888 39.106666666)"
        },
        {
            "item": "http://viaf.org/viaf/122011468",
            "countryiso": "826",
            "dob": "1682-01-01T00:00:00Z",
            "city": "London",
            "cityCoords": "Point(-0.1275 51.507222222)"
        },
        {
            "item": "http://viaf.org/viaf/122011468",
            "countryiso": "826",
            "dob": "1674-01-01T00:00:00Z",
            "city": "London",
            "cityCoords": "Point(-0.1275 51.507222222)"
        },
        {
            "item": "http://viaf.org/viaf/122011468",
            "countryiso": "826",
            "dob": "1682-01-01T00:00:00Z",
            "city": "London",
            "cityCoords": "Point(-0.1275 51.507222222)"
        },
        {
            "item": "http://viaf.org/viaf/6644345",
            "countryiso": "036",
            "dob": "1980-02-01T00:00:00Z",
            "city": "Manly",
            "cityCoords": "Point(151.2844444 -33.798333333)"
        },
        {
            "item": "http://viaf.org/viaf/53805192",
            "countryiso": "840",
            "dob": "1962-01-01T00:00:00Z",
            "city": "Hamilton",
            "cityCoords": "Point(-84.565 39.395833333)"
        },
        {
            "item": "http://viaf.org/viaf/114536196",
            "countryiso": "388",
            "dob": "1904-01-27T00:00:00Z",
            "city": "Jamaica",
            "cityCoords": "Point(-77.4 18.18)"
        },
        {
            "item": "http://viaf.org/viaf/48439100",
            "countryiso": "840",
            "dob": "1954-01-01T00:00:00Z",
            "city": "Pittsburgh",
            "cityCoords": "Point(-80.0 40.441666666)"
        },
        {
            "item": "http://viaf.org/viaf/17344060",
            "countryiso": "840",
            "dob": "1950-01-01T00:00:00Z",
            "city": "New York City",
            "cityCoords": "Point(-74.0 40.7)"
        },
        {
            "item": "http://viaf.org/viaf/110002162",
            "countryiso": "840",
            "dob": "1944-08-25T00:00:00Z",
            "city": "Bakersfield",
            "cityCoords": "Point(-119.018611111 35.405833333)"
        },
        {
            "item": "http://viaf.org/viaf/53726887",
            "countryiso": "840",
            "dob": "1926-01-01T00:00:00Z",
            "city": "Cleveland",
            "cityCoords": "Point(-81.669722222 41.482222222)"
        },
        {
            "item": "http://viaf.org/viaf/53726887",
            "countryiso": "840",
            "dob": "1926-01-01T00:00:00Z",
            "city": "United States of America",
            "cityCoords": "Point(-98.5795 39.828175)"
        },
        {
            "item": "http://viaf.org/viaf/61589936",
            "countryiso": "659",
            "dob": "1958-03-13T00:00:00Z",
            "city": "Saint Kitts",
            "cityCoords": "Point(-62.747222 17.319722)"
        },
        {
            "item": "http://viaf.org/viaf/66591441",
            "countryiso": "840",
            "dob": "1893-07-01T00:00:00Z",
            "city": "Atlanta",
            "cityCoords": "Point(-84.390277777 33.756944444)"
        },
        {
            "item": "http://viaf.org/viaf/108676051",
            "countryiso": "840",
            "dob": "1929-04-09T00:00:00Z",
            "city": "Brooklyn",
            "cityCoords": "Point(-73.990277777 40.692777777)"
        },
        {
            "item": "http://viaf.org/viaf/59134267",
            "countryiso": "840",
            "dob": "1919-07-16T00:00:00Z",
            "city": "Great Barrington",
            "cityCoords": "Point(-73.3625 42.1958)"
        },
        {
            "item": "http://viaf.org/viaf/85651926",
            "countryiso": "840",
            "dob": "1950-02-18T00:00:00Z",
            "city": "Philadelphia",
            "cityCoords": "Point(-75.163611111 39.952777777)"
        },
        {
            "item": "http://viaf.org/viaf/61554533",
            "countryiso": "840",
            "dob": "1924-06-23T00:00:00Z",
            "city": "Athens",
            "cityCoords": "Point(-86.966666666 34.791666666)"
        },
        {
            "item": "http://viaf.org/viaf/64335049",
            "countryiso": "840",
            "dob": "1904-06-14T00:00:00Z",
            "city": "Macon County",
            "cityCoords": "Point(-85.693611111 32.385277777)"
        },
        {
            "item": "http://viaf.org/viaf/85327929",
            "countryiso": "840",
            "dob": "1928-06-06T00:00:00Z",
            "city": "Greer",
            "cityCoords": "Point(-82.225 34.930277777)"
        },
        {
            "item": "http://viaf.org/viaf/76446514",
            "countryiso": "840",
            "dob": "1962-01-01T00:00:00Z",
            "city": "Washington, D.C.",
            "cityCoords": "Point(-77.036666666 38.895)"
        },
        {
            "item": "http://viaf.org/viaf/109812216",
            "countryiso": "840",
            "dob": "1906-10-13T00:00:00Z",
            "city": "Wilmington",
            "cityCoords": "Point(-75.551388888 39.748333333)"
        },
        {
            "item": "http://viaf.org/viaf/109379749",
            "countryiso": "840",
            "dob": "1931-05-07T00:00:00Z",
            "city": "Cincinnati",
            "cityCoords": "Point(-84.5125 39.1)"
        },
        {
            "item": "http://viaf.org/viaf/56803375",
            "countryiso": "826",
            "dob": "1970-05-22T00:00:00Z",
            "city": "Streatham",
            "cityCoords": "Point(-0.1235 51.4279)"
        },
        {
            "item": "http://viaf.org/viaf/44787877",
            "countryiso": "840",
            "dob": "1911-08-25T00:00:00Z",
            "city": "New York City",
            "cityCoords": "Point(-74.0 40.7)"
        },
        {
            "item": "http://viaf.org/viaf/2658720",
            "countryiso": "840",
            "dob": "1913-05-31T00:00:00Z",
            "city": "Union",
            "cityCoords": "Point(-81.625 34.717222222)"
        },
        {
            "item": "http://viaf.org/viaf/116053682",
            "countryiso": "840",
            "dob": "1957-09-11T00:00:00Z",
            "city": "Brooklyn",
            "cityCoords": "Point(-73.990277777 40.692777777)"
        },
        {
            "item": "http://viaf.org/viaf/116053682",
            "countryiso": "840",
            "dob": "1957-09-04T00:00:00Z",
            "city": "Brooklyn",
            "cityCoords": "Point(-73.990277777 40.692777777)"
        },
        {
            "item": "http://viaf.org/viaf/75465937",
            "countryiso": "826",
            "dob": "1955-12-19T00:00:00Z",
            "city": "Battersea",
            "cityCoords": "Point(-0.167711111 51.463769444)"
        },
        {
            "item": "http://viaf.org/viaf/26275913",
            "countryiso": "840",
            "dob": "1969-04-15T00:00:00Z",
            "city": "Philadelphia",
            "cityCoords": "Point(-75.163611111 39.952777777)"
        },
        {
            "item": "http://viaf.org/viaf/102350792",
            "countryiso": "840",
            "dob": "1911-07-23T00:00:00Z",
            "city": "East Bronx",
            "cityCoords": "Point(-73.8306 40.8517)"
        },
        {
            "item": "http://viaf.org/viaf/33279818",
            "countryiso": "840",
            "dob": "1928-10-23T00:00:00Z",
            "city": "Philadelphia",
            "cityCoords": "Point(-75.163611111 39.952777777)"
        },
        {
            "item": "http://viaf.org/viaf/5056030",
            "countryiso": "840",
            "dob": "1880-06-17T00:00:00Z",
            "city": "Cedar Rapids",
            "cityCoords": "Point(-91.668611111 41.983333333)"
        },
        {
            "item": "http://viaf.org/viaf/10043464",
            "countryiso": "840",
            "dob": "1929-01-02T00:00:00Z",
            "city": "Chicago",
            "cityCoords": "Point(-87.65005 41.85003)"
        },
        {
            "item": "http://viaf.org/viaf/8316126",
            "countryiso": "840",
            "dob": "1865-05-05T00:00:00Z",
            "city": "Virginia",
            "cityCoords": "Point(-79.0 37.5)"
        },
        {
            "item": "http://viaf.org/viaf/13745777",
            "countryiso": "840",
            "dob": "1900-06-03T00:00:00Z",
            "city": "Fitzgerald",
            "cityCoords": "Point(-83.2564 31.7156)"
        },
        {
            "item": "http://viaf.org/viaf/14387566",
            "countryiso": "826",
            "dob": "1870-03-25T00:00:00Z",
            "city": "Hampstead",
            "cityCoords": "Point(-0.1744 51.5541)"
        },
        {
            "item": "http://viaf.org/viaf/217123",
            "countryiso": "840",
            "dob": "1959-06-26T00:00:00Z",
            "city": "Santa Monica",
            "cityCoords": "Point(-118.481388888 34.021944444)"
        },
        {
            "item": "http://viaf.org/viaf/217123",
            "countryiso": "840",
            "dob": "1958-01-01T00:00:00Z",
            "city": "Santa Monica",
            "cityCoords": "Point(-118.481388888 34.021944444)"
        },
        {
            "item": "http://viaf.org/viaf/14959938",
            "countryiso": "250",
            "dob": "1786-12-18T00:00:00Z",
            "city": "Eutin",
            "cityCoords": "Point(10.618055555 54.137777777)"
        },
        {
            "item": "http://viaf.org/viaf/14959938",
            "countryiso": "250",
            "dob": "1786-11-18T00:00:00Z",
            "city": "Eutin",
            "cityCoords": "Point(10.618055555 54.137777777)"
        },
        {
            "item": "http://viaf.org/viaf/14959938",
            "countryiso": "250",
            "dob": "1786-11-01T00:00:00Z",
            "city": "Eutin",
            "cityCoords": "Point(10.618055555 54.137777777)"
        },
        {
            "item": "http://viaf.org/viaf/14959938",
            "countryiso": "276",
            "dob": "1786-12-18T00:00:00Z",
            "city": "Eutin",
            "cityCoords": "Point(10.618055555 54.137777777)"
        },
        {
            "item": "http://viaf.org/viaf/14959938",
            "countryiso": "276",
            "dob": "1786-11-18T00:00:00Z",
            "city": "Eutin",
            "cityCoords": "Point(10.618055555 54.137777777)"
        },
        {
            "item": "http://viaf.org/viaf/14959938",
            "countryiso": "276",
            "dob": "1786-11-01T00:00:00Z",
            "city": "Eutin",
            "cityCoords": "Point(10.618055555 54.137777777)"
        },
        {
            "item": "http://viaf.org/viaf/14959938",
            "countryiso": "276",
            "dob": "1786-12-18T00:00:00Z",
            "city": "Eutin",
            "cityCoords": "Point(10.618055555 54.137777777)"
        },
        {
            "item": "http://viaf.org/viaf/14959938",
            "countryiso": "276",
            "dob": "1786-11-18T00:00:00Z",
            "city": "Eutin",
            "cityCoords": "Point(10.618055555 54.137777777)"
        },
        {
            "item": "http://viaf.org/viaf/14959938",
            "countryiso": "276",
            "dob": "1786-11-01T00:00:00Z",
            "city": "Eutin",
            "cityCoords": "Point(10.618055555 54.137777777)"
        },
        {
            "item": "http://viaf.org/viaf/218656",
            "countryiso": "840",
            "dob": "1963-05-10T00:00:00Z",
            "city": "Fort Knox",
            "cityCoords": "Point(-85.95625 37.915972222)"
        },
        {
            "item": "http://viaf.org/viaf/56673538",
            "countryiso": "840",
            "dob": "1863-08-13T00:00:00Z",
            "city": "Russell County",
            "cityCoords": "Point(-82.1 36.94)"
        },
        {
            "item": "http://viaf.org/viaf/79448052",
            "countryiso": "840",
            "dob": "1972-01-01T00:00:00Z",
            "city": "Chicago",
            "cityCoords": "Point(-87.65005 41.85003)"
        },
        {
            "item": "http://viaf.org/viaf/264313781",
            "countryiso": "840",
            "dob": "1953-08-17T00:00:00Z",
            "city": "New York",
            "cityCoords": "Point(-75.0 43.0)"
        },
        {
            "item": "http://viaf.org/viaf/65829454",
            "countryiso": "840",
            "dob": "1973-05-22T00:00:00Z",
            "city": "Bogalusa",
            "cityCoords": "Point(-89.863888888 30.780555555)"
        },
        {
            "item": "http://viaf.org/viaf/102738488",
            "countryiso": "840",
            "dob": "1973-01-12T00:00:00Z",
            "city": "Chicago",
            "cityCoords": "Point(-87.65005 41.85003)"
        },
        {
            "item": "http://viaf.org/viaf/16733193",
            "countryiso": "826",
            "dob": "1924-02-06T00:00:00Z",
            "city": "Ironbridge",
            "cityCoords": "Point(-2.4854 52.6278)"
        },
        {
            "item": "http://viaf.org/viaf/14061281",
            "countryiso": "388",
            "dob": "1960-12-20T00:00:00Z",
            "city": "Kingston",
            "cityCoords": "Point(-76.793055555 17.971388888)"
        },
        {
            "item": "http://viaf.org/viaf/102509922",
            "countryiso": "840",
            "dob": "1964-10-01T00:00:00Z",
            "city": "Milwaukee",
            "cityCoords": "Point(-87.95 43.05)"
        },
        {
            "item": "http://viaf.org/viaf/102509922",
            "countryiso": "840",
            "dob": "1965-10-01T00:00:00Z",
            "city": "Milwaukee",
            "cityCoords": "Point(-87.95 43.05)"
        },
        {
            "item": "http://viaf.org/viaf/196103467",
            "countryiso": "840",
            "dob": "1812-05-06T00:00:00Z",
            "city": "Charles Town",
            "cityCoords": "Point(-77.856111111 39.284166666)"
        },
        {
            "item": "http://viaf.org/viaf/67221769",
            "countryiso": "840",
            "dob": "1874-04-02T00:00:00Z",
            "city": "San Francisco",
            "cityCoords": "Point(-122.416388888 37.7775)"
        },
        {
            "item": "http://viaf.org/viaf/79195673",
            "countryiso": "388",
            "dob": "1940-04-20T00:00:00Z",
            "city": "Saint Mary Parish",
            "cityCoords": "Point(-76.9 18.316666666)"
        },
        {
            "item": "http://viaf.org/viaf/75578653",
            "countryiso": "840",
            "dob": "1961-07-07T00:00:00Z",
            "city": "Memphis",
            "cityCoords": "Point(-89.971111111 35.1175)"
        },
        {
            "item": "http://viaf.org/viaf/103611962",
            "countryiso": "388",
            "dob": "1946-11-02T00:00:00Z",
            "city": "Kingston",
            "cityCoords": "Point(-76.793055555 17.971388888)"
        },
        {
            "item": "http://viaf.org/viaf/206144783129093379900",
            "countryiso": "388",
            "dob": "1966-01-01T00:00:00Z",
            "city": "Jamaica",
            "cityCoords": "Point(-77.4 18.18)"
        },
        {
            "item": "http://viaf.org/viaf/44333482",
            "countryiso": "840",
            "dob": "1859-01-01T00:00:00Z",
            "city": "Portland",
            "cityCoords": "Point(-70.255 43.66)"
        },
        {
            "item": "http://viaf.org/viaf/73457303",
            "countryiso": "840",
            "dob": "1930-09-08T00:00:00Z",
            "city": "Washington, D.C.",
            "cityCoords": "Point(-77.036666666 38.895)"
        },
        {
            "item": "http://viaf.org/viaf/79081042",
            "countryiso": "840",
            "dob": "1946-11-13T00:00:00Z",
            "city": "Watts",
            "cityCoords": "Point(-118.241666666 33.941666666)"
        },
        {
            "item": "http://viaf.org/viaf/100160310",
            "countryiso": "250",
            "dob": "1363-12-22T00:00:00Z",
            "city": "Gerson",
            "cityCoords": "Point(4.3259 49.5205)"
        },
        {
            "item": "http://viaf.org/viaf/100160310",
            "countryiso": "250",
            "dob": "1363-12-21T00:00:00Z",
            "city": "Gerson",
            "cityCoords": "Point(4.3259 49.5205)"
        },
        {
            "item": "http://viaf.org/viaf/100160310",
            "countryiso": "250",
            "dob": "1369-01-01T00:00:00Z",
            "city": "Gerson",
            "cityCoords": "Point(4.3259 49.5205)"
        },
        {
            "item": "http://viaf.org/viaf/19685785",
            "countryiso": "840",
            "dob": "1827-11-26T00:00:00Z",
            "city": "Gorham",
            "cityCoords": "Point(-70.444166666 43.679444444)"
        },
        {
            "item": "http://viaf.org/viaf/12369238",
            "countryiso": "840",
            "dob": "1879-06-03T00:00:00Z",
            "city": "Farmington",
            "cityCoords": "Point(-71.065555555 43.389722222)"
        },
        {
            "item": "http://viaf.org/viaf/92552365",
            "countryiso": "840",
            "dob": "1921-04-24T00:00:00Z",
            "city": "Georgia",
            "cityCoords": "Point(-83.5 33.0)"
        },
        {
            "item": "http://viaf.org/viaf/109406177",
            "countryiso": "840",
            "dob": "1931-02-18T00:00:00Z",
            "city": "Lorain",
            "cityCoords": "Point(-82.168888888 41.448333333)"
        },
        {
            "item": "http://viaf.org/viaf/76335318",
            "countryiso": "028",
            "dob": "1949-05-25T00:00:00Z",
            "city": "Saint John's",
            "cityCoords": "Point(-61.844722222 17.121111111)"
        },
        {
            "item": "http://viaf.org/viaf/108585658",
            "countryiso": "840",
            "dob": "1909-07-29T00:00:00Z",
            "city": "Jefferson City",
            "cityCoords": "Point(-92.173611111 38.576666666)"
        },
        {
            "item": "http://viaf.org/viaf/17209086",
            "countryiso": "840",
            "dob": "1918-08-04T00:00:00Z",
            "city": "Chicago",
            "cityCoords": "Point(-87.65005 41.85003)"
        },
        {
            "item": "http://viaf.org/viaf/110405033",
            "countryiso": "840",
            "dob": "1941-01-01T00:00:00Z",
            "city": "Washington, D.C.",
            "cityCoords": "Point(-77.036666666 38.895)"
        },
        {
            "item": "http://viaf.org/viaf/110405033",
            "countryiso": "840",
            "dob": "1941-06-14T00:00:00Z",
            "city": "Washington, D.C.",
            "cityCoords": "Point(-77.036666666 38.895)"
        },
        {
            "item": "http://viaf.org/viaf/2489725",
            "countryiso": "388",
            "dob": "1889-09-15T00:00:00Z",
            "city": "Clarendon Parish",
            "cityCoords": "Point(-77.15 17.733)"
        },
        {
            "item": "http://viaf.org/viaf/2489725",
            "countryiso": "388",
            "dob": "1890-01-01T00:00:00Z",
            "city": "Clarendon Parish",
            "cityCoords": "Point(-77.15 17.733)"
        },
        {
            "item": "http://viaf.org/viaf/59679442",
            "countryiso": "840",
            "dob": "1950-01-25T00:00:00Z",
            "city": "Manhattan",
            "cityCoords": "Point(-73.994166666 40.728333333)"
        },
        {
            "item": "http://viaf.org/viaf/109699441",
            "countryiso": "840",
            "dob": "1949-11-23T00:00:00Z",
            "city": "Lexington",
            "cityCoords": "Point(-84.494722222 38.029722222)"
        },
        {
            "item": "http://viaf.org/viaf/79294236",
            "countryiso": "840",
            "dob": "1930-07-30T00:00:00Z",
            "city": "Chicago",
            "cityCoords": "Point(-87.65005 41.85003)"
        },
        {
            "item": "http://viaf.org/viaf/79294236",
            "countryiso": "840",
            "dob": "1930-07-13T00:00:00Z",
            "city": "Chicago",
            "cityCoords": "Point(-87.65005 41.85003)"
        },
        {
            "item": "http://viaf.org/viaf/45992351",
            "countryiso": "840",
            "dob": "1876-01-10T00:00:00Z",
            "city": "Charleston",
            "cityCoords": "Point(-79.931944444 32.783333333)"
        },
        {
            "item": "http://viaf.org/viaf/24652309",
            "countryiso": "840",
            "dob": "1930-01-01T00:00:00Z",
            "city": "New York City",
            "cityCoords": "Point(-74.0 40.7)"
        },
        {
            "item": "http://viaf.org/viaf/44435463",
            "countryiso": "840",
            "dob": "1804-07-04T00:00:00Z",
            "city": "Salem",
            "cityCoords": "Point(-70.898503 42.516845)"
        },
        {
            "item": "http://viaf.org/viaf/62824341",
            "countryiso": "840",
            "dob": "1891-01-07T00:00:00Z",
            "city": "Notasulga",
            "cityCoords": "Point(-85.667631 32.560821)"
        },
        {
            "item": "http://viaf.org/viaf/34453955",
            "countryiso": "840",
            "dob": "1947-06-22T00:00:00Z",
            "city": "Pasadena",
            "cityCoords": "Point(-118.131944444 34.156111111)"
        },
        {
            "item": "http://viaf.org/viaf/34464524",
            "countryiso": "840",
            "dob": "1908-09-04T00:00:00Z",
            "city": "Roxie",
            "cityCoords": "Point(-91.0672 31.5053)"
        },
        {
            "item": "http://viaf.org/viaf/34464524",
            "countryiso": "840",
            "dob": "1908-09-04T00:00:00Z",
            "city": "Natchez",
            "cityCoords": "Point(-91.403166666 31.560416666)"
        },
        {
            "item": "http://viaf.org/viaf/9866919",
            "countryiso": "840",
            "dob": "1871-06-17T00:00:00Z",
            "city": "Jacksonville",
            "cityCoords": "Point(-81.65 30.316666666)"
        },
        {
            "item": "http://viaf.org/viaf/100281554",
            "countryiso": "840",
            "dob": "1814-11-06T00:00:00Z",
            "city": "Lexington",
            "cityCoords": "Point(-84.494722222 38.029722222)"
        },
        {
            "item": "http://viaf.org/viaf/76335432",
            "countryiso": "840",
            "dob": "1872-06-27T00:00:00Z",
            "city": "Dayton",
            "cityCoords": "Point(-84.2 39.766666666)"
        },
        {
            "item": "http://viaf.org/viaf/2489741",
            "countryiso": "840",
            "dob": "1894-12-26T00:00:00Z",
            "city": "Washington, D.C.",
            "cityCoords": "Point(-77.036666666 38.895)"
        },
        {
            "item": "http://viaf.org/viaf/49272755",
            "countryiso": "840",
            "dob": "1838-05-02T00:00:00Z",
            "city": "Williamsfield",
            "cityCoords": "Point(-80.5706 41.5333)"
        },
        {
            "item": "http://viaf.org/viaf/109024368",
            "countryiso": "840",
            "dob": "1916-01-14T00:00:00Z",
            "city": "Macon",
            "cityCoords": "Point(-83.6324 32.84069)"
        },
        {
            "item": "http://viaf.org/viaf/52068804",
            "countryiso": "840",
            "dob": "1863-07-23T00:00:00Z",
            "city": "Winnsboro",
            "cityCoords": "Point(-81.087959 34.377069)"
        },
        {
            "item": "http://viaf.org/viaf/52068804",
            "countryiso": "840",
            "dob": "1863-07-18T00:00:00Z",
            "city": "Winnsboro",
            "cityCoords": "Point(-81.087959 34.377069)"
        },
        {
            "item": "http://viaf.org/viaf/62791071",
            "countryiso": "388",
            "dob": "1883-09-06T00:00:00Z",
            "city": "Negril",
            "cityCoords": "Point(-78.345833333 18.273055555)"
        },
        {
            "item": "http://viaf.org/viaf/108957653",
            "countryiso": "840",
            "dob": "1938-01-09T00:00:00Z",
            "city": "Manchester",
            "cityCoords": "Point(-84.6175 32.856111111)"
        },
        {
            "item": "http://viaf.org/viaf/233333591",
            "countryiso": "124",
            "dob": "1976-10-19T00:00:00Z",
            "city": "Fernie",
            "cityCoords": "Point(-115.063 49.5042)"
        },
        {
            "item": "http://viaf.org/viaf/85491349",
            "countryiso": "710",
            "dob": "1940-03-01T00:00:00Z",
            "city": "Cape Town",
            "cityCoords": "Point(18.423888888 -33.925277777)"
        },
        {
            "item": "http://viaf.org/viaf/2560301",
            "countryiso": "840",
            "dob": "1903-04-12T00:00:00Z",
            "city": "Seattle",
            "cityCoords": "Point(-122.33207 47.60621)"
        },
        {
            "item": "http://viaf.org/viaf/22197763",
            "countryiso": "840",
            "dob": "1944-01-01T00:00:00Z",
            "city": "United States of America",
            "cityCoords": "Point(-98.5795 39.828175)"
        },
        {
            "item": "http://viaf.org/viaf/30817480",
            "countryiso": "840",
            "dob": "1911-08-11T00:00:00Z",
            "city": "Coraopolis",
            "cityCoords": "Point(-80.1628 40.5158)"
        },
        {
            "item": "http://viaf.org/viaf/109024518",
            "countryiso": "840",
            "dob": "1929-04-20T00:00:00Z",
            "city": "Alexandria",
            "cityCoords": "Point(-92.445194444 31.31125)"
        },
        {
            "item": "http://viaf.org/viaf/115155829",
            "countryiso": "840",
            "dob": "1906-08-02T00:00:00Z",
            "city": "New York City",
            "cityCoords": "Point(-74.0 40.7)"
        },
        {
            "item": "http://viaf.org/viaf/115552349",
            "countryiso": "840",
            "dob": "1890-03-17T00:00:00Z",
            "city": "Minneapolis",
            "cityCoords": "Point(-93.269166666 44.981944444)"
        },
        {
            "item": "http://viaf.org/viaf/105745012",
            "countryiso": "840",
            "dob": "1926-10-15T00:00:00Z",
            "city": "New York City",
            "cityCoords": "Point(-74.0 40.7)"
        },
        {
            "item": "http://viaf.org/viaf/70272816",
            "countryiso": "840",
            "dob": "1929-01-01T00:00:00Z",
            "city": "Philadelphia",
            "cityCoords": "Point(-75.163611111 39.952777777)"
        },
        {
            "item": "http://viaf.org/viaf/70272816",
            "countryiso": "840",
            "dob": "1934-07-15T00:00:00Z",
            "city": "Philadelphia",
            "cityCoords": "Point(-75.163611111 39.952777777)"
        },
        {
            "item": "http://viaf.org/viaf/54148427",
            "countryiso": "840",
            "dob": "1915-04-24T00:00:00Z",
            "city": "Trinity",
            "cityCoords": "Point(-95.3756 30.9456)"
        },
        {
            "item": "http://viaf.org/viaf/29619534",
            "countryiso": "840",
            "dob": "1929-08-01T00:00:00Z",
            "city": "Pittsburgh",
            "cityCoords": "Point(-80.0 40.441666666)"
        },
        {
            "item": "http://viaf.org/viaf/92160010",
            "countryiso": "840",
            "dob": "1935-10-31T00:00:00Z",
            "city": "St. Louis",
            "cityCoords": "Point(-90.199444444 38.626388888)"
        },
        {
            "item": "http://viaf.org/viaf/79059792",
            "countryiso": "840",
            "dob": "1950-04-28T00:00:00Z",
            "city": "Washington, D.C.",
            "cityCoords": "Point(-77.036666666 38.895)"
        },
        {
            "item": "http://viaf.org/viaf/71411730",
            "countryiso": "840",
            "dob": "1950-05-29T00:00:00Z",
            "city": "Stamford",
            "cityCoords": "Point(-73.552222222 41.096666666)"
        },
        {
            "item": "http://viaf.org/viaf/266677806",
            "countryiso": "840",
            "dob": "1943-09-13T00:00:00Z",
            "city": "Jackson",
            "cityCoords": "Point(-90.184722222 32.298888888)"
        },
        {
            "item": "http://viaf.org/viaf/66597305",
            "countryiso": "840",
            "dob": "1948-12-07T00:00:00Z",
            "city": "Springfield",
            "cityCoords": "Point(-72.547455 42.112411)"
        },
        {
            "item": "http://viaf.org/viaf/4149756",
            "countryiso": "840",
            "dob": "1948-05-31T00:00:00Z",
            "city": "Atlanta",
            "cityCoords": "Point(-84.390277777 33.756944444)"
        },
        {
            "item": "http://viaf.org/viaf/52387993",
            "countryiso": "840",
            "dob": "1949-01-01T00:00:00Z",
            "city": "Macon",
            "cityCoords": "Point(-83.6324 32.84069)"
        },
        {
            "item": "http://viaf.org/viaf/52387993",
            "countryiso": "840",
            "dob": "1949-11-18T00:00:00Z",
            "city": "Macon",
            "cityCoords": "Point(-83.6324 32.84069)"
        },
        {
            "item": "http://viaf.org/viaf/22588895",
            "countryiso": "840",
            "dob": "1927-10-07T00:00:00Z",
            "city": "Kansas City",
            "cityCoords": "Point(-94.583333333 39.05)"
        },
        {
            "item": "http://viaf.org/viaf/9864219",
            "countryiso": "840",
            "dob": "1944-01-01T00:00:00Z",
            "city": "Philadelphia",
            "cityCoords": "Point(-75.163611111 39.952777777)"
        },
        {
            "item": "http://viaf.org/viaf/21816439",
            "countryiso": "840",
            "dob": "1942-06-13T00:00:00Z",
            "city": "Chicago",
            "cityCoords": "Point(-87.65005 41.85003)"
        },
        {
            "item": "http://viaf.org/viaf/313409950",
            "countryiso": "840",
            "dob": "1893-12-22T00:00:00Z",
            "city": "South Carolina",
            "cityCoords": "Point(-81.0 34.0)"
        },
        {
            "item": "http://viaf.org/viaf/313409950",
            "countryiso": "840",
            "dob": "1893-12-22T00:00:00Z",
            "city": "South Carolina",
            "cityCoords": "Point(-81.0 34.0)"
        },
        {
            "item": "http://viaf.org/viaf/54185202",
            "countryiso": "578",
            "dob": "1931-06-15T00:00:00Z",
            "city": "Svolvær",
            "cityCoords": "Point(14.566666666 68.233333333)"
        },
        {
            "item": "http://viaf.org/viaf/27357262",
            "countryiso": "840",
            "dob": "1966-06-14T00:00:00Z",
            "city": "San Francisco",
            "cityCoords": "Point(-122.416388888 37.7775)"
        },
        {
            "item": "http://viaf.org/viaf/31994447",
            "countryiso": "124",
            "dob": "1921-01-17T00:00:00Z",
            "city": "Sydney",
            "cityCoords": "Point(-60.1829 46.1378)"
        },
        {
            "item": "http://viaf.org/viaf/95875259",
            "countryiso": "826",
            "dob": "1824-01-01T00:00:00Z",
            "city": "Westminster",
            "cityCoords": "Point(-0.1333 51.4995)"
        },
        {
            "item": "http://viaf.org/viaf/111028260",
            "countryiso": "840",
            "dob": "1897-08-20T00:00:00Z",
            "city": "Hardwick",
            "cityCoords": "Point(-72.347977 44.5234776)"
        },
        {
            "item": "http://viaf.org/viaf/111028260",
            "countryiso": "840",
            "dob": "1897-08-20T00:00:00Z",
            "city": "Hardwick",
            "cityCoords": "Point(-72.36816 44.50478)"
        }
      ];

      const YEAR_COUNTS = getYearCounts(MAP_DATA)
      runDataPipeline(MAP_DATA,COUNTRIES_50M,[getMinDate(YEAR_COUNTS),getMaxDate(YEAR_COUNTS)])

      function runDataPipeline(map_data,countries_50m,date_range) {
        const MAP_DATA_FILTERED_BY_YEAR = applyDatesToMapData(map_data, date_range);
        const COUNTRIES = topojson.feature(countries_50m, countries_50m.objects.countries);
        const COUNTRY_MESH = topojson.mesh(countries_50m, countries_50m.objects.countries, (a, b) => a !== b);
        const COUNTRY_COUNTS = getCountryCounts(MAP_DATA_FILTERED_BY_YEAR,countries_50m);
        const CITY_COUNTS = getCityCounts(MAP_DATA_FILTERED_BY_YEAR);
        const MAX_POP = CITY_COUNTS.length > 0 ? Math.max(...CITY_COUNTS.map((city) => city.population)) : 0;

        const WIDGET_DATA = {
          data: COUNTRY_COUNTS,
          cities: CITY_COUNTS,
          maxPopulation: MAX_POP
        }

        const DATA_LABELS = { 
          id: (d) => d.country, // country name, e.g. Zimbabwe
          value: (d) => d.count, // health-adjusted life expectancy
          range: d3.interpolateYlOrRd,
          features: COUNTRIES,
          //  featureId: d => d.properties.name, // i.e., not ISO 3166-1 numeric
          borders: COUNTRY_MESH,
          projection: d3.geoEqualEarth()
        }
        
        buildWidget(WIDGET_DATA,DATA_LABELS);
      }

      function getYearCounts(mapData) {
        return mapData.reduce((prev, curr) => {
          const slice_size = curr.dob[0] === '-' ? 5 : 4;
          const dob = Number(curr.dob.slice(0, slice_size));
          if (prev[dob]) return { ...prev, [dob]: prev[dob] + 1 };
          else return { ...prev, [dob]: 1 };
        }, {});
      }

      function getMinDate(yearCounts) {
        if (Object.keys(yearCounts).length) {
            return Math.min(...Object.keys(yearCounts).map((item) => Number(item)));
        }
        else {
            return 0;
        }
      }

      function getMaxDate(yearCounts) {
        if (Object.keys(yearCounts).length) {
            return Math.max(...Object.keys(yearCounts).map((item) => Number(item)));
        }
        else {
            return 0;
        }
      }

      function applyDatesToMapData(mapData, dateRange) {
        return mapData.filter((item) => {
          const slice_size = item.dob[0] === '-' ? 5 : 4;
          return(Number(item.dob.slice(0, slice_size)) >= dateRange[0] && Number(item.dob.slice(0, slice_size)) <= dateRange[1])
        });
      }

      function getCountryCounts(mapDataHistogram,world) {
        if (mapDataHistogram.length) {
          let counts = {};
          for (let item of mapDataHistogram) {
            const { countryiso } = item;
            if (countryiso in counts) {
              counts[countryiso]++;
            } else {
              counts[countryiso] = 1;
            }
          }
          if (Object.keys(world).length !== 0) {
            let map_data = reformatCountData(counts, world);
            return map_data;
          }
        }
      }

      function reformatCountData(data, worldData) {
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
      }

      function getCityCounts(mapDataHistogram) {
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
      }

      function buildWidget(widgetData,{
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
      } = {}) {
        // Compute values.
        const data = widgetData['data']
        const cities = widgetData['cities']
        const maxPopulation = widgetData['maxPopulation']
        let width = innerWidth || 500;
        console.log("Width B");
        console.log(width);
        let height = width / 2;
        console.log("Height B");
        console.log(height);

        const handleMarkerClick = (event, d) => {
          const div = d3.select('#tooltip');
          div.style('opacity', 0.9);
          console.log(event.pageX);
          console.log(event.pageY);
          console.log(innerWidth);
          console.log(innerHeight);
          div
            .html(\`<strong>Location: \${d.name}<br/> Contributors: \${d.population}</strong>\`)
            .style('left', event.pageX + 10 + 'px')
            .style('top', event.pageY - 12 + 'px')
            .style('position', 'absolute');
        };

        const N = d3.map(data, id);
        const V = d3.map(data, value).map((d) => (d == null ? NaN : +d));
        const Im = new d3.InternMap(N.map((id, i) => [id, i]));
        const If = d3.map(features.features, featureId);
        const container = d3.select('#graph-container');
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
          .attr('transform', \`translate(0,\${28})\`)
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
          title = (f, i) => \`\${f.properties.name}\n\${format(V[i])}\`;
        } else if (title !== null) {
          const T = title;
          const O = d3.map(data, (d) => d);
          title = (f, i) => T(f, O[i]);
        }

        // Compute the default height. If an outline object is specified, scale the projection to fit
        // the width, and then compute the corresponding height.
        height = undefined;
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
          .attr('r', (d) => (8 / maxPopulation) * d.population > 1 ? (8 / maxPopulation) * d.population : 1)
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
      }

      window.addEventListener(
        "message",
        (event) => {
            console.log("THE EVENT");
            console.log(event);
            runDataPipeline(MAP_DATA,COUNTRIES_50M,event.data);
        }
      )
    </script>
    `;

  const choropleth = (
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
    const container = d3.select('#graph-container');
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
      .attr('r', (d) => (8 / maxPopulation) * d.population > 1 ? (8 / maxPopulation) * d.population : 1)
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
      <Box sx={{ width: '100%', position: 'relative' }} ref={chartWrapper}>
        <iframe srcDoc={iframeCode} width={width} height={height + 50} style={{ border: '0px'}} id="map_frame"></iframe>
{/*        <div id="graph-container" ref={inputRef} />
        {loadingMap ? <CircularProgress color="inherit" sx={{ position: 'absolute', left: width / 2, top: height - 50 }} /> : ''}*/}
        <CustomSlider label="Adjust contributor birth years on map" value={dateRange} minValue={minDate} maxValue={maxDate} step={10} handleSliderChange={handleSliderChange} />
      </Box>
    </MainCard>
  );
};
