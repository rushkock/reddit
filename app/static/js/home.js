///////////////////////////////////////////////////////////////////////////////
///////////////////////// POLE MIDDLE OF SCREEN ///////////////////////////////
///////////////////////////////////////////////////////////////////////////////

function draw_pole(){
// select the div pole1
var svg_pole_1 = d3v5.select('.pole_1')
.append('svg')
.attr("width", 1600)
.attr("height", 1000)

// Gradient for the vertical pipes
// Create the svg:defs element and the main gradient definition.
var svgDefs = svg_pole_1.append('defs');
var mainGradient = svgDefs.append('linearGradient')
.attr('id', 'mainGradient');
// Create the stops of the main gradient. Each stop will be assigned
// a class to style the stop using CSS.
mainGradient.append('stop')
.attr('offset', '0%')
.attr('stop-color', 'var(--color-stop)')

mainGradient.append('stop')
.attr('offset', '50%')
.attr('stop-color', 'var(--color-bot)')

mainGradient.append('stop')
.attr('offset', '75%')
.attr('stop-color', 'var(--color-stop)')

// Gradient for the horizontal pipes
// Create the svg:defs element and the main gradient definition.
var mainGradient_horizontal = svgDefs.append('linearGradient')
.attr('id', 'mainGradient_horizontal')
.attr('x1', '0%')
.attr('y1', '0%')
.attr('x2', '0%')
.attr('y2', '100%')
// Create the stops of the main gradient. Each stop will be assigned
// a class to style the stop using CSS.
mainGradient_horizontal.append('stop')
.attr('offset', '0%')
.attr('stop-color', 'var(--color-stop)')

mainGradient_horizontal.append('stop')
.attr('offset', '50%')
.attr('stop-color', 'var(--color-bot)')

mainGradient_horizontal.append('stop')
.attr('offset', '75%')
.attr('stop-color', 'var(--color-stop)')

// Create the rectangles
// pole class is for the vertical gradient
// pole_horizontal is for the horizontal gradients

// long rect vertical middle
svg_pole_1.append("rect")
.attr('width', 40)
.attr('height', 950)
.attr('x', 1100)
.attr('y', 0)
.attr('class', "pole")

// rect  horizontal left
svg_pole_1.append("rect")
.attr('width', 400)
.attr('height', 40)
.attr('x', 700)
.attr('y', 90)
.attr('class', "pole_horizontal")

// left small
svg_pole_1.append('rect')
.attr('width', 25)
.attr('height', 60)
.attr('x',690)
.attr('y', 80)
.attr('class', "pole")
.attr('rx', 5)

// rect  horizontal right
svg_pole_1.append("rect")
.attr('width', 300)
.attr('height', 40)
.attr('x', 1130)
.attr('y', 230)
.attr('class', "pole_horizontal")

// Right small
svg_pole_1.append('rect')
.attr('width', 25)
.attr('height', 60)
.attr('x',1420)
.attr('y', 220)
.attr('class', "pole")
.attr('rx', 5)

// rect  horizontal right
svg_pole_1.append("rect")
.attr('width', 100)
.attr('height', 20)
.attr('x', 1130)
.attr('y', 800)
.attr('class', "pole_horizontal")

// Right small
svg_pole_1.append('rect')
.attr('width', 25)
.attr('height', 60)
.attr('x',1420)
.attr('y', 220)
.attr('class', "pole")
.attr('rx', 5)
}

