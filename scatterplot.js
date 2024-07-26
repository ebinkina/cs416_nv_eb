const width = 800;
const height = 400;
const margin = { top: 20, right: 30, bottom: 40, left: 50 };

// Create SVG container
const svg = d3.select("#scatterplot")
    .append("svg")
    .attr("width", width)
    .attr("height", height)
  .append("g")
    .attr("transform", `translate(${margin.left},${margin.top})`);

// Load JSON data
d3.json("data.json").then(data => {
    // Extract unique regions
    const regions = Array.from(new Set(data.map(d => d.Region)));

    // Define color scale for regions
    const color = d3.scaleOrdinal(d3.schemeCategory10)
        .domain(regions);

    // Define scales
    const x = d3.scaleLinear()
        .domain([0, d3.max(data, d => d.Population)])
        .nice()
        .range([0, width - margin.left - margin.right]);

    const y = d3.scaleLinear()
        .domain([0, d3.max(data, d => d.Murder)])
        .nice()
        .range([height - margin.top - margin.bottom, 0]);

    // Add X axis
    svg.append("g")
        .attr("class", "x-axis")
        .attr("transform", `translate(0,${height - margin.top - margin.bottom})`)
        .call(d3.axisBottom(x).ticks(10))
      .append("text")
        .attr("x", width - margin.left - margin.right)
        .attr("y", -6)
        .attr("text-anchor", "end")
        .attr("fill", "#000")
        .text("Population");

    // Add Y axis
    svg.append("g")
        .attr("class", "y-axis")
        .call(d3.axisLeft(y).ticks(10))
      .append("text")
        .attr("transform", "rotate(-90)")
        .attr("y", 6)
        .attr("dy", "-3.5em")
        .attr("text-anchor", "end")
        .attr("fill", "#000")
        .text("Murder Rate");

    // Create scatterplot points
    svg.selectAll("circle")
        .data(data)
      .enter().append("circle")
        .attr("cx", d => x(d.Population))
        .attr("cy", d => y(d.Murder))
        .attr("r", 5)
        .attr("fill", d => color(d.Region))
        .on("mouseover", function(event, d) {
            d3.select(this).attr("fill", "orange");
            // Show tooltip with state name, population, and murder rate
            d3.select("#tooltip")
                .style("visibility", "visible")
                .html(`<strong>${d.Area}</strong><br>Population: ${d.Population}<br>Murder Rate: ${d.Murder}`);
        })
        .on("mousemove", function(event) {
            d3.select("#tooltip")
                .style("top", (event.pageY - 10) + "px")
                .style("left", (event.pageX + 10) + "px");
        })
        .on("mouseout", function(event, d) {
            d3.select(this).attr("fill", color(d.Region));
            d3.select("#tooltip").style("visibility", "hidden");
        });

    // Add tooltip element
    d3.select("body").append("div")
        .attr("id", "tooltip")
        .style("position", "absolute")
        .style("background", "#fff")
        .style("border", "1px solid #ccc")
        .style("padding", "5px")
        .style("visibility", "hidden");

    // Add legend for regions
    const legend = d3.select("#legend")
        .append("svg")
        .attr("width", 200)
        .attr("height", regions.length * 20);

    const legendItems = legend.selectAll(".legend-item")
        .data(regions)
      .enter().append("g")
        .attr("class", "legend-item")
        .attr("transform", (d, i) => `translate(0, ${i * 20})`);

    legendItems.append("rect")
        .attr("x", 0)
        .attr("width", 18)
        .attr("height", 18)
        .style("fill", d => color(d));

    legendItems.append("text")
        .attr("x", 25)
        .attr("y", 9)
        .attr("dy", ".35em")
        .text(d => d);

}).catch(error => {
    console.error("Error loading or parsing data:", error);
});

// Event listener for buttons
document.getElementById('back-btn').addEventListener('click', function() {
    window.location.href = 'index.html';
});

