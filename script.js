const width = 800;
const height = 400;
const margin = { top: 20, right: 30, bottom: 40, left: 50 };

// Create SVG container
const svg = d3.select("#chart")
    .append("svg")
    .attr("width", width)
    .attr("height", height)
  .append("g")
    .attr("transform", `translate(${margin.left},${margin.top})`);

// Load JSON data
d3.json("data.json").then(data => {
    const states = Array.from(new Set(data.map(d => d.Area)));

    // Populate dropdown menu
    const dropdown = d3.select("#state-select");
    dropdown.selectAll("option")
        .data(states)
      .enter().append("option")
        .attr("value", d => d)
        .text(d => d);

    // Function to update chart based on selected state
    function updateChart(selectedState) {
        // Filter data for selected state
        const stateData = data.filter(d => d.Area === selectedState);

        // Clear previous chart
        svg.selectAll("*").remove();

        if (stateData.length === 0) return;

        // Define crime attributes to include in the chart (excluding 'Population')
        const crimeAttributes = Object.keys(stateData[0])
            .filter(key => key !== "Area" && key !== "Year" && key !== "Population");

        const x = d3.scaleBand()
            .domain(crimeAttributes)
            .range([0, width - margin.left - margin.right])
            .padding(0.1);

        const y = d3.scaleLinear()
            .domain([0, d3.max(stateData, d => d3.max(crimeAttributes, attr => d[attr]))])
            .nice()
            .range([height - margin.top - margin.bottom, 0]);

        // Create axes
        svg.append("g")
            .attr("class", "x-axis")
            .attr("transform", `translate(0,${height - margin.top - margin.bottom})`)
            .call(d3.axisBottom(x));

        svg.append("g")
            .attr("class", "y-axis")
            .call(d3.axisLeft(y));

        // Create bars
        crimeAttributes.forEach(crimeType => {
            svg.append("rect")
                .attr("x", x(crimeType))
                .attr("y", y(stateData[0][crimeType]))
                .attr("width", x.bandwidth())
                .attr("height", height - margin.top - margin.bottom - y(stateData[0][crimeType]))
                .attr("fill", "steelblue")
                .on("mouseover", function() { d3.select(this).attr("fill", "orange"); })
                .on("mouseout", function() { d3.select(this).attr("fill", "steelblue"); });

            // Add labels to the bars
            svg.append("text")
                .attr("x", x(crimeType) + x.bandwidth() / 2)
                .attr("y", y(stateData[0][crimeType]) - 5)
                .attr("text-anchor", "middle")
                .text(stateData[0][crimeType])
                .attr("class", "label");
        });
    }

    // Initial chart
    updateChart(states[0]);

    // Event listener for dropdown
    dropdown.on("change", function() {
        updateChart(this.value);
    });
}).catch(error => {
    console.error("Error loading or parsing data:", error);
});

// Event listener for button
document.getElementById('next-page-btn').addEventListener('click', function() {
    window.location.href = 'next-page.html';
});