///////////////////////////////////////////////////////////////////////////////
///////////////// MAIN FUNCTION TO MAKE ANIMATION  ////////////////////////////
///////////////////////////////////////////////////////////////////////////////
var tracking_click = function(){}
function move_images(toxicity, animation, tracking_click_f){
tracking_click = tracking_click_f
// make the background chemicals
make_background()
// draw the poles in the middle of screen
draw_pole()
// bubbles in the background
background_bubbles()

// Read the beaker SVG
d3v5.xml('../static/images/beaker.svg')
.then(data => {
  var beaker = d3v5.select('.beaker').node().append(data.documentElement)
  var beaker_svg_1 = d3v5.select('.beaker').select('svg')
  beaker_svg_1
  .attr('width', 300)
  .attr('height', 500)
})
.catch(function(e){console.log("Cancelled promise")});

// Read the legend SVG
d3v5.xml('../static/images/legend.svg')
.then(data => {
  var legend = d3v5.select('.legend').node().append(data.documentElement)
  var legend_svg = d3v5.select('.legend').select('svg')
  legend_svg
  .attr('width', 200)
  .attr('height', 225)

})
.catch(function(e){console.log("Cancelled promise")});

// Read the human svg and make it invisible
d3v5.xml('../static/images/human.svg')
.then(data => {
  var human = d3v5.select('.human').node().append(data.documentElement)
  var human_svg_1 = d3v5.select('.human').select('svg')
  human_svg_1
  .attr('width', 400)
  .attr('height', 300)
  .select("g")
  .selectAll(".human_path").style("fill-opacity", 0)
  human_svg_1
  .select("g")
  .selectAll(".text_bubble").style("fill-opacity", 0)
})
.catch(function(e){console.log("Cancelled promise")});

// Read the round beakeer svg
d3v5.xml('../static/images/round_beaker.svg')
.then(data => {
  var round_beaker = d3v5.select('.round_beaker').node().append(data.documentElement)
  var round_beaker_svg_1 = d3v5.select('.round_beaker').select('svg')
  round_beaker_svg_1
  .attr('width', 600)
  .attr('height', 600)
})
.catch(function(e){console.log("Cancelled promise")});

// read the test tube svg
d3v5.xml('../static/images/test_tube.svg')
.then(data => {
  var test_tube = d3v5.select('.test_tube').node().append(data.documentElement)
  var test_tube_svg = d3v5.select('.test_tube').select('svg')
  test_tube_svg
  .attr('width', 300)
  .attr('height', 500)
  // This function selects the animation that should be shown
  if (animation === "test_tube"){
    test_tube_transition(toxicity)
  }
  else if (animation === "round_beaker"){
      animate_round_beaker(toxicity)
  }
  else{
    animate_round_beaker_2(toxicity)
  }
}).catch(function(e){console.log("Cancelled promise")});


}

///////////////////////////////////////////////////////////////////////////////
/////////////////////////// HELPER FUNCTIONS //////////////////////////////////
///////////////////////////////////////////////////////////////////////////////


function generatePosition(positions_data){
// This functions generations functions to choose a position between
// maximum and minimum ranges

// Top circles
var randomPositionx1 = function(d) {
  return Math.random() * (positions_data['maxx1'] - positions_data['minx1']) + positions_data['minx1'];
}

// Top circles
var randomPositiony1 = function(d) {
  return Math.random() * (positions_data['maxy1'] - positions_data['miny1']) + positions_data['miny1'];;
}


// Bottom circles
var randomPositionx2 = function(d) {
  return Math.random() * (positions_data['maxx2'] - positions_data['minx2']) + positions_data['minx2'];
}

// Bottom circles
var randomPositiony2 = function(d) {
  return Math.random() * (positions_data['maxy2'] - positions_data['miny2']) + positions_data['miny2'];;
}
return [randomPositionx1, randomPositiony1, randomPositionx2, randomPositiony2]
}

function make_background(){
// This function sets little chemical structures in the background at different
// positions

function place_chemical_svg(path, div_name){
  // this function reads the svg from a given path
  d3v5.xml(path)
  .then(data => {
    // select the background div and append another div in it with a unique class
    d3v5.select('main').select(".background").append("div").attr("class", div_name);

    // select this div and append the svg
    var class_name = "." + div_name;
    d3v5.select(class_name).node().append(data.documentElement);
    var svg = d3v5.select(class_name).select('svg')
    svg.attr("width", 100)
    .attr("height", 100)
    // svg repositioning
    $(class_name).css({top: Math.random() * 1000, left: Math.random() * 2000, position:'absolute'});
  })
  .catch(function(e){console.log("Cancelled promise")});
}
// Place 3 of the chemical from the svg 1
for (i=0;i<3;i++){
  var div_name = "chemical_1" + i;
  place_chemical_svg('../static/images/chemical_1.svg', div_name)
}
// Place 3 of the chemical from the svg 2
for (i=0;i<3;i++){
  var div_name = "chemical_2" + i;
  place_chemical_svg('../static/images/chemical_2.svg', div_name)
}
// Place 3 of the chemical from the svg 3
for (i=0;i<3;i++){
  var div_name = "chemical_3" + i;
  place_chemical_svg('../static/images/chemical_3.svg', div_name)
}

}

