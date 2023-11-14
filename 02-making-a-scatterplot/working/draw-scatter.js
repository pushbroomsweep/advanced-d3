async function drawScatter() {
  // load dataset
  const dataset = await d3.json("./../../my_weather_data.json");
  console.table(dataset[0]);

  // this allows us to access the dataset in the console
  window.myDataset = dataset;

  // define accessor functions
  const xAccessor = (d) => d.dewPoint;
  const yAccessor = (d) => d.humidity;
  const colorAccessor = (d) => d.cloudCover;

  // choose the side of the scatterplot to be minimum of window width or height
  const width = d3.min([window.innerWidth * 0.9, window.innerHeight * 0.9]);
  let dimensions = {
    width: width,
    height: width,
    margin: {
      top: 10,
      right: 10,
      bottom: 50,
      left: 50,
    },
  };

  // compute bound sizes
  dimensions.boundedWidth =
    dimensions.width - dimensions.margin.left - dimensions.margin.right;
  dimensions.boundedHeight =
    dimensions.height - dimensions.margin.top - dimensions.margin.bottom;

  // wrapper object
  const wrapper = d3
    .select("#wrapper")
    .append("svg")
    .attr("width", dimensions.width)
    .attr("height", dimensions.height);

  // bounds object
  const bounds = wrapper
    .append("g")
    .style(
      "transform",
      `translate(${dimensions.margin.left}px, ${dimensions.margin.top}px)`
    );

  // create scales
  const xScale = d3
    .scaleLinear()
    .domain(d3.extent(dataset, xAccessor))
    .range([0, dimensions.boundedWidth])
    .nice();

  const yScale = d3
    .scaleLinear()
    .domain(d3.extent(dataset, yAccessor))
    .range([dimensions.boundedHeight, 0])
    .nice();

  // create a color scale
  const colorScale = d3
    .scaleLinear()
    .domain(d3.extent(dataset, colorAccessor))
    .range(["skyblue", "darkslategrey"]);

  // draw data
  // this is the hard and unrecommended way to draw data
  // dataset.forEach(d => {
  //     bounds.append("circle")
  //   .attr("cx", xScale(xAccessor(d)))
  //   .attr("cy", yScale(yAccessor(d)))
  //   .attr("r", 5);
  // })
  // const dots = bounds.selectAll("circle")
  // .data(dataset)
  // .enter().append("circle")
  // .attr("cx", d => xScale(xAccessor(d)))
  // .attr("cy", d => yScale(yAccessor(d)))
  // .attr("r", 5)
  // .attr("fill", "cornflowerblue")
  // console.log(dots)

  // function drawDots(dataset, color) {
  //     const dots = bounds.selectAll("circle")
  //     .data(dataset)
  //     dots
  //     .enter().append("circle")
  //     .merge(dots)
  //     .attr("cx", d => xScale(xAccessor(d)))
  //     .attr("cy", d => yScale(yAccessor(d)))
  //     .attr("r", 5)
  //     .attr("fill", color)
  //     console.log(dots)
  // }
  function drawDots(dataset, color) {
    const dots = bounds.selectAll("circle").data(dataset);
    dots
      .join("circle") // join replaces enter and append
      .attr("cx", (d) => xScale(xAccessor(d)))
      .attr("cy", (d) => yScale(yAccessor(d)))
      .attr("r", 5)
      .attr("fill", color);
    console.log(dots);
  }
  drawDots(dataset, (d) => colorScale(colorAccessor(d)));

  // draw peripherals
  const xAxisGenerator = d3.axisBottom().scale(xScale);
  const xAxis = bounds
    .append("g")
    .call(xAxisGenerator)
    .style("transform", `translateY(${dimensions.boundedHeight}px)`);

  const xAxisLabel = xAxis
    .append("text")
    .html("Dew point (&deg;F)")
    .attr("fill", "black") // explicit black fill because we are in a <g> element which has no fill by default
    .style("font-size", "1.4em") // will be at bottom left of the chart
    .attr("x", dimensions.boundedWidth / 2) // horizontal center
    .attr("y", dimensions.margin.bottom - 10); // 10px above bottom

  const yAxisGenerator = d3.axisLeft().scale(yScale).ticks(5); // won't necessarily be 5 ticks
  const yAxis = bounds.append("g").call(yAxisGenerator);

  const yAxisLabel = yAxis
    .append("text")
    .html("Relative humidity")
    .attr("fill", "black")
    .style("font-size", "1.4em") // will be at top left of the chart
    .attr("x", -dimensions.boundedHeight / 2)
    .attr("y", -dimensions.margin.left + 10)
    .style("transform", "rotate(-90deg)") // rotate 90 degrees counter-clockwise
    .style("text-anchor", "middle"); // center the text vertically
}

drawScatter();
