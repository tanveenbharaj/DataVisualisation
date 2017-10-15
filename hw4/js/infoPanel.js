/** Class implementing the infoPanel view. */
class InfoPanel {
    /**
     * Creates a infoPanel Object
     */
    constructor() {
    }

    /**
     * Update the info panel to show info about the currently selected world cup
     * @param oneWorldCup the currently selected world cup
     */
    updateInfo(oneWorldCup) {

        // ******* TODO: PART III *******

        // Update the text elements in the infoBox to reflect:
        // World Cup Title, host, winner, runner_up, and all participating teams that year

        // Hint: For the list of teams, you can create an list element for each team.
        // Hint: Select the appropriate ids to update the text content.

        //Set Labels
        let ps = d3.selectAll("#edition");
        ps.selectAll('span').remove();
        ps.append("span");
        ps.text(oneWorldCup.EDITION);
        ps = d3.selectAll("#host");
        ps.selectAll('span').remove()
        ps.append("span").text(oneWorldCup.host);
        ps = d3.select("#winner");
        ps.selectAll('span').remove()
        ps.append("span").text(oneWorldCup.winner);
        ps = d3.select("#silver");
        ps.selectAll('span').remove()
        ps.append("span").text(oneWorldCup.runner_up);
        let list = d3.select("#teams");
        list.selectAll('li').remove()
        let i=0;
        for(i=0;i<oneWorldCup.teams_names.length;i++) {
            list.append("li").text(oneWorldCup.teams_names[i]);
        }

    }

}