///////////////////////////////////////////////////////////////////////////////
///////////////////////// DIFFERENT ANIMATIONS ///////////////////////////////
///////////////////////////////////////////////////////////////////////////////
function colors(toxicity){
  // I have decided to hard code the colors in this way because of the 3 different shades
  // beaker_circle_1 = Top circle
  // beaker_circle_2 = Bottom circle
  // beaker_water = middle water
  if (toxicity < 0.1){
    return {"beaker_circle_1":"#289960", "beaker_circle_2":"#086234", "beaker_water":"#08773f"}
  }
  else if (toxicity >= 0.1 && toxicity < 0.3){
    return {"beaker_circle_1":"#84c969", "beaker_circle_2":"#31ac00", "beaker_water":"#4cb82e"}
  }
  else if (toxicity >= 0.3 && toxicity < 0.5){
    return {"beaker_circle_1":"#c4df79", "beaker_circle_2":"#c4df79", "beaker_water":"#d2ec8a"}
  }
  else if (toxicity >= 0.5 && toxicity < 0.6){
    return {"beaker_circle_1":"#ffea92", "beaker_circle_2":"#f1d14e", "beaker_water":"#ffe065"}
  }
  else if (toxicity >= 0.6 && toxicity < 0.7){
    return {"beaker_circle_1":"#f5cc98", "beaker_circle_2":"#e8a24d", "beaker_water":"#fdbe70"}
  }
  else if (toxicity >= 0.7 && toxicity < 0.9){
    return {"beaker_circle_1":"#ec9169", "beaker_circle_2":"#e86e37", "beaker_water":"#f57f4b"}
  }
  else{
    return {"beaker_circle_1":"#bc3551", "beaker_circle_2":"#84152c", "beaker_water":"#a90426"}
  }
}

function beaker(toxicity){

// This function animates the main beaker
// it changes the color based on toxicity
// A human pops up displaying the toxicity

var color = colors(toxicity);

var transition_2 = d3v5.select('.beaker').select('svg').selectAll(".beaker_circle_1").transition().delay(1000).duration(4000).style("fill", () => color["beaker_circle_1"]);
var transition_3 = d3v5.select('.beaker').select('svg').selectAll(".beaker_circle_2").transition().delay(1000).duration(4000).style("fill", () => color["beaker_circle_2"]);
var transition_4 = d3v5.select('.beaker').select('svg').selectAll(".beaker_water").transition().delay(1000).duration(4000).style("fill", () => color["beaker_water"]);

var transition_5 = d3v5.transition().delay(1000).on("start", bubbling(toxicity))

var human_transition = d3v5.transition()
.delay(5000)

d3v5.select(".human").select("svg").transition(human_transition)
.selectAll(".human_path").style("fill-opacity", 1)
var text_bubble = d3v5.select(".human").select("svg").transition(human_transition).selectAll(".text_bubble")
text_bubble.style("fill-opacity", 1)


d3v5.select(".human").select("svg").append("text")
.transition(human_transition)
.attr("x", 10)
.attr("y", 20)
.attr("dy", ".15em")
.text(function(d) { return "This subreddit "; });

d3v5.select(".human").select("svg").append("text")
.transition(human_transition)
.duration(800)
.attr("x", 5)
.attr("y", 40)
.attr("dy", ".15em")
.text(function(d) { return "has a toxicity of" });

d3v5.select(".human").select("svg").append("text")
.transition(human_transition)
.duration(1000)
.attr("x", 50)
.attr("y", 60)
.attr("dy", ".15em")
.text(function(d) { return toxicity.toFixed(2) * 100 + " %"; });

d3v5.transition()
  .delay(8000)
  .select(".stats").style('display', 'block')
  .end().then(function(){
    tracking_click()

    d3v5.select(".buttonLine")
    .transition()
    .duration(500)
    .style('opacity', 0.3)
    .transition()
    .duration(500)
    .style('opacity', 1)
    .transition()
    .duration(500)
    .style('opacity', 0.3)
    .transition()
    .duration(500)
    .style('opacity', 1)
    .transition()
    .duration(500)
    .style('opacity', 0.3)
    .transition()
    .duration(500)
    .style('opacity', 1)
  })

}

