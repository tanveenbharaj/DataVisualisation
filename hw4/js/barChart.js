/** Class implementing the bar chart view. */
class BarChart {

    /**
     * Create a bar chart instance and pass the other views in.
     * @param worldMap
     * @param infoPanel
     * @param allData
     */
    constructor(worldMap, infoPanel, allData) {
        this.worldMap = worldMap;
        this.infoPanel = infoPanel;
        this.allData = allData;
    }

    /**
     * Render and update the bar chart based on the selection of the data type in the drop-down box
     */
    updateBarChart(selectedDimension) {

        let svg=d3.select('#barChart');
        let margin = {top: 20, right: 20, bottom: 20, left: 20};
       let width = parseInt(svg.style("width")) - margin.left - margin.right;
       let height = parseInt(svg.style("height")) - margin.top - margin.bottom;
        let color = "steelblue";

        let yMax = d3.max(this.allData, function(d){
            if(selectedDimension=='attendance'){return d.attendance}
            else if(selectedDimension=='teams'){return d.teams}
            else if(selectedDimension=='matches'){return d.matches}
            else if(selectedDimension=='goals'){return d.goals}
        });
        let yMin = d3.min(this.allData, function(d){
            if(selectedDimension=='attendance'){return d.attendance}
            else if(selectedDimension=='teams'){return d.teams}
            else if(selectedDimension=='matches'){return d.matches}
            else if(selectedDimension=='goals'){return d.goals}
    });
        // Create colorScale
        let colorScale = d3.scaleLinear()
            .domain([yMin, yMax])
            .range([d3.rgb(color).brighter(), d3.rgb(color).darker()]);

        // Create the x and y scales; make
        // sure to leave room for the axes

        let xScale = d3.scaleBand()
            .range([width,0 ])
            .padding([0.1]);

        xScale.domain(this.allData.map(function(d) { return d.year; }));
        let yScale = d3.scaleLinear()
            .range([height,0]);

        yScale.domain([0,d3.max(this.allData, function(d) {
            if(selectedDimension=='attendance'){return d.attendance}
            else if(selectedDimension=='teams'){return d.teams}
            else if(selectedDimension=='matches'){return d.matches}
            else if(selectedDimension=='goals'){return d.goals}
        })]);

        svg=d3.select('#barChart')
            .append("g")
            .attr("transform",
                "translate(" + margin.left + "," + margin.top + ")");

        // Create the axes (hint: use #xAxis and #yAxis)
        // add the x Axis
        svg = d3.select("#xAxis");
        svg.attr("transform", "translate(0," + height + ")")
            .call(d3.axisBottom(xScale)).selectAll("text")
            .attr("y", 0)
            .attr("x", -9)
            .attr("dy", ".35em")
            .attr("transform", "rotate(-90)")
            .style("text-anchor", "end");

        // add the y Axis
        svg = d3.select("#yAxis")
            .transition()
            .duration(2500).attr("opacity", 1)
        ;
        svg.call(d3.axisLeft(yScale));


        // Create the bars (hint: use #bars)
         svg = d3.select("#bars");
         let bars = svg.selectAll("rect")
             .data(this.allData);

         bars.exit().attr("opacity", 1)
             .transition()
             .duration(2000)
             .attr("opacity", 0)
             .remove();

         bars = bars.enter().append("rect")
            .merge(bars);

         bars.transition()
             .duration(2000)
             .attr("x", function(d) { return xScale(d.year); })
             .attr("width", xScale.bandwidth())
             .attr("y", function(d) {
                 if(selectedDimension=='attendance'){return yScale(d.attendance);}
                 else if(selectedDimension=='teams'){return yScale(d.teams)}
                 else if(selectedDimension=='matches'){return yScale(d.matches)}
                 else if(selectedDimension=='goals'){return yScale(d.goals)}
             })
             .attr("height", function(d) {
                 if(selectedDimension=='attendance'){return height - yScale(d.attendance); }
                 else if(selectedDimension=='teams'){return height - yScale(d.teams); }
                 else if(selectedDimension=='matches'){return height - yScale(d.matches); }
                 else if(selectedDimension=='goals'){return height - yScale(d.goals); }


             })
             .attr("fill", function(d) {
                 if(selectedDimension=='attendance'){return colorScale(d.attendance)}
                 else if(selectedDimension=='teams'){return colorScale(d.teams)}
                 else if(selectedDimension=='matches'){return colorScale(d.matches)}
                 else if(selectedDimension=='goals'){return colorScale(d.goals)}
             });
            ;


        // ******* TODO: PART II *******

        // Implement how the bars respond to click events
        // Color the selected bar to indicate is has been selected.
        // Make sure only the selected bar has this new color.

        bars.on("click", function(d) {
               bars.attr("fill", function(d) {
                   if(selectedDimension=='attendance'){return colorScale(d.attendance)}
                   else if(selectedDimension=='teams'){return colorScale(d.teams)}
                   else if(selectedDimension=='matches'){return colorScale(d.matches)}
                   else if(selectedDimension=='goals'){return colorScale(d.goals)}
               });
                d3.select(this).attr("fill", 'red');
                let infoPanel = new InfoPanel();
                infoPanel.updateInfo(d);
                let map=new Map();
                map.updateMap(d);
        });

        // Call the necessary update functions for when a user clicks on a bar.
        // Note: think about what you want to update when a different bar is selected.

    }

    /**
     *  Check the drop-down box for the currently selected data type and update the bar chart accordingly.
     *
     *  There are 4 attributes that can be selected:
     *  goals, matches, attendance and teams.
     */
    chooseData() {
        // ******* TODO: PART I *******
        //Changed the selected data when a user selects a different
        // menu item from the drop down.
        let selectedDimension=document.getElementById('dataset').value;
        this.updateBarChart(selectedDimension);

    }
}
