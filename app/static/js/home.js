function move_images(){
  // height and width of svg
  var width = 1000;
  var height = 1000;


  d3.xml('../static/images/beaker.svg')
  .then(data => {
    var beaker = d3.select('.beaker').node().append(data.documentElement)
    var beaker_svg_1 = d3.select('.beaker').select('svg')
    beaker_svg_1
    .attr('width', 200)
    .attr('height', 400)

  })

  d3.xml('../static/images/test_tube.svg')
  .then(data => {
    var test_tube = d3.select('.test_tube').node().append(data.documentElement)
    var test_tube_svg = d3.select('.test_tube').select('svg')
    test_tube_svg
    .attr('width', 200)
    .attr('height', 400)


    var t = d3.transition()

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
                  d3.xml('../static/images/water_drop.svg').then(data => {
                    var water_drop = d3.select('.water_drop').node().append(data.documentElement)
                    var water_drop_svg = d3.select('.water_drop').select('svg')
                    water_drop_svg
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
                      .style("")
                    })
                      d3.select('.beaker').select('svg').selectAll(".beaker_circle_1").transition().delay(1000).duration(4000).style("fill", "#93d422")
                      d3.select('.beaker').select('svg').selectAll(".beaker_circle_2").transition().delay(1000).duration(4000).style("fill", "#628e16")
                      d3.select('.beaker').select('svg').selectAll(".beaker_water").transition().delay(1000).duration(4000).style("fill", "#84b927")

                  })
                })
              })
            })
          })
        })
      })
    })
  })
})



}


function make_circles(){
  // this function creates the idea of dropping water from the beaker
  console.log("called this function")
  var svg = d3.select('.water_drop').select('svg')
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
  .data(d3.range(steps).map(function(num) {
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
      var xScale = d3.scaleLinear()
      .domain([-1.5, 1.5])
      .range([-10, 10]);
      var circle = d3.selectAll(".flyCircle");
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
  }