function animate_round_beaker_2(toxicity){
// In this animation the round beaker directly connects to the main beaker
// and it disposes the liquids directly in the beaker

// Draw the pipes which are rects
var svg = d3v5.select('.pole_1').select('svg');
// rect right
svg.append('rect')
.attr('width', 40)
.attr('x',1325)
.attr('y', 270)
.attr('class', 'tube_rect_right pole')
.transition()
.duration(1000)
.attr('height', 180)

// rect left
svg.append('rect')
.attr('height', 40)
.attr('x', 930)
.attr('y', 230)
.attr('rx', 8)
.attr('class', 'tube_rect_left pole_horizontal')
.transition()
.duration(2000)
.attr('width', 200)

// rect left
svg.append('rect')
.attr('width', 40)
.attr('x', 930)
.attr('y', 265)
.attr('class', 'tube_rect_left pole')
.transition()
.duration(2000)
.attr('height', 230)

// rect left
svg.append('rect')
.attr('width', 60)
.attr('x', 920)
.attr('y', 490)
.attr('rx', 5)
.attr('class', 'tube_rect_left pole_horizontal')
.transition()
.delay(1500)
.duration(1000)
.attr('height', 25)
.end().then(function(){
  // On end draw the circles
  function circles_round_beaker(delay){
    // This function ONE circle (qhich represents the liquid)
    // It moves them through the pipes with transitions
    var svg = d3v5.select('.pole_1').select('svg');
    var transitions = svg.append('circle')
    .attr('r', 10)
    .attr('cx', 1340)
    .attr('cy', 460)
    .attr('fill', '#927acb')
    .transition()
    .delay(delay)
    .duration(500)
    .attr('cy', 250)
    .transition()
    .duration(500)
    .attr('cx', 950)
    .transition()
    .duration(500)
    .attr('cy', 750)
    .transition()
    .duration(500)
    .attr('opacity', 0)
    .end();
    return transitions;
  }
  // Each transition has to end before the next promise
  // Therefore, this list keeps track of all the transitions
  var list_round_beaker_transitions = []
  // Draw 10 circles by calling the function circles_round_beaker
  // multiple times
  for (i=0;i<10;i++){
    delay = i * 500
    var transition = circles_round_beaker(delay)
    list_round_beaker_transitions.push(transition)
  }
  // animate the main beaker to change the toxicity
  beaker(toxicity)

  return Promise.all(list_round_beaker_transitions)
}).catch(function(e){console.log("Cancelled promise")}).then(function(){
  // Remove all the pipes that were drawn during the transition
  var transition_1 = d3v5.select('.pole_1').select('svg').selectAll('.tube_rect_left')
  .transition()
  .duration(200)
  .attr('height',0)
  .end()
  var transition_2 = d3v5.select('.pole_1').select('svg').selectAll('.tube_rect_right')
  .transition()
  .duration(200)
  .attr('height',0)
  .end()
  return Promise.all([transition_1, transition_2])
})
}


function animate_round_beaker(toxicity){
// In this animation the round beaker sends the liquid to the test tube
// The test tube then turns and changes the toxicity of the main beaker

// Draw the poles that are needed
var svg = d3v5.select('.pole_1').select('svg');
svg.append('rect')
.attr('width', 40)
.attr('x',1320)
.attr('y', 260)
.attr('class', 'tube_rect_right pole')
.transition()
.duration(1000)
.attr('height', 200)

svg.append('rect')
.attr('width', 40)
.attr('x', 735)
.attr('y', 120)
.attr('class', 'tube_rect_left pole')
.transition()
.duration(2000)
.attr('height', 50)

svg.append('rect')
.attr('height', 20)
.attr('x', 730)
.attr('y', 150)
.attr('class', 'tube_rect_left pole')
.attr('rx', 5)
.transition()
.duration(2000)
.attr('width', 50)
.end().then(function(){
  function circles_round_beaker(delay){

    var svg = d3v5.select('.pole_1').select('svg');
    var transitions = svg.append('circle')
    .attr('r', 10)
    .attr('cx', 1340)
    .attr('cy', 470)
    .attr('fill', '#927acb')
    .transition()
    .delay(delay)
    .duration(500)
    .attr('cy', 245)
    .transition()
    .duration(500)
    .attr('cx', 1120)
    .transition()
    .duration(500)
    .attr('cy', 105)
    .transition()
    .duration(500)
    .attr('cx', 755)
    .transition()
    .duration(500)
    .attr('cy', 330)
    .transition()
    .attr('fill-opacity',0)
    .end()
    return transitions
  }
  var list_round_beaker_transitions = []
  for (i=0;i<10;i++){
    delay = i * 500
    var transition = circles_round_beaker(delay)
    list_round_beaker_transitions.push(transition)
  }
  return Promise.all(list_round_beaker_transitions)
}).catch(function(e){console.log("Cancelled promise")}).then(function(){
  var transition_1 = d3v5.select('.pole_1').select('svg').selectAll('.tube_rect_left')
  .transition()
  .duration(500)
  .attr('height',0)
  .end()
  var transition_2 = d3v5.select('.pole_1').select('svg').selectAll('.tube_rect_right')
  .transition()
  .duration(500)
  .attr('height',0)
  .end()
  return Promise.all([transition_1, transition_2])
}).catch(function(e){console.log("Cancelled promise")}).then(function(){
  test_tube_transition(toxicity)
}).catch(function(e){console.log("Cancelled promise")})
}

