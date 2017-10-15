/** Class implementing the table. */
class Table {
    /**
     * Creates a Table Object
     */
    constructor(teamData, treeObject) {

        //Maintain reference to the tree Object; 
        this.tree = treeObject;
        console.log(teamData);

        // Create list of all elements that will populate the table
        // Initially, the tableElements will be identical to the teamData
        this.tableElements = teamData; //

        ///** Store all match data for the 2014 Fifa cup */
        this.teamData = teamData;

        //Default values for the Table Headers
        this.tableHeaders = ["Delta Goals", "Result", "Wins", "Losses", "TotalGames"];

        /** To be used when sizing the svgs in the table cells.*/
        this.cell = {
            "width": 70,
            "height": 20,
            "buffer": 15
        };

        this.bar = {
            "height": 20
        };

        /** Set variables for commonly accessed data columns*/
        this.goalsMadeHeader = 'Goals Made';
        this.goalsConcededHeader = 'Goals Conceded';

        /** Setup the scales*/
        this.goalScale = null;

        let yMax = d3.max(this.tableElements, function(d){
            return d.value["Goals Made"]
        });
        let yMin = d3.min(this.tableElements, function(d){
            return d.value["Goals Made"]
        });

        /** Used for games/wins/losses*/
        this.gameScale = d3.scaleLinear()
            .domain([yMin, yMax])
            .range([10,yMax*10]);

        /**Color scales*/
        /**For aggregate columns  Use colors '#ece2f0', '#016450' for the range.*/
        this.aggregateColorScale = d3.scaleLinear()
            .domain([yMin,yMax*3.6])
            .range(['#ece2f0','#016450']);
            //.range([d3.rgb(color).brighter(), d3.rgb(color).darker()]);

        /**For goal Column. Use colors '#cb181d', '#034e7b'  for the range.*/
        this.goalColorScale = d3.scaleLinear()
            .domain([yMin, yMax])
            .range(['#cb181d', '#034e7b']);

        this.team_order=0;
        this.goals_order=0;
        this.round_order=0;
        this.wins_order=0;
        this.losses_order=0;
        this.totalGames_order=0;
        this.collapsableIndex;
        this.originalTeamData=teamData.slice();
    }


    /**
     * Creates a table skeleton including headers that when clicked allow you to sort the table by the chosen attribute.
     * Also calculates aggregate values of goals, wins, losses and total games as a function of country.
     *
     */
    createTable() {

        // ******* TODO: PART II *******

        let yMax = d3.max(this.tableElements, function(d){
            return d.value["Goals Made"]
        });
        let yMin = d3.min(this.tableElements, function(d){
            return d.value["Goals Made"]
        });
        //Update Scale Domains
         this.goalScale=d3.scaleLinear()
                        .domain([0,yMax])
                        .range([0,yMax*10]);

        // Create the x axes for the goalScale.
        let xScale = this.goalScale;

        //add GoalAxis to header of col 1.
        let svg = d3.select("#goalHeader").append("svg").attr("width", 200)
                                          .attr("height", 10)
                                          .attr("style","padding-left:3px;padding-top:18px;margin-left: 24px;");

        svg.attr("transform", "translate(0,0)")
            .call(d3.axisTop(xScale))


        // ******* TODO: PART V *******

        // Set sorting callback for clicking on headers

        //called directly from HTML file

        // Clicking on headers should also trigger collapseList() and updateTable().
        //done in sort() function 

       
    }


