function GenerateContour(bin_counts) {
    d3.csv("https://raw.githubusercontent.com/umassdgithub/Fall-2023-DataViz/main/Major-Assignment-4/data/Data_CT.csv").then(function (data) {

        const contour_values = data.map(d => +d[Object.keys(d)[0]]);

        const width = 800;
        const height = 800;
        const m = 512; // number of columns
        const n = 500; // number of rows

        const min = d3.min(contour_values); // minimum value
        const max = d3.max(contour_values); // maximum value

        let colors = d3.scaleLinear()
            .domain(d3.range(min, max, parseInt(Math.abs(max - min) / 6.7)))
            .range(["#f0f0f0", "#6e95c8", "#5373a9", "#3c4f8d", "#b3d3c1", "#f8b090"])
            .interpolate(d3.interpolateHcl);

        // Create SVG container for the visualization
        const svg = d3.select("#contour")
            .append("svg")
            .attr("width", width)
            .attr("height", height)
            .style("display", "block")
            .style("margin", "auto");

        const margin = 50; // Increased margin for better axis visibility

        // Create X axis
        svg.append("g")
            .attr("transform", "translate(" + margin + "," + (height - margin) + ")")
            .call(d3.axisBottom().scale(d3.scaleLinear().domain([min, max]).range([0, width - 2 * margin])));

        // Create Y axis
        svg.append("g")
            .attr("transform", "translate(" + margin + ",0)")
            .call(d3.axisLeft().scale(d3.scaleLinear().domain([min, max]).range([height - 2 * margin, 0])));

        // Create contours
        const contours = d3.contours()
            .size([m, n])
            .thresholds(d3.range(min, max, bin_counts))
            (contour_values);

        // Apply color to contours
        svg.selectAll("path")
            .data(contours)
            .enter().append("path")
            .attr("d", d3.geoPath())
            .attr("fill", d => colors(d.value))
            .attr("transform", `translate(${margin}, ${margin})`); // Adjusted transformation

    });
}

GenerateContour(10);