function test_tube_transition(toxicity){
// This functions transitions the pink test tube
// It rotates and deposits liquid into the beaker
var test_tube_svg = d3v5.select('.test_tube').select('svg')
test_tube_svg
.attr('width', 300)
.attr('height', 500)

//this transition moves the test tube liquid inside
var t = d3v5.transition()
t.on("start", function() {
  // rotate test tube
  test_tube_svg.transition().duration(8000).attr('transform', 'rotate(100)')
  // show the change in tube water
  test_tube_svg.selectAll(".test_tube1").transition().duration(500).style("fill-opacity", 1)
  // remove the previous water
  test_tube_svg.selectAll(".test_tube0").transition().duration(500).style("fill-opacity", 0).end().then(function(){
    test_tube_svg.selectAll(".test_tube2").transition().duration(600).style("fill-opacity", 1)
    test_tube_svg.selectAll(".test_tube1").transition().duration(1000).style("fill-opacity", 0).end().then(function(){
      t3 = test_tube_svg.selectAll(".test_tube3").transition().duration(600).style("fill-opacity", 1)
      test_tube_svg.selectAll(".test_tube1").transition().duration(1000).style("fill-opacity", 0).end().then(function(){
        t4 = test_tube_svg.selectAll(".test_tube4").transition().duration(600).style("fill-opacity", 1)
        test_tube_svg.selectAll(".test_tube2").transition().duration(1000).style("fill-opacity", 0).end().then(function(){
          t5 = test_tube_svg.selectAll(".test_tube5").transition().duration(600).style("fill-opacity", 1)
          test_tube_svg.selectAll(".test_tube3").transition().duration(1000).style("fill-opacity", 0).end().then(function(){
            t6 = test_tube_svg.selectAll(".test_tube6").transition().duration(600).style("fill-opacity", 1)
            test_tube_svg.selectAll(".test_tube4").transition().duration(1000).style("fill-opacity", 0).end().then(function(){
              t7 = test_tube_svg.selectAll(".test_tube7").transition().duration(600).style("fill-opacity", 1)
              test_tube_svg.selectAll(".test_tube5").transition().duration(1000).style("fill-opacity", 0).end().then(function(){

                // read the water drop svg and make circles so that the water could drip out of it
                d3v5.xml('../static/images/water_drop.svg').then(data => {
                  var water_drop = d3v5.select('.water_drop').node().append(data.documentElement)
                  var water_drop_svg = d3v5.select('.water_drop').select('svg')
                  var transition_1 = water_drop_svg
                  .attr('width', 500)
                  .attr('height', 500)
                  .transition()
                  .on("start", function(){
                    make_circles()
                  })
                  .on("end", function(){
                    water_drop_svg
                    .transition()
                    .delay(3500)
                    .duration(1000)
                    .attr("transform", "translate(0,255)")
                    .select('.water')
                    .transition()
                    .duration(400)
                    .style("fill-opacity", 0)
                  })
                  beaker(toxicity)
                  list_of_transitions = [transition_1]
                  return Promise.all(list_of_transitions)

                }).then(function(){
                  // Set the beaker back to the original position
                  var test_tube_svg = d3v5.select('.test_tube').select('svg')
                  var t = d3v5.transition()
                  .delay(2000)

                  t.on("start", function() {
                    // rotate test tube
                    test_tube_svg.transition().duration(8000).attr('transform', 'rotate(0)')
                  })


                  test_tube_svg.selectAll(".test_tube6").transition(t).duration(600).style("fill-opacity", 1)
                  test_tube_svg.selectAll(".test_tube7").transition().duration(1000).style("fill-opacity", 0).end().then(function(){
                    t3 = test_tube_svg.selectAll(".test_tube5").transition().duration(600).style("fill-opacity", 1)
                    test_tube_svg.selectAll(".test_tube6").transition().duration(1000).style("fill-opacity", 0).end().then(function(){
                      t4 = test_tube_svg.selectAll(".test_tube4").transition().duration(600).style("fill-opacity", 1)
                      test_tube_svg.selectAll(".test_tube5").transition().duration(1000).style("fill-opacity", 0).end().then(function(){
                        t5 = test_tube_svg.selectAll(".test_tube3").transition().duration(600).style("fill-opacity", 1)
                        test_tube_svg.selectAll(".test_tube4").transition().duration(1000).style("fill-opacity", 0).end().then(function(){
                          t6 = test_tube_svg.selectAll(".test_tube2").transition().duration(600).style("fill-opacity", 1)
                          test_tube_svg.selectAll(".test_tube3").transition().duration(1000).style("fill-opacity", 0).end().then(function(){
                            t7 = test_tube_svg.selectAll(".test_tube1").transition().duration(600).style("fill-opacity", 1)
                            test_tube_svg.selectAll(".test_tube2").transition().duration(600).style("fill-opacity", 0).end().then(function(){
                              test_tube_svg.selectAll(".test_tube0").transition().duration(300).style("fill-opacity", 1).end().then(function(){
                                test_tube_svg.selectAll(".test_tube1").transition().duration(300).style("fill-opacity", 0)
                              }).catch(function(e){console.log("Cancelled promise", e)})
                            }).catch(function(e){console.log("Cancelled promise", e)})
                          }).catch(function(e){console.log("Cancelled promise", e)})
                        }).catch(function(e){console.log("Cancelled promise", e)})
                      }).catch(function(e){console.log("Cancelled promise", e)})
                    }).catch(function(e){console.log("Cancelled promise", e)})
                  }).catch(function(e){console.log("Cancelled promise", e)})
                }).catch(function(e){console.log("Cancelled promise", e)})
              }).catch(function(e){console.log("Cancelled promise", e)})
            }).catch(function(e){console.log("Cancelled promise", e)})
          }).catch(function(e){console.log("Cancelled promise", e)})
        }).catch(function(e){console.log("Cancelled promise", e)})
      }).catch(function(e){console.log("Cancelled promise", e)})
    }).catch(function(e){console.log("Cancelled promise", e)})
  }).catch(function(e){console.log("Cancelled promise", e)})
})
}


