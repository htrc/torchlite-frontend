import React, { useState, useEffect, useRef } from 'react';
import { geoEqualEarth, geoPath } from 'd3-geo';
import { feature } from 'topojson-client';
import { Box, Typography, useTheme } from '@mui/material';
import MainCard from '../../MainCard';
import useResizeObserver from '../../../hooks/useResizeObserver';
import styles from './publicationTimeLineChart.module.css';
import * as d3 from 'd3';
import {useSelector} from "../../../store";

// const MARGIN = {top: 20, right: 20, bottom: 20, left: 20};

//const mappingData from "data/mappingData";

const cities = [
  { name: 'Tokyo', coordinates: [139.6917, 35.6895], population: 37843000 },
  { name: 'Jakarta', coordinates: [106.865, -6.1751], population: 30539000 },
  { name: 'Delhi', coordinates: [77.1025, 28.7041], population: 24998000 },
  { name: 'Manila', coordinates: [120.9842, 14.5995], population: 24123000 },
  { name: 'Seoul', coordinates: [126.978, 37.5665], population: 23480000 },
  { name: 'Shanghai', coordinates: [121.4737, 31.2304], population: 23416000 },
  { name: 'Karachi', coordinates: [67.0099, 24.8615], population: 22123000 },
  { name: 'Beijing', coordinates: [116.4074, 39.9042], population: 21009000 },
  { name: 'New York', coordinates: [-74.0059, 40.7128], population: 20630000 },
  { name: 'Guangzhou', coordinates: [113.2644, 23.1291], population: 20597000 },
  { name: 'Sao Paulo', coordinates: [-46.6333, -23.5505], population: 20365000 },
  { name: 'Mexico City', coordinates: [-99.1332, 19.4326], population: 20063000 },
  { name: 'Mumbai', coordinates: [72.8777, 19.076], population: 17712000 },
  { name: 'Osaka', coordinates: [135.5022, 34.6937], population: 17444000 },
  { name: 'Moscow', coordinates: [37.6173, 55.7558], population: 16170000 },
  { name: 'Dhaka', coordinates: [90.4125, 23.8103], population: 15669000 },
  { name: 'Greater Cairo', coordinates: [31.2357, 30.0444], population: 15600000 },
  { name: 'Los Angeles', coordinates: [-118.2437, 34.0522], population: 15058000 },
  { name: 'Bangkok', coordinates: [100.5018, 13.7563], population: 14998000 },
  { name: 'Kolkata', coordinates: [88.3639, 22.5726], population: 14667000 },
  { name: 'Buenos Aires', coordinates: [-58.3816, -34.6037], population: 14122000 },
  { name: 'Tehran', coordinates: [51.389, 35.6892], population: 13532000 },
  { name: 'Istanbul', coordinates: [28.9784, 41.0082], population: 13287000 },
  { name: 'Lagos', coordinates: [3.3792, 6.5244], population: 13123000 },
  { name: 'Shenzhen', coordinates: [114.0579, 22.5431], population: 12084000 },
  { name: 'Rio de Janeiro', coordinates: [-43.1729, -22.9068], population: 11727000 },
  { name: 'Kinshasa', coordinates: [15.2663, -4.4419], population: 11587000 },
  { name: 'Tianjin', coordinates: [117.3616, 39.3434], population: 10920000 },
  { name: 'Paris', coordinates: [2.3522, 48.8566], population: 10858000 },
  { name: 'Lima', coordinates: [-77.0428, -12.0464], population: 10750000 }
];

const projection = geoEqualEarth()
  .scale(160)
  .translate([800 / 2, 450 / 2]);

const MappingContributorData = () => {
  const theme = useTheme();
  const chartWrapper = useRef();
  const dimensions = useResizeObserver(chartWrapper);
  const [geographies, setGeographies] = useState([]);
  const [hoveredGroup, setHoveredGroup] = useState<string | null>(null);

  let width = dimensions?.width || 500;
  let height = width / 2;
  useEffect(() => {
    fetch('/world-110m.json').then((response) => {
      if (response.status !== 200) {
        console.log(`There was a problem: ${response.status}`);
        return;
      }
      response.json().then((worlddata) => {
        setGeographies(feature(worlddata, worlddata.objects.countries).features);
      });
    });
  }, []);

  const handleCountryClick = (countryIndex) => {
    console.log('Clicked on country: ', geographies[countryIndex]);
  };

  const handleMarkerClick = (i) => {
    console.log('Marker: ', cities[i]);
  };
  const allDots = cities.map((city, i) => {
    const className =
      hoveredGroup && city.name !== hoveredGroup ? styles.scatterplotCircle + ' ' + styles.dimmed : styles.scatterplotCircle;
    var div = d3.select('#tooltip');
    return (
      <circle
        key={`marker-${i}`}
        cx={projection(city.coordinates)[0]}
        cy={projection(city.coordinates)[1]}
        r={6}
        fill="#E91E63"
        stroke="#FFFFFF"
        className={className}
        onClick={() => handleMarkerClick(i)}
        onMouseOver={(e) => {
          setHoveredGroup(city.name);
          div.style('opacity', 0.9);
          div
            .html(`<strong>${1}</strong>`)
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
      <Typography variant="h3" sx={{ color: '#1e98d7' }}>
        Mapping Contributor Data
      </Typography>
      <Box sx={{ width: '100%' }} ref={chartWrapper}>
        <svg width={width} height={height} viewBox="0 0 800 450">
          <g className="countries">
            {geographies.map((d, i) => (
              <path
                key={`path-${i}`}
                d={geoPath().projection(projection)(d)}
                className="country"
                fill={`rgba(66,89,213,${(1 / geographies.length) * i})`}
                stroke="#FFFFFF"
                strokeWidth={0.5}
                onClick={() => handleCountryClick(i)}
              />
            ))}
          </g>
          <g className="markers">{allDots}</g>
        </svg>
      </Box>
    </MainCard>
  );
};

export default MappingContributorData;