    /**
     * Updates the table contents with a row for each element in the global variable tableElements.
     */
    updateTable() {
        // ******* TODO: PART III *******
        //Create table rows
        let matchTableBodyObj= document.getElementById("matchTableBody");
        while (matchTableBodyObj.firstChild) {
            matchTableBodyObj.removeChild(matchTableBodyObj.firstChild);
        }
        for (let i = 0; i < this.tableElements.length; i++) {
            if(this.tableElements[i].value["type"]==="game") {
                //games
                let tr = document.createElement('tr');
                tr.setAttribute("id","tr"+i);
                let th = document.createElement('th');
                th.appendChild(document.createTextNode("x"+this.tableElements[i].key));
                th.className = "game";
                tr.appendChild(th);
                matchTableBodyObj.appendChild(tr);

                //goals
                let td = document.createElement('td');
                let id = "goals_games_"+this.tableElements[i].key+i;
                td.setAttribute('id', id);
                tr.appendChild(td);
                td.setAttribute("style", "padding-left:5px;");
                td.setAttribute("class","tooltip");
                let goalsMade=this.tableElements[i].value["Goals Made"];
                let goalsConceded=this.tableElements[i].value["Goals Conceded"];
                let smallerVal=goalsMade>goalsConceded?goalsConceded:goalsMade;
                let greaterVal=goalsMade>goalsConceded?goalsMade:goalsConceded;
                let rect_color=goalsMade>goalsConceded?"#518db1":"#fb5d62";
                let diff= Math.abs(goalsMade-goalsConceded);

                let span=document.createElement("span");
                span.setAttribute("class",'tooltiptext');
                td.appendChild(span);
                span.appendChild(document.createTextNode("{Goals Made: "+goalsMade+" Goals Conceded: "+goalsConceded+"}"));

                if(diff !=0) {
                    let goalsChart = d3.select("#" + id);
                    goalsChart.append("svg").attr("width", "200")
                        .attr("height", 15)
                        .attr("style","padding-left:7px;margin-left:15px;")
                        .attr("id", "svgGoals_games" + i)
                        .append("rect").attr("y", 5)

                        .attr("x", this.goalScale(smallerVal))
                        .attr("width", this.goalScale(diff))
                        .attr("height", 3)
                        .style("fill", rect_color);
                    let svg = d3.select("#svgGoals_games"+i);

                    if(smallerVal==goalsConceded){
                        svg.append("circle")
                            .attr("r",4)
                            .attr("fill","#ffffff")
                            .attr("cx",this.goalScale(greaterVal)-3)
                            .attr("cy",7).attr("class","ring-blue");
                        svg.append("circle")
                            .attr("r",4)
                            .attr("fill","#ffffff")
                            .attr("cx",this.goalScale(smallerVal))
                            .attr("cy",7).attr("class","ring-red");
                    }else{
                        svg.append("circle")
                            .attr("r",4)
                            .attr("fill","#ffffff")
                            .attr("cx",this.goalScale(smallerVal))
                            .attr("cy",7).attr("class","ring-blue");

                        svg.append("circle")
                            .attr("r",4)
                            .attr("fill","#ffffff")
                            .attr("cx",this.goalScale(greaterVal)-3)
                            .attr("cy",7).attr("class","ring-red");
                    }
                }
                if(diff==0){
                    let goalsChart = d3.select("#" + id);
                    goalsChart.append("svg").attr("width", "200")
                        .attr("style","padding-left:7px;margin-left:15px;")
                        .attr("height", 15)
                        .attr("id", "svgGoals_games" + i)
                    let svg = d3.select("#svgGoals_games"+i);
                    svg.append("circle")
                        .attr("r",4)
                        .attr("fill","#ffffff")
                        .attr("cx",this.goalScale(greaterVal))
                        .attr("cy",7)
                        .attr("class","ring");
                }

                td = document.createElement('td');
                td.setAttribute("style", "width: 20%;")
                td.appendChild(document.createTextNode(this.tableElements[i].value["Result"].label));
                tr.appendChild(td);

                td = document.createElement('td');
                tr.appendChild(td);

                td = document.createElement('td');
                tr.appendChild(td);

                td = document.createElement('td');
                tr.appendChild(td);

                document.getElementById("tr"+i).onmouseover=function(){
                    this.tree.updateTree(this.tableElements[i]);
                }.bind(this)

            }
            if(this.tableElements[i].value["type"]==="aggregate") {
                let tr = document.createElement('tr');
                tr.setAttribute("id","tr"+i);
                let th = document.createElement('th');
                th.appendChild(document.createTextNode(this.tableElements[i].key))
                th.className = "aggregate";
                tr.appendChild(th);
                matchTableBodyObj.appendChild(tr);

               //goals
                let td = document.createElement('td');
                let id = "goals_"+this.tableElements[i].key;
                td.setAttribute('id', id);
                tr.appendChild(td);
                td.setAttribute("style", "padding-left:5px; margin-left: 15px;");
                td.setAttribute("class","tooltip");

                 let goalsMade=this.tableElements[i].value["Goals Made"];
                 let goalsConceded=this.tableElements[i].value["Goals Conceded"];
                 let smallerVal=goalsMade>goalsConceded?goalsConceded:goalsMade;
                 let greaterVal=goalsMade>goalsConceded?goalsMade:goalsConceded;
                 let rect_color=goalsMade>goalsConceded?"#518db1":"#fb5d62";
                 let diff= Math.abs(goalsMade-goalsConceded);

                let span=document.createElement("span");
                span.setAttribute("class",'tooltiptext');
                td.appendChild(span);
                span.appendChild(document.createTextNode("{Goals Made: "+goalsMade+" Goals Conceded: "+goalsConceded+"}"));

                 if(diff !=0) {
                     let goalsChart = d3.select("#" + id);
                     goalsChart.append("svg").attr("width", "200")
                         .attr("style","padding-left:7px;margin-left:15px;")
                         .attr("height", 15)
                         .attr("id", "svgGoals" + i)
                         .append("rect").attr("y", 0)

                         .attr("x", this.goalScale(smallerVal))
                         .attr("width", this.goalScale(diff))
                         .attr("height", 10)
                         .style("fill", rect_color );
                     let svg = d3.select("#svgGoals"+i);
                     if(smallerVal==goalsConceded){
                         svg.append("circle")
                             .attr("r",5)
                             .attr("fill","#cb181d")
                             .attr("cx",this.goalScale(smallerVal))
                             .attr("cy",5);

                         svg.append("circle")
                             .attr("r",5)
                             .attr("fill","#034e7b")
                             .attr("cx",this.goalScale(greaterVal))
                             .attr("cy",5)

                     }else{
                         svg.append("circle")
                             .attr("r",5)
                             .attr("fill","#034e7b")
                             .attr("cx",this.goalScale(smallerVal))
                             .attr("cy",5);

                         svg.append("circle")
                             .attr("r",5)
                             .attr("fill","#cb181d")
                             .attr("cx",this.goalScale(greaterVal))
                             .attr("cy",5)
                     }

                 }
                 if(diff==0){
                     let goalsChart = d3.select("#" + id);
                     goalsChart.append("svg").attr("width", "200")
                         .attr("style","padding-left:7px;margin-left:15px;")
                         .attr("height", 15)
                         .attr("id", "svgGoals" + i)
                     let svg = d3.select("#svgGoals"+i);
                     svg.append("circle")
                         .attr("r",5)
                         .attr("fill","#9a9494")
                         .attr("cx",this.goalScale(greaterVal))
                         .attr("cy",5);
                 }


                td = document.createElement('td');
                td.appendChild(document.createTextNode(this.tableElements[i].value["Result"].label));
                tr.appendChild(td);

                td = document.createElement('td');
                id = "win_"+this.tableElements[i].key;
                td.setAttribute('id', id);
                tr.appendChild(td);
                td.setAttribute("style", "padding-left:0px");

                if(this.tableElements[i].value["Wins"]!=0){
                    let roundChart = d3.select("#" + id);
                    roundChart.append("svg").attr("width", "70")
                        .attr("height", 15)
                        .attr("id","svgWin"+i)
                        .append("rect").attr("x", 0)

                    .attr("y", 0)
                    .attr("width", this.gameScale(this.tableElements[i].value["Wins"])
                    )
                    .attr("height", 15)
                    .style("fill",
                       this.aggregateColorScale(this.tableElements[i].value["Wins"]*10)
                    );
                    let svg=d3.select("#svgWin"+i);
                    let text=svg.append("g");

                    text.append("text").text(this.tableElements[i].value["Wins"]).attr("y",12).attr("x", this.gameScale(this.tableElements[i].value["Wins"])-12)
                        .attr("style","fill:white")
                }


                //losses
                td = document.createElement('td');
                id = "losses_"+this.tableElements[i].key;
                td.setAttribute('id', id);
                tr.appendChild(td);
                td.setAttribute("style", "padding-left:0px");

                if(this.tableElements[i].value["Losses"]!=0){
                    let lossesChart = d3.select("#" + id);
                    lossesChart.append("svg").attr("width", "70")
                        .attr("height", 15)
                        .attr("id","svgLosses"+i)
                        .append("rect").attr("x", 0)
                        .attr("y", 0)
                        .attr("width", this.gameScale(this.tableElements[i].value["Losses"])
                        )
                        .attr("height", 15)
                        .style("fill",
                            this.aggregateColorScale(this.tableElements[i].value["Losses"]*10)
                        );
                    let svg=d3.select("#svgLosses"+i);
                    let text=svg.append("g");

                    text.append("text").text(this.tableElements[i].value["Losses"]).attr("y",12).attr("x", this.gameScale(this.tableElements[i].value["Losses"])-12)
                        .attr("style","fill:white")
                }

                //total games
                td = document.createElement('td');
                id = "totalgames_"+this.tableElements[i].key;
                td.setAttribute('id', id);
                tr.appendChild(td);
                td.setAttribute("style", "padding-left:0px");

                if(this.tableElements[i].value["TotalGames"]!=0){
                    let lossesChart = d3.select("#" + id);
                    lossesChart.append("svg").attr("width", "70")
                        .attr("height", 15)
                        .attr("id","svgTotalGames"+i)
                        .append("rect").attr("x", 0)

                        .attr("y", 0)
                        .attr("width", this.gameScale(this.tableElements[i].value["TotalGames"])
                        )
                        .attr("height", 15)
                        .style("fill",
                            this.aggregateColorScale(this.tableElements[i].value["TotalGames"]*10)
                        );
                    let svg=d3.select("#svgTotalGames"+i);
                    let text=svg.append("g");

                    text.append("text").text(this.tableElements[i].value["TotalGames"]).attr("y",12).attr("x", this.gameScale(this.tableElements[i].value["TotalGames"])-12)
                        .attr("style","fill:white")
                }
                document.getElementById("tr"+i).onclick=function(){
                    this.updateList(i);
                }.bind(this)
                document.getElementById("tr"+i).onmouseover=function(){
                    this.tree.updateTree(this.tableElements[i]);
                }.bind(this)
            }


        }

    };

