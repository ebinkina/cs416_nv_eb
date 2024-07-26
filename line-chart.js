document.addEventListener("DOMContentLoaded", function() {
    const width = 1000; // Width for both charts
    const height = 500; // Height for each chart
    const margin = { top: 20, right: 30, bottom: 100, left: 60 }; // Margin for both charts

    // Create container for both charts
    const container = d3.select("#line-chart");

    // Create first chart for theft
    const svg1 = container.append("svg")
        .attr("width", width)
        .attr("height", height)
      .append("g")
        .attr("transform", `translate(${margin.left},${margin.top})`);

    // Create second chart for property crime
    const svg2 = container.append("svg")
        .attr("width", width)
        .attr("height", height)
        .attr("transform", `translate(0,${height + margin.bottom / 2})`) // Adjust y to position below first chart
      .append("g")
        .attr("transform", `translate(${margin.left},${margin.top})`); // Apply margin for second chart

    // Load JSON data
    d3.json("data.json").then(data => {
        // Sort data by theft rate
        data.sort((a, b) => b.Theft - a.Theft);

        // Scales for theft chart
        const x1 = d3.scaleBand()
            .domain(data.map(d => d.Area))
            .range([0, width - margin.left - margin.right])
            .padding(0.1);

        const y1 = d3.scaleLinear()
            .domain([0, d3.max(data, d => d.Theft)])
            .nice()
            .range([height - margin.top - margin.bottom, 0]);

        // Axes for theft chart
        svg1.append("g")
            .attr("class", "x-axis")
            .attr("transform", `translate(0,${height - margin.top - margin.bottom})`)
            .call(d3.axisBottom(x1).tickSize(0))
            .selectAll("text")
            .attr("transform", "rotate(-90)") // Rotate labels
            .attr("dx", "-0.8em")
            .attr("dy", "0.15em")
            .style("text-anchor", "end");

        svg1.append("g")
            .attr("class", "y-axis")
            .call(d3.axisLeft(y1));

        // Create line for theft chart
        const line1 = d3.line()
            .x(d => x1(d.Area) + x1.bandwidth() / 2)
            .y(d => y1(d.Theft));

        svg1.append("path")
            .datum(data)
            .attr("class", "line")
            .attr("d", line1)
            .attr("fill", "none")
            .attr("stroke", "steelblue");

        // Add points for theft chart
        svg1.selectAll(".dot")
            .data(data)
          .enter().append("circle")
            .attr("class", "dot")
            .attr("cx", d => x1(d.Area) + x1.bandwidth() / 2)
            .attr("cy", d => y1(d.Theft))
            .attr("r", 5)
            .attr("fill", "steelblue")
            .on("mouseover", function(event, d) {
                d3.select(this).attr("fill", "orange");
                d3.select("body").append("div")
                    .attr("class", "tooltip")
                    .style("left", `${event.pageX}px`)
                    .style("top", `${event.pageY - 28}px`)
                    .style("visibility", "visible")
                    .html(`<strong>${d.Area}</strong><br>Theft: ${d.Theft}`);
            })
            .on("mousemove", function(event) {
                d3.select(".tooltip")
                    .style("left", `${event.pageX}px`)
                    .style("top", `${event.pageY - 28}px`);
            })
            .on("mouseout", function() {
                d3.select(this).attr("fill", "steelblue");
                d3.select(".tooltip").remove();
            });

        // Sort data by property crime rate
        data.sort((a, b) => b.PropertyCrime - a.PropertyCrime);

        // Scales for property crime chart
        const x2 = d3.scaleBand()
            .domain(data.map(d => d.Area))
            .range([0, width - margin.left - margin.right])
            .padding(0.1);

        const y2 = d3.scaleLinear()
            .domain([0, d3.max(data, d => d.PropertyCrime)])
            .nice()
            .range([height - margin.top - margin.bottom, 0]);

        // Axes for property crime chart
        svg2.append("g")
            .attr("class", "x-axis")
            .attr("transform", `translate(0,${height - margin.top - margin.bottom})`)
            .call(d3.axisBottom(x2).tickSize(0))
            .selectAll("text")
            .attr("transform", "rotate(-90)") // Rotate labels
            .attr("dx", "-0.8em")
            .attr("dy", "0.15em")
            .style("text-anchor", "end");

        svg2.append("g")
            .attr("class", "y-axis")
            .call(d3.axisLeft(y2));

        // Create line for property crime chart
        const line2 = d3.line()
            .x(d => x2(d.Area) + x2.bandwidth() / 2)
            .y(d => y2(d.PropertyCrime));

        svg2.append("path")
            .datum(data)
            .attr("class", "line")
            .attr("d", line2)
            .attr("fill", "none")
            .attr("stroke", "darkorange");

        // Add points for property crime chart
        svg2.selectAll(".dot")
            .data(data)
          .enter().append("circle")
            .attr("class", "dot")
            .attr("cx", d => x2(d.Area) + x2.bandwidth() / 2)
            .attr("cy", d => y2(d.PropertyCrime))
            .attr("r", 5)
            .attr("fill", "darkorange")
            .on("mouseover", function(event, d) {
                d3.select(this).attr("fill", "red");
                d3.select("body").append("div")
                    .attr("class", "tooltip")
                    .style("left", `${event.pageX}px`)
                    .style("top", `${event.pageY - 28}px`)
                    .style("visibility", "visible")
                    .html(`<strong>${d.Area}</strong><br>Property Crime: ${d.PropertyCrime}`);
            })
            .on("mousemove", function(event) {
                d3.select(".tooltip")
                    .style("left", `${event.pageX}px`)
                    .style("top", `${event.pageY - 28}px`);
            })
            .on("mouseout", function() {
                d3.select(this).attr("fill", "darkorange");
                d3.select(".tooltip").remove();
            });
    }).catch(error => {
        console.error("Error loading or parsing data:", error);
    });

    // Event listeners for buttons
    document.getElementById('back-btn').addEventListener('click', function() {
        window.location.href = 'index.html';
    });

    document.getElementById('scatterplot-btn').addEventListener('click', function() {
        window.location.href = 'next-page.html';
    });
});
