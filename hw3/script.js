/**
 * Makes the first bar chart appear as a staircase.
 *
 * Note: use only the DOM API, not D3!
 */
function staircase() {
    // ****** TODO: PART II ******
    var selection = document.getElementById("first_bar_chart");
    var childNodes = selection.children;
    var i = 0;
    for (i = 0; i < childNodes.length; i ++) {
        if (childNodes[i] != null) {
            childNodes[i].setAttribute('height', i * 10);
        }
    }

}

/**
 * Render the visualizations
 * @param error
 * @param data
 */
function update(error, data) {
    if (error !== null) {
        alert('Could not load the dataset!');
    } else {
        // D3 loads all CSV data as strings;
        // while Javascript is pretty smart
        // about interpreting strings as
        // numbers when you do things like
        // multiplication, it will still
        // treat them as strings where it makes
        // sense (e.g. adding strings will
        // concatenate them, not add the values
        // together, or comparing strings
        // will do string comparison, not
        // numeric comparison).

        // We need to explicitly convert values
        // to numbers so that comparisons work
        // when we call d3.max()

        for (let d of data) {
            d.a = +d.a;
            d.b = +d.b;
        }
    }

    // Set up the scales
    let aScale = d3.scaleLinear()
        .domain([0, d3.max(data, d => d.a)])
.range([0, 150]);
    let bScale = d3.scaleLinear()
        .domain([0, d3.max(data, d => d.b)])
.range([0, 150]);
    let iScale = d3.scaleLinear()
        .domain([0, data.length])
        .range([0, 110]);

    // ****** TODO: PART III (you will also edit in PART V) ******

    // TODO: Select and update the 'a' bar chart bars

    var svg = d3.select("#first_bar_chart");

    var bars = svg.selectAll("rect")
        .data(data);

    bars.exit().attr("opacity", 1)
        .transition()
        .duration(2000)
        .attr("opacity", 0)
        .remove();

    bars = bars.enter().append("rect").classed("barChart", true)
    // merge the enter and the update selection
        .merge(bars);

    bars.transition()
        .duration(2000)
        .attr("y", 0)
        .attr("x", function(d, i) {
            return iScale(i);
        })
        .attr("height", function(d) {
            return aScale(d.a);
        })
        .attr("width", 10)
        .style("fill", "steelblue");

    bars.on("mouseover", function() {
        d3.select(this).style("fill", "red");
    }).on("mouseout", function() {
        d3.select(this)
            .style("fill", "steelblue");
    });

    // TODO: Select and update the 'b' bar chart bars

    var svg = d3.select("#second_bar_chart");

    var bars = svg.selectAll("rect")
        .data(data);

    bars.exit().attr("opacity", 1)
        .transition()
        .duration(2000)
        .attr("opacity", 0)
        .remove();

    bars = bars.enter().append("rect").classed("barChart", true)
        .merge(bars);

    bars.transition()
        .duration(2000)
        .attr("y", 0)
        .attr("x", function(d, i) {
            return iScale(i);
        })
        .attr("height", function(d) {
            return bScale(d.b);
        })
        .attr("width", 10)
        .style("fill", "steelblue")
        .attr("opacity", 1);
    bars.on("mouseover", function() {
        d3.select(this).style("fill", "red");
    }).on("mouseout", function() {
        d3.select(this)
            .style("fill", "steelblue");
    });

    // TODO: Select and update the 'a' line chart path using this line generator

    let aLineGenerator = d3.line()
        .x((d, i) => iScale(i))
.y((d) => aScale(d.a));

    svg = d3.select("#first_line_chart");
    var a_line = svg.select("path")
        .data(data);

    a_line.exit().attr("opacity", 1)
        .transition()
        .duration(2000)
        .attr("opacity", 0).remove();

    var newLine = a_line.enter().append("path");
    a_line = a_line.merge(newLine);

    a_line.transition()
        .duration(2000)
        .attr('d', aLineGenerator(data))
        .attr("class", "lines");

    // TODO: Select and update the 'b' line chart path (create your own generator)

    let bLineGenerator = d3.line()
        .x((d, i) => iScale(i))
.y((d) => aScale(d.b));

    svg = d3.select("#second_line_chart");
    var b_line = svg.select("path")
        .data(data);

    b_line.exit().attr("opacity", 1)
        .transition()
        .duration(2000)
        .attr("opacity", 0).remove();

    b_line = b_line.enter().append("path").merge(b_line);

    b_line.transition()
        .duration(2000).attr('d', bLineGenerator(data)).attr("class", "lines");

    // TODO: Select and update the 'a' area chart path using this area generator
    let aAreaGenerator = d3.area()
        .x((d, i) => iScale(i))
.y0(0)
        .y1(d => aScale(d.a));

    svg = d3.select("#first_area_chart");
    var a_path = svg.selectAll("path")
        .data(data);

    a_path.exit().attr("opacity", 1)
        .transition()
        .duration(2000)
        .attr("opacity", 0).remove();

    a_path = a_path.enter().append("path").merge(a_path);

    a_path.transition()
        .duration(2000).attr('d', aAreaGenerator(data)).attr("class", "areas");

    // TODO: Select and update the 'b' area chart path (create your own generator)

    let bAreaGenerator = d3.area()
        .x((d, i) => iScale(i))
.y0(0)
        .y1(d => aScale(d.b));

    svg = d3.select("#second_area_chart");
    var a_path = svg.selectAll("path")
        .data(data);

    a_path.exit().attr("opacity", 1)
        .transition()
        .duration(2000)
        .attr("opacity", 0).remove();

    a_path = a_path.enter().append("path").merge(a_path);

    a_path.transition()
        .duration(2000).attr('d', bAreaGenerator(data)).attr("class", "areas");

    // TODO: Select and update the scatterplot points

    svg = d3.select("#scatter_plot");
    var circles = svg.selectAll("circle")
        .data(data);
    circles.exit().attr("opacity", 1)
        .transition()
        .duration(2000)
        .attr("opacity", 0).remove();
    var newData = circles.enter().append("circle");
    circles = newData.merge(circles);
    circles.transition()
        .duration(2000)
        .attr("cx", function(d) {
            return d.a * 10;
        })
        .attr("cy", function(d) {
            return d.b * 10;
        })
        .attr("r", function(d) {
            return 5;
        });
    circles.classed("frame");
    circles.on("click", function(d) {
        console.log('The x & y co-ordinates of selected point is : ' + d.a + ',' + d.b)
    });

    // ****** TODO: PART IV ******

    //adding tooltip
    var tooltip = d3.select("body").append("div")
        .attr("class", "tooltip")
        .style("opacity", 0);

    circles.on("mouseover", function(d) {
        tooltip.transition()
            .duration(200)
            .style("opacity", .9);
        tooltip.html('(' + d.a + ',' + d.b + ')')
            .style("left", (d3.event.pageX) + "px")
            .style("top", (d3.event.pageY) + "px");
    })
        .on("mouseout", function(d) {
            tooltip.transition()
                .duration(500)
                .style("opacity", 0);
        });

}

/**
 * Load the file indicated by the select menu
 */
function changeData() {
    let dataFile = document.getElementById('dataset').value;
    if (document.getElementById('random').checked) {
        randomSubset();
    } else {
        d3.csv('data/' + dataFile + '.csv', update);
    }
}

/**
 *   Load the file indicated by the select menu, and then slice out a random chunk before passing the data to update()
 */
function randomSubset() {
    let dataFile = document.getElementById('dataset').value;
    if (document.getElementById('random').checked) {
        d3.csv('data/' + dataFile + '.csv', function(error, data) {
            let subset = [];
            for (let d of data) {
                if (Math.random() > 0.5) {
                    subset.push(d);
                }
            }
            update(error, subset);
        });
    } else {
        changeData();
    }
}