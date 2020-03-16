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
        
        //svg.selectAll("*").remove();
        //d3.selectAll("circle").remove();
        //d3.select("#lineChart").remove();
        //d3.select("svg").remove();
        //d3.select(".graph").selectAll("*").remove();
      }  
      
      if (arrSubreddits.includes(subreddit) == false ) {
        
          arrSubreddits.push(subreddit);
          arrToxicities.push({'y':parseFloat(toxicity)});
          //arrToxicities.push({'y':parseFloat(txtToxicity)});
          console.log(arrSubreddits);
          console.log(arrToxicities);
          //window.alert("inspect the console to see the data, now call the d3 stuff and update the data")
    
          
          

          
        
      }
      
      display_d3();

      
}




//SET up an empty GRAPH

// 2. Use the margin convention practice
var margin = {top: 50, right: 150, bottom: 150, left: 60}
  , width=300, height=300
  //width = window.innerWidth - margin.left - margin.right // Use the window's width
  //, height = window.innerHeight - margin.top - margin.bottom; // Use the window's height

// The number of datapoints
// Glen - need to change this to the number of data points in arrSubreddits
var n = arrToxicities.length;
//var n = 21;


// 5. X scale will use the index of our data
var xScale = d3.scaleLinear()
    .domain([0,6]) // input
    .range([0, width]); // output
/*
var ordinalScale = d3.scaleOrdinal()
    .domain(arrSubreddits)
    //.range(['black', '#ccc', '#ccc']);
 */ 

// 6. Y scale will use the randomly generate number
var yScale = d3.scaleLinear()
    .domain([0, 0.5]) // input
    .range([height, 0]); // output




// 8. An array of objects of length N. Each object has key -> value pair, the key being "y" and the value is a random number
// Glen - need to change this to use arrToxicities instead of randomNumbers

//var dataset = arrToxicities;
//var dataset = d3.range(n).map(function(d) { return {"y": d3.randomUniform(1)() } })
//console.log(dataset)
//console.log(dataset2)

// 1. Add the SVG to the page and employ #2
var svg = d3.select("#lineChart").append("svg")
    .attr("width", width + margin.left + margin.right)
    .attr("height", height + margin.top + margin.bottom)
  .append("g")
    .attr("transform", "translate(" + margin.left + "," + margin.top + ")");




//THIS is the function which adds the new dots to the graph

function display_d3(){

//d3.select("svg").remove();
//d3.selectAll("dot.circle").remove();
//d3.selectAll("svg > *").remove();
//svg.selectAll(".dot").remove();

//if (arrSubreddits.length == 1) {
//  d3.selectAll("circle.dot").remove();
  
//}

//var last_element = arrSubreddits[arrSubreddits.length-1];

var dataset = arrToxicities;

svg.selectAll("*").remove();

if (arrSubreddits[1] == null) {
  var sub2={subreddit: '2nd sub'}
}
else {
  var sub2={subreddit: arrSubreddits[1]}
}

if (arrSubreddits[2] == null) {
  var sub3={subreddit: '3rd sub'}
}
else {
  var sub3={subreddit: arrSubreddits[2]}
}


if (arrSubreddits[3] == null) {
  var sub4={subreddit: '4th sub'}
}
else {
  var sub4={subreddit: arrSubreddits[3]}
}

if (arrSubreddits[4] == null) {
  var sub5={subreddit: '5th sub'}
}
else {
  var sub5={subreddit: arrSubreddits[4]}
}


axis_data = [{subreddit: arrSubreddits[0]},sub2,sub3,sub4,sub5]
var x = d3.scaleBand().rangeRound([0, width]).padding(1)
x.domain(axis_data.map(function(d) { return d.subreddit; }));
var xAxis = d3v5.axisBottom(x);



svg.append("g")
    .attr("class", "axisRed")
    .attr("transform", "translate(0," + height + ")")
    .call(xAxis)
    .selectAll("text")	
        .style("text-anchor", "end")
        .attr("dx", "-.8em")
        .attr("dy", ".15em")
        .attr("transform", "rotate(-40)")
        .style('fill', '#white')
        .attr("font-size","15px")
        //.style('fill', '#ffab00')
        ;
        // Create an axis component with d3.axisBottom

/*
// 3. Call the x axis in a group tag
svg.append("g")
    .attr("class", "axisRed")
    .attr("transform", "translate(0," + height + ")")
    //.data(arrSubreddits)
    .call(d3.axisBottom(xScale)
    .tickValues(['0','1','2','3','4'])
    //.tickValues(xScale.domain())
    .tickFormat(()=>{return ['aa','bb','cc','dd','ee']})
    //.tickFormat(function(d,i) { return arrSubreddits(i) })
    )
    //.tickValues(arrSubreddits.length); // Create an axis component with d3.axisBottom
    ;
  // Create an axis component with d3.axisBottom

*/



// 4. Call the y axis in a group tag
svg.append("g")
    .attr("class", "axisRed")
    .call(d3.axisLeft(yScale))
    .selectAll("text")
        .style('fill', '#white')
        .attr("font-size","15px")
    
    ; // Create an axis component with d3.axisLeft

    
d3.selectAll("path.line").remove();


//var last_element = arrSubreddits[arrSubreddits.length-1];

// 7. d3's line generator
var line = d3.line()
    .x(function(d, i) { return xScale(i)+48; }) // set the x values for the line generator
    .y(function(d) { return yScale(d.y); }) // set the y values for the line generator
    .curve(d3.curveMonotoneX) // apply smoothing to the line


// 9. Append the path, bind the data, and call the line generator
svg.append("path")
    .datum(dataset) // 10. Binds data to the line
    .attr("class", "line")// Assign a class for styling
  // .transition()
  //.duration(10000)
    .attr("d", line)
    ; // 11. Calls the line generator



  //.ease("quad") //Try linear, quad, bounce... see other examples here - http://bl.ocks.org/hunzy/9929724
  //.attr("stroke-dashoffset", 0);


// 12. Appends a circle for each datapoint
svg.selectAll(".dot")
    .data(dataset)
  .enter().append("circle") // Uses the enter().append() method
    .attr("class", "dot") // Assign a class for styling
    .attr("cx", function(d, i) { return xScale(i)+48 })
    .attr("cy", function(d) { return yScale(d.y) })
    .attr("r", 5);

/*
//to add labels to the dots a this section had to be added
svg.selectAll(".dodo")
  .data(dataset)
 .enter().append("text")
  .attr("class", "dodo")
  .attr("x", function(d,i) { return xScale(i); })
  .attr("y", function(d) { return yScale(d.y); })
  .attr("dx", ".71em")
  .attr("dy", ".35em")
  .style('fill', '#ff6600')
  .text(last_element)
  ;
*/

  
}
