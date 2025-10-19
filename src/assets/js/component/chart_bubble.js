// assets/js/component/chart_bubble.js
import { logger } from '../utils/logger.js';

class ChartBubble {
  constructor(options) {
    this.options = {
      id: 'defaultChart',
      areaWidth: 600,
      areaHeight: 400,
      gap: 5,
      minRadius: 15,
      maxRadius: 60,
      bubbleData: [],
      ...options
    };

    this.chartSelector = `[data-chart-bubble="${this.options.id}"]`;
    this.tooltipSelector = `[data-chart-tooltip="${this.options.id}"]`;

    this.width = this.options.areaWidth;
    this.height = this.options.areaHeight;
    this.padding = this.options.gap;
    this.minRadius = this.options.minRadius;
    this.maxRadius = this.options.maxRadius;

    if (!Array.isArray(this.options.bubbleData)) {
      logger.error('옵션은 배열이어야 함', null, 'ChartBubble');
      this.bubbleData = [];
    } else {
      this.bubbleData = this.options.bubbleData;
    }

    this.svg = null;
    this.simulation = null;
    this.tooltip = null;
    this.radiusScale = null;

    this.init();
  }

  init() {
    if (!d3) {
      logger.error("D3.js 라이브러리를 찾을 수 없음", null, 'ChartBubble');
      return;
    }

    this.svg = d3.select(this.chartSelector)
      .append("svg")
      .attr("width", this.width)
      .attr("height", this.height)
      .attr("class", "chart-container");

    this.tooltip = d3.select(this.tooltipSelector);

    const minPercent = d3.min(this.bubbleData, d => d.percentage);
    const maxPercent = d3.max(this.bubbleData, d => d.percentage);
    const domain = (minPercent !== undefined && maxPercent !== undefined && minPercent <= maxPercent)
      ? [minPercent, maxPercent]
      : [0, 100];

    this.radiusScale = d3.scaleSqrt()
      .domain(domain)
      .range([this.minRadius, this.maxRadius]);

    this.simulation = d3.forceSimulation(this.bubbleData)
      .force("charge", d3.forceManyBody().strength(30))
      .force("collide", d3.forceCollide().radius(d => this.radiusScale(d.percentage) + this.padding))
      .force("x", d3.forceX(this.width / 2).strength(0.05))
      .force("y", d3.forceY(this.height / 2).strength(0.05))
      .on("tick", () => this.ticked());

    this.renderBubbles();
    this.startSimulation();
  }

  renderBubbles() {
    this.svg.selectAll(".bubble")
      .data(this.bubbleData, d => d.id)
      .enter()
      .append("circle")
      .attr("class", "bubble")
      .attr("r", d => this.radiusScale(d.percentage))
      .attr("fill", d => d.color || `hsl(${d.percentage * 2.5}, 70%, 50%)`)
      .on("click", (event, d) => this.handleClick(event, d))
      .on("mouseover", (event, d) => this.handleMouseOver(event, d))
      .on("mouseout", (event, d) => this.handleMouseOut(event, d));

    this.svg.selectAll(".bubble-label")
      .data(this.bubbleData, d => d.id)
      .enter()
      .append("text")
      .attr("class", d => `bubble-label ${this.radiusScale(d.percentage) < 30 ? 'bubble-label-small' : ''}`)
      .text(d => `${d.percentage}%`);
  }

  ticked() {
    this.svg.selectAll(".bubble")
      .attr("cx", d => Math.max(this.radiusScale(d.percentage), Math.min(this.width - this.radiusScale(d.percentage), d.x)))
      .attr("cy", d => Math.max(this.radiusScale(d.percentage), Math.min(this.height - this.radiusScale(d.percentage), d.y)));

    this.svg.selectAll(".bubble-label")
      .attr("x", d => Math.max(this.radiusScale(d.percentage), Math.min(this.width - this.radiusScale(d.percentage), d.x)))
      .attr("y", d => Math.max(this.radiusScale(d.percentage), Math.min(this.height - this.radiusScale(d.percentage), d.y)) + 4);
  }

  handleClick(event, d) {
    logger.info("클릭된 버블", d, 'ChartBubble');
    alert(`"${d.name}" (${d.percentage}%)이(가) 클릭되었습니다!`);
  }

  handleMouseOver(event, d) {
    this.tooltip.style("opacity", 1)
      .html(`<strong>${d.name}</strong><br>퍼센트: ${d.percentage}%`)
      .style("left", (event.pageX + 10) + "px")
      .style("top", (event.pageY - 28) + "px");

    d3.select(event.currentTarget)
      .attr("stroke-width", 3)
      .attr("stroke", "orange");
  }

  handleMouseOut(event, d) {
    this.tooltip.style("opacity", 0);

    d3.select(event.currentTarget)
      .attr("stroke-width", 1)
      .attr("stroke", "#333");
  }

  startSimulation() {
    this.simulation.alphaTarget(0.1).restart();
  }

  updateData(newData) {
    this.bubbleData = newData;
    const minPercent = d3.min(this.bubbleData, d => d.percentage);
    const maxPercent = d3.max(this.bubbleData, d => d.percentage);
    const domain = (minPercent !== undefined && maxPercent !== undefined && minPercent <= maxPercent)
      ? [minPercent, maxPercent]
      : [0, 100];
    this.radiusScale.domain(domain); 

    this.simulation.nodes(this.bubbleData);
    this.simulation.force("collide").radius(d => this.radiusScale(d.percentage) + this.padding);

    const bubbles = this.svg.selectAll(".bubble")
      .data(this.bubbleData, d => d.id);

    const labels = this.svg.selectAll(".bubble-label")
      .data(this.bubbleData, d => d.id);

    bubbles.enter().append("circle")
      .attr("class", "bubble")
      .attr("r", 0) 
      .attr("fill", d => d.color || `hsl(${d.percentage * 2.5}, 70%, 50%)`)
      .on("click", (event, d) => this.handleClick(event, d))
      .on("mouseover", (event, d) => this.handleMouseOver(event, d))
      .on("mouseout", (event, d) => this.handleMouseOut(event, d))
      .merge(bubbles) 
      .transition().duration(750)
      .attr("r", d => this.radiusScale(d.percentage))
      .attr("fill", d => d.color || `hsl(${d.percentage * 2.5}, 70%, 50%)`);

    labels.enter().append("text")
      .attr("class", d => `bubble-label ${this.radiusScale(d.percentage) < 30 ? 'bubble-label-small' : ''}`)
      .text(d => `${d.percentage}%`)
      .merge(labels)
      .transition().duration(750)
      .attr("class", d => `bubble-label ${this.radiusScale(d.percentage) < 30 ? 'bubble-label-small' : ''}`)
      .text(d => `${d.percentage}%`);

    bubbles.exit().transition().duration(750).attr("r", 0).remove();
    labels.exit().transition().duration(750).style("opacity", 0).remove();

    this.startSimulation();
  }
}

export default ChartBubble;