    /**
     * Updates the global tableElements variable, with a row for each row to be rendered in the table.
     *
     */
    updateList(i) {
        // ******* TODO: PART IV *******
       
        //Only update list for aggregate clicks, not game clicks
        let currObject=this.tableElements[i];
        let currType=currObject.value["type"];
        let nxtObjType=this.tableElements[i+1].value["type"];
        if(currType=="aggregate" && nxtObjType == "game"){
            this.collapsableIndex=i;
            this.collapseList();
        }
        else if(currType=="aggregate" && nxtObjType == "aggregate"){
            let gamesArr = currObject.value["games"];
            let newTableData=this.tableElements;
            let j=0;
            let index=i;
            for(j=0;j<gamesArr.length;j++){
                newTableData.splice(index+1,0,gamesArr[j]);
                index++;
            }
            this.tableElements=newTableData;
            this.updateTable();
        }

    }

    /**
     * Collapses all expanded countries, leaving only rows for aggregate values per country.
     *
     */
    collapseList() {
        
        // ******* TODO: PART IV *******

        let currObject=this.tableElements[this.collapsableIndex];
        let gamesNo=currObject.value["games"].length;
        let newTableElements=this.tableElements;
        newTableElements.splice(this.collapsableIndex+1,gamesNo);
        this.updateTable();

    }