///////////////////////////////////////////////////////////////////////////////
//////////////////////////////// Bubbles /////////////////////////////////////
///////////////////////////////////////////////////////////////////////////////



function make_circles(){
// this function creates the idea of dropping water from the beaker
var svg = d3v5.select('.water_drop').select('svg')
var defs = svg.append('defs');
var filter = defs.append('filter').attr('id','gooey');
filter.append('feGaussianBlur')
.attr('in','SourceGraphic')
.attr('stdDeviation','10')
.attr('result','blur');
filter.append('feColorMatrix')
.attr('in','blur')
.attr('mode','matrix')
.attr('values','1 0 0 0 0  0 1 0 0 0  0 0 1 0 0  0 0 0 18 -7')
.attr('result','gooey');
filter.append('feComposite')
.attr('in','SourceGraphic')
.attr('in2','gooey')
.attr('operator','atop');


//Create the circles that will move out and in the center circle
var steps = 5;
svg.selectAll(".flyCircle")
.data(d3v5.range(steps).map(function(num) {
  return (steps)*(2*Math.PI); }))
  .enter()
  .append("circle")
  .attr("class", "flyCircle")
  .attr("cx", 65)
  .attr("cy", 30)
  .attr("r", 5)
  .style("fill", "#fe8081")
  .call(update);

  //Continuously moves the circles outward
  function update() {
    //Create scale
    var xScale = d3v5.scaleLinear()
    .domain([-1.5, 1.5])
    .range([-10, 10]);
    var circle = d3v5.selectAll(".flyCircle");
    var dur = 1500,
    del = 500;

    (function repeat() {
      circle
      .transition("outward")
      .duration(dur)
      .delay(function(d,i) { return i*del; })
      .attr("cy", function(d) { return xScale(d); })
      .attr("cx", function(d) { return 65; })
      .transition()
      .duration(600)
      .style("fill-opacity", 0)
    })();
  }//update
};


