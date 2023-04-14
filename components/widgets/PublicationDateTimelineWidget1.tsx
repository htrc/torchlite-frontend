"use client"

import React, { useRef, useEffect } from 'react';
import * as d3 from 'd3'

interface IProps {
  data?: any[];
}

const PublicationDateTimelineWidget = (props: IProps) => {
  const d3Container = useRef(null);
  const { data } = props;

  useEffect(
    () => {
      if (props.data && d3Container.current) {
        const svg = d3.select(d3Container.current);

        /*
        // Bind D3 data
        const update = svg
            .append('g')
            .selectAll('text')
            .data(props.data);

        // Enter new D3 elements
        update.enter()
            .append('text')
            .attr('x', (d, i) => i * 25)
            .attr('y', 40)
            .style('font-size', 24)
            .text((d: number) => d);

        // Update existing D3 elements
        update
            .attr('x', (d, i) => i * 40)
            .text((d: number) => d);

        // Remove old D3 elements
        update.exit()
            .remove();
            */
        const height = 500;
        const width = 500;
        const margin = { top: 20, right: 30, bottom: 30, left: 40 };
  
        const x = d3
          .scaleBand()
          .domain(data.map((d) => d.year))
          .rangeRound([margin.left, width - margin.right])
          .padding(0.1);
  
        const y1 = d3
          .scaleLinear()
          .domain([0, d3.max(data, (d) => d.sales)])
          .rangeRound([height - margin.bottom, margin.top]);
  
        const xAxis = (g) =>
          g.attr("transform", `translate(0,${height - margin.bottom})`).call(
            d3
              .axisBottom(x)
              .tickValues(
                d3
                  .ticks(...d3.extent(x.domain()), width / 40)
                  .filter((v) => x(v) !== undefined)
              )
              .tickSizeOuter(0)
          );
  
        const y1Axis = (g) =>
          g
            .attr("transform", `translate(${margin.left},0)`)
            .style("color", "steelblue")
            .call(d3.axisLeft(y1).ticks(null, "s"))
            .call((g) => g.select(".domain").remove())
            .call((g) =>
              g
                .append("text")
                .attr("x", -margin.left)
                .attr("y", 10)
                .attr("fill", "currentColor")
                .attr("text-anchor", "start")
                .text(data.y1)
            );
  
        svg.select(".x-axis").call(xAxis);
        svg.select(".y-axis").call(y1Axis);
  
        svg
          .select(".plot-area")
          .attr("fill", "steelblue")
          .selectAll(".bar")
          .data(data)
          .join("rect")
          .attr("class", "bar")
          .attr("x", (d) => x(d.year))
          .attr("width", x.bandwidth())
          .attr("y", (d) => y1(d.sales))
          .attr("height", (d) => y1(0) - y1(d.sales));
      }
  }, [props.data, d3Container.current])

  return (
    <svg
      ref={d3Container}
      className="d3-component"
      style={{
        height: 500,
        width: "100%",
        marginRight: "0px",
        marginLeft: "0px",
      }}
    >
      <g className="plot-area" />
      <g className="x-axis" />
      <g className="y-axis" />
    </svg>
    // <svg
    //   className="d3-component"
    //   width={400}
    //   height={200}
    //   ref={d3Container}
    // />
  );
}

export default PublicationDateTimelineWidget