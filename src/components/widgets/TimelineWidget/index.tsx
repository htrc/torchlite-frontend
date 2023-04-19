// @ts-nocheck
import React, { useRef, useEffect, useState, useMemo } from 'react';
import * as d3 from 'd3';
import CustomSlider from 'components/CustomSlider';

interface IProps {
  data?: any[];
}

const PublicationDateTimelineWidget = (props: IProps) => {
  const d3Container = useRef(null);
  const [value, setValue] = useState<number[]>([]);
  const [minValue, setMinValue] = useState<number>(0);
  const [maxValue, setMaxValue] = useState<number>(0);
  const handleSliderChange = (event) => {
    setValue(event.target.value);
  };
  const data = useMemo(() => {
    return [...props.data].filter((item) => item.year >= value[0] && item.year <= value[1]);
  }, [props.data, value]);

  let height = 400;
  let width = 600;
  let margin = { top: 0, right: 40, bottom: 34, left: 40 };

  // Data structure describing chart scales
  // let Scales = {
  //   lin: 'scaleLinear',
  //   log: 'scaleLog'
  // };

  // Data structure describing volume of displayed data
  let Count = {
    year: 'year'
  };

  // // Data structure describing legend fields value
  // let Legend = {
  //   total: 'Total Deaths',
  //   perCap: 'Per Capita Deaths'
  // };

  let chartState: any = {};

  chartState.measure = Count.year;
  // chartState.scale = Scales.lin;
  // chartState.legend = Legend.total;

  // Colors used for circles depending on continent
  let colors = d3
    .scaleOrdinal()
    .domain(['asia', 'africa', 'northAmerica', 'europe', 'southAmerica', 'oceania'])
    .range(['#D81B60', '#1976D2', '#388E3C', '#FBC02D', '#E64A19', '#455A64']);

  useEffect(() => {
    if (data && d3Container.current) {
      let svg = d3.select(d3Container.current).attr('width', width).attr('height', height);

      let xScale = d3.scaleLinear().range([margin.left, width - margin.right]);

      svg
        .append('g')
        .attr('class', 'x axis')
        .attr('transform', 'translate(0,' + (height - margin.bottom) + ')');

      // Create line that connects circle and X axis
      // let xLine = svg.append('line').attr('stroke', 'rgb(96,125,139)').attr('stroke-dasharray', '1,2');

      // Create tooltip div and make it invisible
      // let tooltip = svg.append('div').attr('class', 'tooltip').style('opacity', 0);

      let dataSet = data;
      // Set chart domain max value to the highest total value in data set
      xScale.domain(
        d3.extent(data, function (d) {
          return d.year;
        })
      );

      let xAxis;
      // Set X axis based on new scale. If chart is set to "per capita" use numbers with one decimal point
        xAxis = d3.axisBottom(xScale).ticks(10, '.1f').tickSizeOuter(0).tickFormat(function(d) {return d});
      

      d3.transition(svg).select('.x.axis').transition().duration(1000).call(xAxis);

      // Create simulation with specified dataset
      let simulation = d3
        .forceSimulation(dataSet)
        // Apply positioning force to push nodes towards desired position along X axis
        .force(
          'x',
          d3.forceX(function (d) {
            // Mapping of values from total/perCapita column of dataset to range of SVG chart (<margin.left, margin.right>)
            return xScale(d.year); // This is the desired position
          })
        ) // Increase velocity
        .force('y', d3.forceY(height / 2 - margin.bottom / 2)) // // Apply positioning force to push nodes towards center along Y axis
        .force('collide', d3.forceCollide(9)) // Apply collision force with radius of 9 - keeps nodes centers 9 pixels apart
        .stop(); // Stop simulation from starting automatically

        // Manually run simulation
      for (let i = 0; i < dataSet.length; ++i) {
        simulation.tick(10);
      }

      // Create country circles
      let countriesCircles = svg.selectAll('.countries').data(dataSet, function (d) {
        return d.country;
      });

      countriesCircles
        .exit()
        .transition()
        .duration(1000)
        .attr('cx', 0)
        .attr('cy', height / 2 - margin.bottom / 2)
        .remove();

      countriesCircles
        .enter()
        .append('circle')
        .attr('class', 'countries')
        .attr('cx', 0)
        .attr('cy', height / 2 - margin.bottom / 2)
        .attr('r', 6)
        .attr('fill', function (d) {
          return colors(d.continent);
        })
        .merge(countriesCircles)
        .transition()
        .duration(2000)
        .attr('cx', function (d) {
          return d.x;
        })
        .attr('cy', function (d) {
          return d.y;
        });

      // Show tooltip when hovering over circle (data for respective country)
      // d3.selectAll(".countries").on("mousemove", function(d) {
      //     tooltip.html(`Country: <strong>${d.country}</strong><br>
      //                   ${chartState.legend.slice(0, chartState.legend.indexOf(","))}:
      //                   <strong>${d3.format(",")(d[chartState.measure])}</strong>
      //                   ${chartState.legend.slice(chartState.legend.lastIndexOf(" "))}`)
      //         .style('top', d3.event.pageY - 12 + 'px')
      //         .style('left', d3.event.pageX + 25 + 'px')
      //         .style("opacity", 0.9);

      //     xLine.attr("x1", d3.select(this).attr("cx"))
      //         .attr("y1", d3.select(this).attr("cy"))
      //         .attr("y2", (height - margin.bottom))
      //         .attr("x2",  d3.select(this).attr("cx"))
      //         .attr("opacity", 1);

      // }).on("mouseout", function(_) {
      //     tooltip.style("opacity", 0);
      //     xLine.attr("opacity", 0);
      // });
    }
  }, [data, d3Container.current]);

  useEffect(() => {
    setMaxValue(Math.max(...props.data.map((item) => item.year)));
    setMinValue(Math.min(...props.data.map((item) => item.year)));
    setValue([Math.min(...props.data.map((item) => item.year)), Math.max(...props.data.map((item) => item.year))]);
  }, [props.data]);
  return (
    <div className="widget-card">
      <h3>Publication Date Timeline</h3>
      <div className="graph centered">
        <svg ref={d3Container} width={width} height={height}></svg>
      </div>
      <CustomSlider
        value={value}
        minValue={minValue}
        maxValue={maxValue}
        handleSliderChange={handleSliderChange}
        valueLabelDisplay="auto"
      />
    </div>
  );
};

export default PublicationDateTimelineWidget;