function bubbling(toxicity){
  // This functions creates the bubbles inside of the beaker
  // create data
  var data = [];
  for (var i=0; i < 20; i++) {
    data.push(i);
  }

  var tcColours = ['#42c1ff'];
  var randomTcColour = function() {
    return 0
  };

  // Scale for radius
  var xr_1 = d3v5.scaleLinear().domain([0, 100]).range([0, 40]);

  var positions_data_0 = {
    minx1:60, maxx1:160, miny1:150, maxy1:250
  }
  var positions_data = generatePosition(positions_data_0)
  // SVG viewport
  var svg = d3v5.select('.beaker').select("svg");

  var baseCircle1 = svg.selectAll("circle.circle1")
  .data(data)
  .enter()
  .append('circle')
  .attr("class", "circle1")
  .attr('r', xr_1)
  .attr('cx', positions_data[0])
  .attr('cy', positions_data[1])
  .attr('fill', tcColours[randomTcColour()])
  .attr("stroke-width", 2)
  .style('stroke', tcColours[randomTcColour()])

  var update = function(positions, xr, opacity, fill) {
    var baseCircle1 = svg.selectAll('circle.circle1');

    var transition_1 = baseCircle1
    .transition()
    .duration(500)
    .attr('r', xr)
    .attr('cx', positions[0])
    .attr('cy', positions[1])
    .attr('fill', fill)
    .attr("stroke-width", 2)
    .style('stroke', fill)
    .style('stroke-opacity', 0.5)
    .style("fill-opacity", opacity)
    .end();

    return Promise.race([transition_1]);
  }

  var color = colors(toxicity);


  // Scale for radius
  var xr_1 = d3v5.scaleLinear().domain([0, 100]).range([0, 40]);

  var positions_data_0 = {
    minx1:60, maxx1:160, miny1:150, maxy1:250
  }
  var positions_0 = generatePosition(positions_data_0)
  var opacity_0 = 0.5
  var fill_0 = "#42c1ff"

  var positions_data_1 = {
    minx1:120, maxx1:80, miny1:100, maxy1:200, opacity:0.3
  }
  var positions_1 = generatePosition(positions_data_1)
  var opacity_1 = 0.1
  var fill_1 = color["beaker_circle_1"]

  // Scale for radius
  var xr_2 = d3v5.scaleLinear().domain([0, 100]).range([0, 20]);

  var positions_data_2 = {
    minx1:100, maxx1:80, miny1:0, maxy1:100
  }
  var positions_2 = generatePosition(positions_data_2)
  var opacity_2 = 0.1
  var fill_2 = color["beaker_water"]

  var transitions = update(positions_0, xr_1, opacity_0, fill_0)

  transitions.then(function(){
    var update_function = update(positions_0, xr_1, opacity_0, fill_0)
    transitions_list = []
    for (var j=0; j<2; j++){
      update_function = update_function.then(function(){
        return update(positions_0, xr_1,  opacity_0, fill_0)});
        transitions_list.push(update_function);
      }
      return Promise.all(transitions_list);
    }).catch(function(error){console.log("Cancelled promise");}).then(function(){
      var update_function = update(positions_1, xr_1,  opacity_1, fill_1)
      transitions_list = []
      for (var j=0; j<2; j++){
        update_function = update_function.then(function(){
          return update(positions_1, xr_1, opacity_1, fill_1)});
          transitions_list.push(update_function);
        }
        return Promise.all(transitions_list);
      }).catch(function(e){console.log("Cancelled promise")}).then(function(){
        var update_function = update(positions_2, xr_2,  opacity_2, fill_2)
        transitions_list = []
        for (var j=0; j<2; j++){
          update_function = update_function.then(function(){
            return update(positions_2, xr_2,  opacity_2, fill_2)});
            transitions_list.push(update_function);
          }
          return Promise.all(transitions_list);
        }).catch(function(e){console.log("Cancelled promise")}).then(function(){
          d3v5.select('.beaker').select("svg").selectAll("circle.circle1").transition().duration(500).style("opacity", 0)
        }).catch(function(e){console.log("Cancelled promise")});
      };

