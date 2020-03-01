function generatePosition(positions_data){
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


function move_images(){
  // height and width of svg
  var width = 1000;
  var height = 1000;


  d3.xml('../static/images/beaker.svg')
  .then(data => {
    var beaker = d3.select('.beaker').node().append(data.documentElement)
    var beaker_svg_1 = d3.select('.beaker').select('svg')
    beaker_svg_1
    .attr('width', 300)
    .attr('height', 500)
    bubbling()
  })

  d3.xml('../static/images/human.svg')
  .then(data => {
    var human = d3.select('.human').node().append(data.documentElement)
    var human_svg_1 = d3.select('.human').select('svg')
    human_svg_1
    .attr('width', 400)
    .attr('height', 400)

  })

  d3.xml('../static/images/round_beaker.svg')
  .then(data => {
    var round_beaker = d3.select('.round_beaker').node().append(data.documentElement)
    var round_beaker_svg_1 = d3.select('.round_beaker').select('svg')
    round_beaker_svg_1
    .attr('width', 600)
    .attr('height', 600)
  })

  d3.xml('../static/images/test_tube.svg')
  .then(data => {
    var test_tube = d3.select('.test_tube').node().append(data.documentElement)
    var test_tube_svg = d3.select('.test_tube').select('svg')
    test_tube_svg
    .attr('width', 300)
    .attr('height', 500)


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


  function bubbling(){
    // create data
    var data = [];
    for (var i=0; i < 20; i++) {
      data.push(i);
    }

    var tcColours = ['#FDBB30'];
    var randomTcColour = function() {
      return 0
    };

    // Scale for radius
    var xr_1 = d3.scaleLinear().domain([0, 100]).range([0, 40]);

    var positions_data_0 = {
      minx1:120, maxx1:80, miny1:80, maxy1:180,
      minx2:150, maxx2:50, miny2:150, maxy2:250
    }
    var positions_data = generatePosition(positions_data_0)
    // SVG viewport
    var svg = d3.select('.beaker').select("svg");

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

    var update = function(positions, xr) {
      var baseCircle1 = svg.selectAll('circle.circle1');

      var transition_1 = baseCircle1
      .transition()
      .duration(1000)
      .attr('r', xr)
      .attr('cx', positions[0])
      .attr('cy', positions[1])
      .attr('fill', tcColours[randomTcColour()])
      .attr("stroke-width", 2)
      .style('stroke', tcColours[randomTcColour()])
      .end();

      console.log("Hi I am in updte")

      return Promise.race([transition_1]);
    }

    // Scale for radius
    var xr_1 = d3.scaleLinear().domain([0, 100]).range([0, 40]);

    var positions_data_0 = {
      minx1:120, maxx1:80, miny1:80, maxy1:180,
      minx2:150, maxx2:50, miny2:150, maxy2:250
    }
    var positions_0 = generatePosition(positions_data_0)

    var positions_data_1 = {
      minx1:120, maxx1:80, miny1:100, maxy1:200,
      minx2:150, maxx2:50, miny2:100, maxy2:150
    }
    var positions_1 = generatePosition(positions_data_1)


    // Scale for radius
    var xr_2 = d3.scaleLinear().domain([0, 100]).range([0, 20]);

    var positions_data_2 = {
      minx1:120, maxx1:60, miny1:0, maxy1:100,
      minx2:120, maxx2:60, miny2:0, maxy2:150
    }
    var positions_2 = generatePosition(positions_data_2)

    var transitions = update(positions_0, xr_1)
    console.log(transitions)

    transitions.then(function(){
      data = data.concat([1])

      console.log("first then")
      var update_function = update(positions_0, xr_1)
        console.log(update_function)
      transitions_list = []
      for (var j=0; j<10; j++){
        update_function = update_function.then(function(){
        return update(positions_0, xr_1)});
        transitions_list.push(update_function);
      }
      return Promise.all(transitions_list);
    }).catch(function(error){console.log(error);}).then(function(){
      console.log("last then")
    })


    //setInterval(function(){ update(positions_0, xr_1) }, 500);
  }
