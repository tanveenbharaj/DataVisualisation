/** Class implementing the tree view. */
class Tree {
    /**
     * Creates a Tree Object
     */
    constructor() {
        
    }

    /**
     * Creates a node/edge structure and renders a tree layout based on the input data
     *
     * @param treeData an array of objects that contain parent/child information.
     */
    createTree(treeData) {

        // ******* TODO: PART VI *******

        var margin = {top: 20, right: 120, bottom: 20, left: 120};

        //Create a tree and give it a size() of 800 by 300. 
        let treemap = d3.tree().size([800, 300]);

        //Create a root for the tree using d3.stratify();

        let data = d3.stratify()
            .id(function(d) {
                let name=d.Team+d.Opponent;
                let id=d.id;
                id=id.substring(name.length,id.length);
                return id;
            })
            .parentId(function(d) { return d.ParentGame; })
            (treeData);

        data.each(function(d) {
            d.name = d.id;
        });

        var nodes = d3.hierarchy(data, function(d) {
            return d.children;
        });

        //Add nodes and links to the tree.
        nodes = treemap(nodes);
        var svg = d3.select("#tree");
         let g = svg.append("g")
                .attr("transform",
                    "translate(" + margin.left + "," + margin.top + ")");

// adds the links between the nodes
        var link = g.selectAll(".link")
            .data( nodes.descendants().slice(1))
            .enter().append("path")

            .attr("class", function(d) {
                return "link link-" + d.data.data.Team + "-" + d.data.data.Opponent+" link-"+d.data.data.Team+
                    " link-"+d.data.parent.data.Team+"-"+d.data.data.Team;
            }
           )
            .attr("d", function(d) {
                return "M" + d.y + "," + d.x
                    + "C" + (d.y + d.parent.y) / 2 + "," + d.x
                    + " " + (d.y + d.parent.y) / 2 + "," + d.parent.x
                    + " " + d.parent.y + "," + d.parent.x;
            });

// adds each node as a group
        var node = g.selectAll(".node")
            .data(nodes.descendants())
            .enter().append("g")
            .attr("class", function(d) {

                return "node" +
                    (d.children ? " node--internal" : " node--leaf"); })
              .attr("transform", function(d) {
                return "translate(" + d.y + "," + d.x + ")"; });

              node.append("circle")
                .attr("r",10)
                .attr("fill", function(d){
                    if(d.data.data.Wins==1){
                        return "#034e7b";
                    }else{
                        return "#cb181d";
                    }
                });


// adds the text to the node
        node.append("text")
            .attr("dy", ".35em")
            .attr("x", function(d) { return d.children ? -13 : 13; })
            .style("text-anchor", function(d) {
                return d.children ? "end" : "start"; })
            .text(function(d) {
                return d.data.data.Team; })
            .attr("class", function(d) {
            return "link-" + d.data.data.Team + " link-" +  d.data.data.Team+"-"+ d.data.data.Opponent;
        });


     };

    /**
     * Updates the highlighting in the tree based on the selected team.
     * Highlights the appropriate team nodes and labels.
     *
     * @param row a string specifying which team was selected in the table.
     */
    updateTree(row) {
        // ******* TODO: PART VII *******
        this.clearTree();


        if(row.value["type"]=="aggregate" && row.value) {
            let data=d3.selectAll("#tree").selectAll("text");
            data.filter(function (d) {
                if(row.key===d.data.data.Team) {
                    return true;
                }
            }).classed("highlight-text", true);

            data=d3.selectAll("#tree").selectAll("path");
            data=data.filter(function (d) {
                if(row.key===d.data.data.Team&&row.key===d.data.parent.data.Team) {
                    return true;
                }
            });
            data.classed("highlight-link", true);
        }else {
            d3.selectAll(".link-" +  row.value.Opponent+"-"+row.key).filter("text").classed("highlight-text", true);
            d3.selectAll(".link-" +  row.key+"-"+row.value.Opponent).filter("text").classed("highlight-text", true);
            d3.selectAll(".link-" +  row.value.Opponent+"-"+row.key).filter("path").classed("highlight-link", true);
            d3.selectAll(".link-" +  row.key+"-"+row.value.Opponent).filter("path").classed("highlight-link", true);
        }

    }

    /**
     * Removes all highlighting from the tree.
     */
    clearTree() {
        // ******* TODO: PART VII *******
        // You only need two lines of code for this! No loops!
        d3.selectAll("text").classed("highlight-text",false);
        d3.selectAll("path").classed("highlight-link",false);
    }
}