function background_bubbles(){
  // create the bubbles in the background
  // create data
  var data = [];
  var data_1 = []
  for (var i=0; i < 8; i++) {
    data.push(i);
    data_1.push(i);
  }

  // Scale for radius
  var xr = d3v5.scaleLinear().domain([0, 100]).range([0, 150]);
  var color_0 = ['#FDBB30'];
  var positions_data_0 = {
    minx1:800, maxx1:1000, miny1:0, maxy1:500
  }
  var positions_data = generatePosition(positions_data_0)
  // SVG viewport
  var svg = d3v5.select('.background').append('svg').attr("width", 1800)
  .attr("height", 1000);
  function make_circles(positions_data, data, color){

    var baseCircle1 = svg.selectAll("circle.circle1")
    .data(data)
    .enter()
    .append('circle')
    .attr("class", "circle1")
    .attr('cx', positions_data[0])
    .attr('cy', positions_data[1])
    .attr('fill', color)
    .style('stroke', "none")
    .attr('r', xr)
    .style("fill-opacity", 0.5)
    return baseCircle1
  }

  var circles_0_a = make_circles(positions_data, data, color_0);
  transition_2(circles_0_a);

  data = data.concat(data_1);
  var circles_0_b = make_circles(positions_data, data, color_0);
  transition_1(circles_0_b, 'popped_0');

  var color_1 = ['#c2b0ee'];
  var positions_data_1 = {
    minx1:1200, maxx1:1400, miny1:0, maxy1:300
  }
  var positions_data_1 = generatePosition(positions_data_1)
  data = data.concat(data_1)
  var circles_1_a = make_circles(positions_data_1, data, color_1)
  transition_1(circles_1_a, 'popped_1');

  data = data.concat(data_1)
  var circles_1_b = make_circles(positions_data_1, data, color_1)
  //transition_2(circles_1_b);

  var color_2 = ['#d178b7'];
  var positions_data_2 = {
    minx1:600, maxx1:800, miny1:0, maxy1:200
  };
  var positions_data_2 = generatePosition(positions_data_2);
  data = data.concat(data_1);
  var circles_2_a = make_circles(positions_data_2, data, color_2);
  transition_1(circles_2_a, 'popped_2');

  data = data.concat(data_1)
  var circles_2_b = make_circles(positions_data_2, data, color_2)
  //transition_2(circles_2_b);

};

async function transition_1(circles, popped){
  var easing_functions = [d3.easeBounceInOut, d3.easeSinIn,
              d3.easeExpInOut, d3.easeCircleOut];
  circles.classed(popped, false);
  circles.classed(popped, () => Math.random() > 0.5);
  await circles.transition('first')
          .duration(1500)
          .attr('cx', function(){ return this.cx.baseVal.value + (20 + Math.random() * 100)})
          .attr('cy', function(){ return this.cy.baseVal.value - (20 + Math.random() * 100)})
          .ease(easing_functions[Math.floor(Math.random() * easing_functions.length)])
          .transition()
          .duration(1500)
          .attr('cx', function(){ return this.cx.baseVal.value - (20 + Math.random() * 100)})
          .attr('cy', function(){ return this.cy.baseVal.value - (20+ Math.random() * 100)})
          .ease(easing_functions[Math.floor(Math.random() * easing_functions.length)])
          .transition()
          .duration(1500)
          .attr('cx', function(){ return this.cx.baseVal.value - (20 + Math.random() * 100)})
          .attr('cy', function(){ return this.cy.baseVal.value - (20 + Math.random() * 80)})
          .ease(easing_functions[Math.floor(Math.random() * easing_functions.length)])
          .end();

  try {
      var class_name = "." + popped
      await  d3v5.selectAll(class_name)
              .transition()
              .delay(2000)
              .duration(1000)
              .attr('r', function(){ return this.r.baseVal.value * (1 + Math.random())})
              .transition()
              .duration(500)
              .attr('r', 0)
              .transition()
              .duration(1000)
              .attr('cy', function(){ return this.cy.baseVal.value + (Math.random() * 150)})
              .attr('r', function(){ return (Math.random() * 10)})
              .end();

     transition_1(circles, popped);
  } catch(e) {
   // catches errors both in fetch and response.json
   console.log("Cancelled promise")
  }
};

function transition_2(circles){
  var easing_functions = [d3.easeBounceInOut, d3.easeSinIn,
              d3.easeExpInOut, d3.easeCircleOut];

  circles.transition()
          .duration(15000)
          .attr('cy', function(){ return this.cy.baseVal.value - (30 + Math.random() * 30)})
          .ease(easing_functions[Math.floor(Math.random() * easing_functions.length)])
          .transition(15000)
          .attr('cy', function(){ return this.cy.baseVal.value - (30 +Math.random() * 30)})
          .ease(easing_functions[Math.floor(Math.random() * easing_functions.length)])
          .transition(15000)
          .attr('cx', function(){ return this.cx.baseVal.value - (30 + Math.random() * 80)})
          .attr('cy', function(){ return this.cy.baseVal.value - (30 + Math.random() * 80)})
          .ease(easing_functions[Math.floor(Math.random() * easing_functions.length)])

};