    sort(headerName){
        this.tableElements=this.originalTeamData.slice();

        if(headerName=="team" && this.team_order==0 ){
            this.tableElements.sort(function(a, b) {return (a.key > b.key) ? 1 : ((b.key > a.key) ? -1 : 0);} );
            this.team_order=1;
        }else if(headerName=="goals" && this.goals_order==0){
            this.tableElements.sort(function(a, b){return a.value["Goals Made"] - b.value["Goals Made"]});
            this.goals_order=1;
        }else if(headerName=="round" && this.round_order==0){
            this.tableElements.sort(function(a, b){return b.value["Result"].ranking - a.value["Result"].ranking});
            this.round_order=1;
        }else if(headerName=="wins" && this.wins_order==0){
            this.tableElements.sort(function(a, b){return a.value["Wins"] - b.value["Wins"]});
            this.wins_order=1;
        }else if(headerName=="losses" && this.losses_order==0){
            this.tableElements.sort(function(a, b){return a.value["Losses"] - b.value["Losses"]});
            this.losses_order=1;
        }else if(headerName=="totalGames" && this.totalGames_order==0){
            this.tableElements.sort(function(a, b){return a.value["TotalGames"] - b.value["TotalGames"]});
            this.totalGames_order=1;
        }else if(headerName=="team" && this.team_order==1 ){
            this.tableElements.sort(function(a,b) {return (b.key > a.key) ? 1 : ((a.key > b.key) ? -1 : 0);} );
            this.team_order=0;
        }else if(headerName=="goals" && this.goals_order==1){
            this.tableElements.sort(function(a,b){return b.value["Goals Made"] - a.value["Goals Made"]});
            this.goals_order=0;
        }else if(headerName=="round" && this.round_order==1){
            this.tableElements.sort(function(a,b){return a.value["Result"].ranking - b.value["Result"].ranking});
            this.round_order=0;
        }else if(headerName=="wins" && this.wins_order==1){
            this.tableElements.sort(function(a,b){return b.value["Wins"] - a.value["Wins"]});
            this.wins_order=0;
        }else if(headerName=="losses" && this.losses_order==1){
            this.tableElements.sort(function(a,b){return b.value["Losses"] - a.value["Losses"]});
            this.losses_order=0;
        }else if(headerName=="totalGames" && this.totalGames_order==1){
            this.tableElements.sort(function(a,b){return b.value["TotalGames"] - a.value["TotalGames"]});
            this.totalGames_order=0;
        }
        this.updateTable();
    }


}
