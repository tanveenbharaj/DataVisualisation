/** Class representing a Tree. */
class Tree {
    /**
     * Creates a Tree Object
     * parentNode, children, parentName,level,position
     * @param {json[]} json - array of json object with name and parent fields
     */
    constructor(json) {
        let i = 0;
        this.list = [];

        //creating node list
        for (i = 0; i < json.length; i++) {
            let node = new Node(json[i].name, json[i].parent);
            this.list.push(node);
        }
    }

    /**
     * Function that builds a tree from a list of nodes with parent refs
     */
    buildTree() {

        //Assign Positions and Levels by making calls to assignPosition() and assignLevel()
        let k = 0;
        let node_list = this.list;

        //initialising parent and child of each node
        for (k = 0; k < node_list.length; k++) {
            let parent = node_list[k];
            if (parent != undefined && parent != null) {
                let j = 0;
                for (j = 0; j < node_list.length; j++) {

                    if (parent.name == node_list[j].parentName) {
                        parent.addChild(node_list[j]);
                        node_list[j].parentNode = parent;
                    }
                }
            }
        }

        this.list = node_list;
        //assign level
        for (k = 0; k < this.list.length; k++) {
            this.assignLevel(this.list[k], k);

        }

  
        //assign position
        this.assignPosition(this.list[0], 0);          
        console.log(this.list);

    }

    /**
     * Recursive function that assign positions to each node
     */
    assignPosition(node, position) {
       if(node.parentNode!=null){
       	  if(position<node.parentNode.position){
       	  	position=node.parentNode.position;
       	  }
       }
       	else{
       	node.position=0;
       } 
       
       let i=1;
       let j=0;
       let same_level_nodes_array=[];
       let k=0;

       //creating array of same levels
       for(i=1;i<this.list.length;i++){
       		if(this.list[i].level==node.level){
       			same_level_nodes_array.push(this.list[i]);
       		}
       }
       
       for(k=0;k<same_level_nodes_array.length;k++){
       		if(same_level_nodes_array[k].position>=position){
       				position=same_level_nodes_array[k].position+1;
       			}
       }

       node.position=position;

       //traversing the tree
        while(node.children.length>j){
       		this.assignPosition(node.children[j],0);
       		j++;
       }

    }

    /**
     * Function that assign levels to each node
     */
    assignLevel(node, level) {
        let parent = node;
        let position = 0;
        if (parent.level == null) {
            parent.level = level;
        } else {
            level = parent.level;
        }
        let j = 0;
        let children = parent.children;
        for (j = 0; j < children.length; j++) {
            if (children[j].level == null) {
                children[j].level = level + 1;
            }
        }
    }

    /**
     * Function that renders the tree
     */
    renderTree() {
        // Select the 'svg' element from the DOM wth d3
        let svg = d3.selectAll("g").data(this.list);

        //append line
        var line = svg.selectAll("line")
            .data(this.list);
        var newData = line.enter().append("line"); //append only to enter selection
        line.exit().remove();
        line = newData.merge(line);

        line.attr("x1", function(d) {
                return d.level * 120;
            })
            .attr("y1", function(d) {
                return d.position * 120;
            })
        line.attr("x2", function(d) {
                if (d.parentNode != null) {
                    return d.parentNode.level * 120;
                }
            })
            .attr("y2", function(d) {
                if (d.parentNode != null) {
                    return d.parentNode.position * 120;
                }
            }).attr("class", "line");

        //append circles
        var circles = svg.selectAll("circle")
            .data(this.list);
        var newData = circles.enter().append("circle"); //append only to enter selection
        circles.exit().remove();
        circles = newData.merge(circles);
        circles.attr("cx", function(d) {
                return d.level * 120;
            })
            .attr("cy", function(d) {
                return d.position * 120;
            })
            .attr("r", function(d) {
                return 32;
            }).attr("class", "circle");

        //append text
        var text = svg.selectAll("g")
            .data(this.list)
            .enter();

        text.append("text")
            .text(function(d) {
                return d.name.toUpperCase();
            }).attr("dx",
                function(d) {
                    return d.level * 120;
                }).attr("dy",
                function(d) {
                    return d.position * 120;
                }).attr("class", "label");

        console.log(circles);

    }

}