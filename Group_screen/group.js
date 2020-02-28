

d3.csv("Test1.csv", function(error, data) {
    console.log(data);
    var updated =
    d3.nest()
        .key(function(d) {return d.source_parent_group;})
        .key(function(d) {return d.source_child_group;
    }).sortKeys(d3.ascending).entries(data);
    console.log(updated);
})

var data = [
 {parent: "", name: "World"},
 {parent: "World", name:"US"},
 {parent: "World", name:"India"},
 {parent: "India", name:"OR" },
 {parent: "India", name:"AP" },
 {parent: "US", name:"CA" },
 {parent: "US", name:"WA" }
];

// manipulate data:

var root = d3.stratify()
  .id(function(d) { return d.name; })
  .parentId(function(d) { return d.parent; })
  (data);

// Now draw the tree:

var width = 700;
var height = 400;

margin = {left: 10, top: 10, right: 10, bottom: 10}

var svg = d3.select("body").append("svg")
      .attr("width", width)
      .attr("height", height);

var g = svg.append("g").attr('transform','translate('+ margin.left +','+ margin.right +')');


var tree = d3.tree()
    .size([height-margin.top-margin.bottom,width-margin.left-margin.right]);

 var link = g.selectAll(".link")
    .data(tree(root).links())
    .enter().append("path")
      .attr("class", "link")
      .attr("d", d3.linkHorizontal()
          .x(function(d) { return d.y; })
          .y(function(d) { return d.x; }));

  var node = g.selectAll(".node")
    .data(root.descendants())
    .enter().append("g")
      .attr("class", function(d) { return "node" + (d.children ? " node--internal" : " node--leaf"); })
      .attr("transform", function(d) { return "translate(" + d.y + "," + d.x + ")"; })

  node.append("circle")
      .attr("r", 2.5);

  node.append("text")
     .text(function(d) { return d.data.name; })
	 .attr('y',-10)
	 .attr('x',-10)
	 .attr('text-anchor','middle');
