document.getElementById("lineChart").style.display = "none";

// Glen - these 2 arrays are like a global variable that we will update with
// each button click

var arrSubreddits = []
var arrToxicities = []

//These variables should come from clicking on the nodes. It is just an example.
//These are just exapmles, the actual value of these variables should come from the clicked subreddit and toxicity values.

//var subreddit='the_don'
//var toxicity=0.7


// Glen - this function call updates the 2 arrays and will later call the D3
// logic to update the graph
function addInputValues(subreddit,toxicity){
      // Selecting the input element and get its value
      //var txtToxicity = document.getElementById("txtToxicity").value;
      //var txtSubreddit = document.getElementById("txtSubreddit").value;
      // Displaying the value
      if (arrSubreddits.length == 5) {
        window.arrSubreddits=[]
        window.arrToxicities=[]
        ;
      }

      arrSubreddits.push(subreddit);
      arrToxicities.push({'y':parseFloat(toxicity)});
      //arrToxicities.push({'y':parseFloat(txtToxicity)});
      console.log(arrSubreddits);
      console.log(arrToxicities);
      //window.alert("inspect the console to see the data, now call the d3 stuff and update the data")

      //console.clear();


      display_d3();
}



//SET up an empty GRAPH

// 2. Use the margin convention practice
var margin = {top: 50, right: 50, bottom: 50, left: 50}
  , width=300, height=300
  //width = window.innerWidth - margin.left - margin.right // Use the window's width
  //, height = window.innerHeight - margin.top - margin.bottom; // Use the window's height

// The number of datapoints
// Glen - need to change this to the number of data points in arrSubreddits
var n = arrToxicities.length;
//var n = 21;


// 5. X scale will use the index of our data
var xScale = d3.scaleLinear()
    .domain([0, 4]) // input
    .range([0, width]); // output

// 6. Y scale will use the randomly generate number
var yScale = d3.scaleLinear()
    .domain([0, 0.5]) // input
    .range([height, 0]); // output




// 8. An array of objects of length N. Each object has key -> value pair, the key being "y" and the value is a random number
// Glen - need to change this to use arrToxicities instead of randomNumbers
var dataset = arrToxicities;
//var dataset = d3.range(n).map(function(d) { return {"y": d3.randomUniform(1)() } })
console.log(dataset)
//console.log(dataset2)

// 1. Add the SVG to the page and employ #2
var svg = d3.select("#lineChart").append("svg")
    .attr("width", width + margin.left + margin.right)
    .attr("height", height + margin.top + margin.bottom)
  .append("g")
    .attr("transform", "translate(" + margin.left + "," + margin.top + ")");

// 3. Call the x axis in a group tag
svg.append("g")
    .attr("class", "axisRed")
    .attr("transform", "translate(0," + height + ")")
    .call(d3.axisBottom(xScale)); // Create an axis component with d3.axisBottom


// 4. Call the y axis in a group tag
svg.append("g")
    .attr("class", "axisRed")
    .call(d3.axisLeft(yScale)); // Create an axis component with d3.axisLeft

/*
svg.append("g")
    .attr("class", "grid")
    .call(d3.axisLeft(yScale)
            .tickSize(-width)
            .tickFormat("")

    );
*/

//svg.append("rect")
//    .attr("width", "80%")
//    .attr("height", "80%")
//    .attr("fill", "white");


//THIS is the function which adds the new dots to the graph

function display_d3(){

//d3.select("svg").remove();
//d3.selectAll("dot.circle").remove();
//d3.selectAll("svg > *").remove();
//svg.selectAll(".dot").remove();

//if (arrSubreddits.length == 1) {
//  d3.selectAll("circle.dot").remove();
  ;
//}



d3.selectAll("path.line").remove();

var last_element = arrSubreddits[arrSubreddits.length-1];

// 7. d3's line generator
var line = d3.line()
    .x(function(d, i) { return xScale(i); }) // set the x values for the line generator
    .y(function(d) { return yScale(d.y); }) // set the y values for the line generator
    .curve(d3.curveMonotoneX) // apply smoothing to the line


// 9. Append the path, bind the data, and call the line generator
svg.append("path")
    .datum(dataset) // 10. Binds data to the line
    .attr("class", "line") // Assign a class for styling
    .attr("d", line); // 11. Calls the line generator


  //.ease("quad") //Try linear, quad, bounce... see other examples here - http://bl.ocks.org/hunzy/9929724
  //.attr("stroke-dashoffset", 0);


// 12. Appends a circle for each datapoint
svg.selectAll(".dot")
    .data(dataset)
  .enter().append("circle") // Uses the enter().append() method
    .attr("class", "dot") // Assign a class for styling
    .attr("cx", function(d, i) { return xScale(i) })
    .attr("cy", function(d) { return yScale(d.y) })
    .attr("r", 5);


//to add labels to the dots a this section had to be added
svg.selectAll(".dodo")
  .data(dataset)
 .enter().append("text")
  .attr("class", "dodo")
  .attr("x", function(d,i) { return xScale(i); })
  .attr("y", function(d) { return yScale(d.y); })
  .attr("dx", ".71em")
  .attr("dy", ".35em")
  .style('fill', 'darkOrange')
  .text(last_element);

}
