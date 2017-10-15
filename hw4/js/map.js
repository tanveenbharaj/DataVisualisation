/** Class implementing the map view. */
class Map {
    /**
     * Creates a Map Object
     */
    constructor() {
        this.projection = d3.geoConicConformal().scale(150).translate([400, 350]);

    }

    /**
     * Function that clears the map
     */
    clearMap() {

        // ******* TODO: PART V*******
        // Clear the map of any colors/markers; You can do this with inline styling or by
        // defining a class style in styles.css

        // Hint: If you followed our suggestion of using classes to style
        // the colors and markers for hosts/teams/winners, you can use
        // d3 selection and .classed to set these classes on and off here
            // here we use the familiar d attribute again to define the path
                d3.selectAll("path").classed("host",false)
                .classed("team",false);
                d3.select("#ru_points").selectAll("circle").remove();
                d3.select("#win_points").selectAll("circle").remove();
    }

    /**
     * Update Map with info for a specific FIFA World Cup
     * @param wordcupData the data for one specific world cup
     */
    updateMap(worldcupData) {

        //Clear any previous selections;
        this.clearMap();

        // Hint: remember we have a conveniently labeled class called .winner
        // as well as a .silver. These have styling attributes for the two
        // markers.

        // Iterate through all participating teams and change their color as well.

        // We strongly suggest using CSS classes to style the selected countries.

        let teams=worldcupData.teams_iso;
        teams.forEach(function(d){
           d3.select("#"+d)
               .classed("team",true)
        });


        // Select the host country and change it's color accordingly.
        let host=worldcupData.host_country_code;
            d3.select("#"+host)
                .classed("team",false)
                .classed("host",true)
        ;

        // ******* TODO: PART V *******

        // Add a marker for the winner and runner up to the map.
        // Add a marker for gold/silver medalists
        let projection=this.projection;
        let marker= d3.select("#ru_points");
        marker=marker.selectAll("circle").data(worldcupData.ru_pos);
        marker.exit().remove();
        marker=marker.enter().append("circle").merge(marker);

        marker.attr("cx",projection(worldcupData.ru_pos)[0]
        ).attr("cy", projection(worldcupData.ru_pos)[1]
            ).attr('r',function(d){
                return 8;
        }).attr("class","silver");

        marker= d3.select("#win_points");
        marker=marker.selectAll("circle").data(worldcupData.win_pos);
        marker.exit().remove();
        marker=marker.enter().append("circle").merge(marker);

        marker.attr("cx",projection(worldcupData.win_pos)[0]
        ).attr("cy", projection(worldcupData.win_pos)[1]
        ).attr('r',function(d){
            return 8;
        }).attr("class","gold");

    }

    /**
     * Renders the actual map
     * @param the json data with the shape of all countries
     */
    drawMap(world) {

        //(note that projection is a class member
        // updateMap() will need it to add the winner/runner_up markers.)

        // ******* TODO: PART IV *******

        // Draw the background (country outlines; hint: use #map)
        // Make sure and add gridlines to the map

        let topo_data = topojson.feature(world, world.objects.countries);
        let path = d3.geoPath()
            .projection(this.projection);

        // Load in GeoJSON data
          let map =  d3.select("#map").selectAll("path");
          map.remove().exit();
          map=map.data(topo_data.features)
                .enter()
                .append("path").merge(map);

                map.attr("class","countries")
                .attr("id",function(d){
                    return d.id;
                })
                .attr("d", path)
                .on("click", function(d) {
                    let id=d.id;
                    let i=0;
                    let years_array=[];
                    let index=0;
                    let list = d3.select("#country");
                    list.selectAll('li').remove();
                    d3.csv("data/fifa-world-cup.csv", function (error, allData) {
                        allData.forEach(function (d) {
                            let teams_code = d.TEAM_LIST;
                            let j = 0;

                            teams_code=teams_code.split(",");
                            for (j = 0; j < teams_code.length; j++) {
                                if (teams_code[j] == id) {
                                        list.append("li").text(d.YEAR);
                                }
                            }

                        });
                    });
                });
            let graticule = d3.geoGraticule();
            d3.select("#map").append('path').datum(graticule).attr('class', "grat").attr('d', path).attr('fill', 'none');


        // Hint: assign an id to each country path to make it easier to select afterwards
        // we suggest you use the variable in the data element's .id field to set the id

        // Make sure and give your paths the appropriate class (see the .css selectors at
        // the top of the provided html file)
    }
}
