import * as d3 from 'd3';
import { getFilteredData } from '../../../utils/getFilteredData';

const MARGIN = { TOP: 10, RIGHT: 50, BOTTOM: 100, LEFT: 100 };
const WIDTH = 800 - MARGIN.LEFT - MARGIN.RIGHT;
const HEIGHT = 150 - MARGIN.TOP - MARGIN.BOTTOM;
class PublicationDateTimeLine {
  constructor(element, data, setData, minDate, maxDate) {
    this.setData = setData;
    this.minDate = minDate;
    this.maxDate = maxDate;
    this.svg = d3
      .select(element)
      .append('svg')
      .attr('width', WIDTH + MARGIN.LEFT + MARGIN.RIGHT)
      .attr('height', HEIGHT + MARGIN.TOP + MARGIN.BOTTOM)
      .append('g')
      .attr('transform', `translate(${MARGIN.LEFT}, ${MARGIN.RIGHT})`);

    this.xLabel = this.svg.append('text').attr('x', WIDTH).attr('y', 0).attr('text-anchor', 'middle');

    this.xAxisGroup = this.svg.append('g').attr('transform', `translate(0,0)`);

    this.data = data?.sort((a, b) => a.date - b.date);
    this.setData(this.data);
    this.update(data, this.setData, minDate, maxDate);
  }
  update(data, setData, minDate, maxDate) {
    this.data = data;
    this.setData = setData;
    this.minDate = minDate;
    this.maxDate = maxDate;

    let res = getFilteredData(this.data, this.minDate, this.maxDate);
    const y = d3
      .scaleLinear()
      .domain([0, d3.max(res, (d) => d.count)])
      .range([HEIGHT, 0]);

    const x = d3
      .scaleBand()
      .domain(res.map((d) => d.date))
      .range([0, WIDTH])
      .padding(0.1);

    const xAxisCall = d3.axisBottom(x);
    this.xAxisGroup.transition().duration(500).call(xAxisCall);

    const circles = this.svg.selectAll('circle').data(res);

    circles.exit().transition().duration(500).attr('height', 0).attr('y', HEIGHT).remove();

    circles
      .transition()
      .duration(500)
      .attr('cx', (d) => x(d.date))
      .attr('cy', (d) => y(d.count))
      .attr('r', 5)
      .attr('height', (d) => HEIGHT - y(d.count));

    circles
      .enter()
      .append('circle')
      .attr('cx', (d) => x(d.date))
      .attr('cy', (d) => y(d.count))
      .attr('r', 5)
      .attr('fill', (d) => {
        switch (d.type) {
          case 'A':
            return '#dedede';
          case 'B':
            return 'red';
          case 'C':
            return 'green';
          case 'D':
            return 'yellow';
          default:
            return 'black';
        }
      })
      .transition()
      .duration(500)
      .attr('height', (d) => HEIGHT - y(d.count));
  }
}

export default PublicationDateTimeLine;
