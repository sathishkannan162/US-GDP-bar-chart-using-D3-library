const w = 1000,
h = 500,
padding = 50;
const yOffset = 80;
const xOffset = 250;
let GDPData;
const barColor = "orange";
const overlayBarColor = "white";
function formatNumber(num) {
  let str = "".concat(num);
  let regex = /\d\d\d.\d$/;
  let end = str.match(regex);
  let newStr = str.replace(regex, "," + end);
  return newStr;
}
let overlayBar = d3.
select(".app-background").
append("div").
attr("id", "overlay-bar").
attr("width", 0).
attr("height", 0).
style("color", "white");

fetch(
"https://raw.githubusercontent.com/sathishkannan162/US-GDP-bar-chart-using-D3-library/master/GDP.json").

then(response => response.json()).
then(data => {
  GDPData = data;

  function xData(year, month) {
    let quarter = year;
    let xPos = year;

    switch (month) {
      case 1:
        quarter = year + " Q1";
        xPos = year + 0.0;
        break;
      case 4:
        quarter = year + " Q2";
        xPos = year + 0.25;
        break;
      case 7:
        quarter = year + " Q3";
        xPos = year + 0.5;
        break;
      case 10:
        quarter = year + " Q4";
        xPos = year + 0.75;
        break;
      default:
        quarter = year + "error";
        xPos = month + "error";
        break;}


    return [xPos, quarter];
  }

  function formatYear(date) {
    let yearRegex = /^\d\d\d\d/;
    let monthRegex = /\d\d(?=-01$)/;
    let year = parseInt(date.match(yearRegex));

    let month = parseInt(date.match(monthRegex));

    xData(year, month);

    return xData(year, month);
  }

  let dataset = GDPData.data.map((d, i) => {
    return [...formatYear(d[0]), d[1]];
  });


  const xScale = d3.scaleLinear();
  xScale.domain([d3.min(dataset, d => d[0]), d3.max(dataset, d => d[0])]);

  xScale.range([padding, w - padding]);

  const yScale = d3.scaleLinear();
  yScale.domain([0, d3.max(dataset, d => d[2])]);
  yScale.range([h - padding, padding]);
 

  const svg = d3.
  select(".app-background").
  append("svg").
  attr("width", w).
  attr("height", h).
  style("background-color", "white");

  svg.
  selectAll("rect").
  data(dataset).
  enter().
  append("rect").
  attr("class", "bar").
  attr("data-date", (d, i) => GDPData.data[i][0]).
  attr("data-gdp", (d, i) => GDPData.data[i][1]).
  attr("id", d => d[0]).
  attr("width", xScale(1948.25) - xScale(1948) - 0.02).
  attr("x", d => xScale(d[0])).
  attr("fill", barColor).
  attr("y", d => yScale(d[2])).
  attr("height", d => h - padding - yScale(d[2])).
  on("mouseover", function (event, d) {
    overlay.
    attr("data-date", GDPData.data[dataset.indexOf(d)][0]).
    style("opacity", 1).
    text(d[1]).
    style("left", xScale(d[0]) + xOffset + 40 + "px").
    style("top", h - 150 + yOffset + "px").
    append("div").
    text("$" + formatNumber(d[2]) + " billions");

    overlayBar.
    style("left", xScale(d[0]) + 3 + xOffset + "px").
    style("background-color", overlayBarColor).
    style("top", yScale(d[2]) + yOffset + "px").
    style("width", xScale(1948.25) - xScale(1948) - 0.02 + "px").
    style("height", h - padding - yScale(d[2]) + "px");
  }).
  on("mouseout", function (event, d) {
    overlay.text(" ").style("opacity", 0);
    overlayBar.
    style("left", 0).
    style("top", 0).
    attr("height", 0).
    attr("width", 0);
  });

  let overlay = d3.
  select(".app-background").
  append("div").
  text("hello").
  attr("id", "tooltip").
  style("opacity", 0);

  const xAxis = d3.axisBottom(xScale);
  xAxis.tickFormat(d3.format(""));

  const yAxis = d3.axisLeft(yScale);
  svg.
  append("g").
  attr("id", "x-axis").
  attr("transform", "translate(0," + (h - padding) + ")").
  call(xAxis);

  svg.
  append("g").
  attr("id", "y-axis").
  attr("transform", "translate( " + padding + ",0)").
  call(yAxis);

  d3.select("x-axis").selectAll("text").attr("class", "tick");
  d3.select("y-axis").selectAll("text").attr("class", "tick");

  svg.
  append("text").
  attr("x", (w - padding - 450) / 2).
  attr("y", padding + 50).
  text("United States GDP").
  attr("id", "title").
  attr("font-size", 60);

  svg.
  append("text").
  text("Gross Domestic Product").
  attr("x", -240).
  attr("y", 65);
});