// LineGraph.tsx
import React, { useEffect, useRef } from 'react';
import * as d3 from 'd3';

interface LineGraphProps {
  data: Record<string, number>;
}

const LineGraph: React.FC<LineGraphProps> = ({ data }) => {
  const svgRef = useRef<SVGSVGElement>(null);

  useEffect(() => {
    if (!svgRef.current) return;

    const svg = d3.select(svgRef.current);

    // Extract data for x-axis (titles) and y-axis (values)
    const titles = Object.keys(data);
    const values = Object.values(data);

    // Create scales for x and y axes
    const xScale = d3.scaleBand().domain(titles).range([0, 50]).padding(0.1);
    const yScale = d3.scaleLinear().domain([0, d3.max(values) || 1]).range([50, 0]);

    // Draw x-axis without labels
    svg
      .append('g')
      .attr('transform', `translate(0, 50)`)
      .call(d3.axisBottom(xScale).tickSize(0))
      .select('.domain') // select the x-axis line
      .attr('stroke', 'black'); // set stroke color to black

    // Draw y-axis without label
    svg.append('g').call(d3.axisLeft(yScale).tickSize(0));

    // Draw the line
    svg
      .append('path')
      .datum(values.map((d, i) => ({ title: titles[i], value: d })))
      .attr('fill', 'none')
      .attr('stroke', 'blue')
      .attr('stroke-width', 2)
      .attr(
        'd',
        d3
          .line<{ title: string; value: number }>()
          .x((d) => xScale(d.title) || 0)
          .y((d) => yScale(d.value))
      );
  }, [data]);

  return <svg style={{ width: '50px', height: '50px' }} ref={svgRef}></svg>; // Adjust width and height as needed
};

export default LineGraph;
