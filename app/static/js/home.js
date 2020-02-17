function move_images(){
  // height and width of svg
  var width = 1000;
  var height = 1000;
  // make svg
  var svg = d3.select('.cauldron')
  .append('svg')
  .attr("width", width)
  .attr("height", height);

  // insert a test_tube
  var test_tube_1 = svg.append('image')
  .attr('xlink:href', '../static/images/test_tube.jpg')
  .attr('width', 200)
  .attr('height', 200)
  .attr('x', 200)
  .attr('y', 70);

  // move the test tube
  test_tube_1.transition()
  .duration(500)
  .attr('x', 300)
  .transition()
  .duration(4000)
  .attr('transform', 'rotate(50)')
  .transition()
  .on('start', make_circles);



  // insert a beaker
  var beaker = svg.append('image')
  .attr('xlink:href', '../static/images/beaker.jpg')
  .attr('width', 300)
  .attr('height', 300)
  .attr('x', 100)
  .attr('y', 500);

}

function make_circles(){
  // this function creates the idea of dropping water from the beaker
    var svg = d3.select('.cauldron').select('svg')
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
    var steps = 15;
    svg.selectAll(".flyCircle")
        .data(d3.range(steps).map(function(num) {
          return (steps)*(2*Math.PI); }))
        .enter()
        .append("circle")
        .attr("class", "flyCircle")
        .attr("cx", 200)
        .attr("cy", 350)
        .attr("r", 15)
        .style("fill", "#81BC00")
        .call(update);



  	//Continuously moves the circles outward
  	function update() {
      //Create scale
        var xScale = d3.scaleLinear()
          .domain([-1.5, 1.5])
          .range([-10, 12]);
  			var circle = d3.selectAll(".flyCircle");
  			var dur = 1500,
  				del = 500;

  			(function repeat() {
  				circle
  					.transition("outward")
            .duration(dur)
            .delay(function(d,i) { return i*del; })
  						.attr("cy", function(d) { return xScale(d); })
  						.attr("cx", function(d) { return 200; });
  			})();
  	}//update
}
