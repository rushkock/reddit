function renderChartCollapsibleNetwork(params) {
  var tracking_click = false;
  // exposed variables
  var attrs = {
    id: 'id' + Math.floor(Math.random() * 1000000),
    svgWidth: 960,
    svgHeight: 600,
    marginTop: 0,
    marginBottom: 5,
    marginRight: 0,
    marginLeft: 30,
    nodeRadius: 18,
    container: 'body',
    distance: 1000,
    hiddenChildLevel: 1,
    //hiddenChildLevel: 5,
    nodeStroke: '#641e16',
    nodeTextColor: '#fffff0',
    linkColor: '#1f618d',
    activeLinkColor: "#39ff14",
    hoverOpacity: 0.2,
    maxTextDisplayZoomLevel: 1,
    textDisplayed: true,
    lineStrokeWidth: 1.5,
    data: null
  };

  var attrKeys = Object.keys(attrs);
  attrKeys.forEach(function (key) {
    if (params && params[key]) {
      attrs[key] = params[key];
    }
  })

  var atomarray = ['../static/images/atoms/atom-icon-filled1.svg', '../static/images/atoms/atom-icon-filled2.svg',
  '../static/images/atoms/atom-icon-filled3.svg', '../static/images/atoms/atom-icon-filled4.svg',
  '../static/images/atoms/atom-icon-filled5.svg', '../static/images/atoms/atom-icon-filled6.svg',
  '../static/images/atoms/atom-icon-filled7.svg', '../static/images/atoms/atom-icon-filled8.svg'];

  //innerFunctions which will update visuals
  var updateData;
  var filter;

  //main chart object
  var main = function (selection) {
    selection.each(function scope() {

      //calculated properties
      var calc = {}
      calc.chartLeftMargin = attrs.marginLeft;
      calc.chartTopMargin = attrs.marginTop;
      calc.chartWidth = attrs.svgWidth - attrs.marginRight - calc.chartLeftMargin;
      calc.chartHeight = attrs.svgHeight - attrs.marginBottom - calc.chartTopMargin;

      //########################## HIERARCHY STUFF  #########################
      var hierarchy = {};
      hierarchy.root = d3.hierarchy(attrs.data.root);


      //###########################   BEHAVIORS #########################
      var behaviors = {};
      behaviors.zoom = d3.zoom().scaleExtent([0.6, 100, 8]).on('zoom', zoomed);
      behaviors.drag = d3.drag().on("start", dragstarted).on("drag", dragged).on("end", dragended);

      //###########################   LAYOUTS #########################
      var layouts = {};

      // custom radial kayout
      layouts.radial = d3.radial();

      //###########################   FORCE STUFF #########################
      var force = {};
      force.link = d3.forceLink().id(d => d.id);
      force.charge = d3.forceManyBody().strength(-700)
      //force.center = d3.forceCenter(calc.chartWidth / 2, calc.chartHeight / 2)
      force.center = d3.forceCenter(320, 500)

      // prevent collide
      force.collide = d3.forceCollide().radius(d => {

        // if parent has many children, reduce collide strength
        if (d.parent) {
          if (d.parent.children.length > 10) {

            // also slow down node movement
            slowDownNodes();
            return 7;
          }
        }

        // increase collide strength
        if (d.children && d.depth > 2) {
          return attrs.nodeRadius;
        }
        return attrs.nodeRadius * 2;
      });

      //manually set x positions (which is calculated using custom radial layout)
      force.x = d3.forceX()
        .strength(0.5)
        .x(function (d, i) {

          // if node does not have children and is channel (depth=2) , then position it on parent's coordinate
          if (!d.children && d.depth > 2) {
            if (d.parent) {
              d = d.parent
            }
          }

          // custom circle projection -  radius will be -  (d.depth - 1) * 150
          return projectCircle(d.proportion, (d.depth - 1) * 150)[0];
        });


      //manually set y positions (which is calculated using d3.cluster)
      force.y = d3.forceY()
        .strength(0.5)
        .y(function (d, i) {

          // if node does not have children and is channel (depth=2) , then position it on parent's coordinate
          if (!d.children && d.depth > 2) {
            if (d.parent) {
              d = d.parent
            }
          }

          // custom circle projection -  radius will be -  (d.depth - 1) * 150
          return projectCircle(d.proportion, (d.depth - 1) * 150)[1];
        })


      //---------------------------------  INITIALISE FORCE SIMULATION ----------------------------

      // get based on top parameter simulation
      force.simulation = d3.forceSimulation()
        .force('link', force.link)
        .force('charge', force.charge)
        .force('center', force.center)
        .force("collide", force.collide)
        .force('x', force.x)
        .force('y', force.y)

      //###########################   HIERARCHY STUFF #########################

      // flatten root
      var arr = flatten(hierarchy.root);


      // hide members based on their depth
      arr.forEach(d => {
        if (d.depth > attrs.hiddenChildLevel) {
          d._children = d.children;
          d.children = null;
        }
      })

      //####################################  DRAWINGS #######################

      //drawing containers
      var container = d3.select(this);

      //add svg
      var svg = container.patternify({ tag: 'svg', selector: 'svg-chart-container' })
        .attr('width', attrs.svgWidth)
        .attr('height', attrs.svgHeight)
        .call(behaviors.zoom)

      //add container g element
      var chart = svg.patternify({ tag: 'g', selector: 'chart' })
        .attr('transform', 'translate(' + (calc.chartLeftMargin) + ',' + calc.chartTopMargin + ')');


      //################################   Chart Content Drawing ##################################

      //link wrapper
      var linksWrapper = chart.patternify({ tag: 'g', selector: 'links-wrapper' })

      //node wrapper
      var nodesWrapper = chart.patternify({ tag: 'g', selector: 'nodes-wrapper' })
      var nodes, links, enteredNodes;

      // reusable function which updates visual based on data change
      update();

      //update visual based on data change
      function update(clickedNode) {

        //  set xy and proportion properties with custom radial layout
        layouts.radial(hierarchy.root);

        //nodes and links array
        var nodesArr = flatten(hierarchy.root, true)
          .orderBy(d => d.depth)
          .filter(d => !d.hidden);

        var linksArr = hierarchy.root.links()
          .filter(d => !d.source.hidden)
          .filter(d => !d.target.hidden)

        // make new nodes to appear near the parents
        nodesArr.forEach(function (d, i) {
          if (clickedNode && clickedNode.id == (d.parent && d.parent.id)) {
            d.x = d.parent.x;
            d.y = d.parent.y;

          }
        });

        //links
        links = linksWrapper.selectAll('.link').data(linksArr, d => d.target.id);
        links.exit().remove();
        links = links.enter()
          .append('line')
          .attr('class', 'link')
          .merge(links).attr('stroke', '#9ecae1');
        links.attr('stroke', attrs.linkColor).attr('stroke-width', attrs.lineStrokeWidth)

        //node groups
        nodes = nodesWrapper.selectAll('.node').data(nodesArr, d => d.id);
        var exited = nodes.exit().remove();
        var enteredNodes = nodes.enter()
          .append('g')
          .attr('class', 'node')

        //bind event handlers
        enteredNodes.on('click', nodeClick)
          .on('mouseenter', nodeMouseEnter)
          .on('mouseleave', nodeMouseLeave)
          .call(behaviors.drag)

        //node texts
        enteredNodes.append('text').attr('class', 'node-texts')
          .attr('x', 30).attr('fill', attrs.nodeTextColor)
          .attr('opacity', 0.1)
          .text(d => d.data.name)
          .style('display', attrs.textDisplayed ? "initial" : "none")
          .style('font-size', 16)
          //Change opacity

          .on('mouseover', function (d, i) {
          d3.select(this).transition()
               .duration('50')
               .attr('opacity', '.85')
             })
             .on('mouseout', function (d, i) {
             d3.select(this).transition()
                  .duration('20')
                  .attr('opacity', '0.1');
                })


        //channels grandchildren
        var channelsGrandchildren = enteredNodes
        .append("image")
        .attr("xlink:href",  function(d) { return d.data.link;})
        .attr("x", -15)
        .attr("y", -15)
        .attr("width", 40)
        .attr("height", 40)

        var makeborder = enteredNodes
          .append("circle")
          .attr("cx", 5.0)
          .attr("cy", 5)
          .attr("r", 20)
          .style("fill", "transparent")
          .style("stroke", "white")
          .style("stroke-width", "1px")


        //merge  node groups and style it
        nodes = enteredNodes.merge(nodes);
        nodes
          .attr('fill', d => {
            return d._children ? "#3182bd" : d.children ? "#c6dbef" : "#fd8d3c";
          })
          .style('cursor', 'pointer')

        //force simulation
        force.simulation.nodes(nodesArr)
          .on('tick', ticked);

        // links simulation
        force.simulation.force("link").links(links).id(d => d.id).distance(100).strength(d => 1);
      }

      //####################################### EVENT HANDLERS  ########################

      // zoom handler
      function zoomed() {

        //get transform event
        var transform = d3.event.transform;
        attrs.lastTransform = transform;

        // apply transform event props to the wrapper
        chart.attr('transform', transform)

        svg.selectAll('.node').attr("transform", function (d) { return `translate(${d.x},${d.y}) scale(${1 / (attrs.lastTransform ? attrs.lastTransform.k : 1)})`; });
        svg.selectAll('.link').attr("stroke-width", attrs.lineStrokeWidth / (attrs.lastTransform ? attrs.lastTransform.k : 1));

        // hide texts if zooming is less than certain level
        if (transform.k < attrs.maxTextDisplayZoomLevel) {
          svg.selectAll('.node-texts').style('display', 'none');
          attrs.textDisplayed = false;
        } else {
          svg.selectAll('.node-texts').style('display', 'initial');
          attrs.textDisplayed = true;
        }
      }


      //tick handler
      function ticked() {

        // set links position
        links.attr("x1", function (d) { return d.source.x; })
          .attr("y1", function (d) { return d.source.y; })
          .attr("x2", function (d) { return d.target.x; })
          .attr("y2", function (d) { return d.target.y; });

        //set nodes position
        svg.selectAll('.node').attr("transform", function (d) { return `translate(${d.x},${d.y}) scale(${1 / (attrs.lastTransform ? attrs.lastTransform.k : 1)})`; });
      }

      //handler drag start event
      function dragstarted(d) {

        //disable node fixing
        nodes.each(d => {
          d.fx = null; d.fy = null })
      }


      // handle dragging event
      function dragged(d) {

        // make dragged node fixed
        d.fx = d3.event.x;
        d.fy = d3.event.y;


      }

      //--------------------Make things glow ---------------------

            //Container for the gradients
      var defs = svg.append("defs");

      //Filter for the outside glow
      var filter = defs.append("filter")
          .attr("id","glow");
      filter.append("feGaussianBlur")
          .attr("stdDeviation","3.5")
          .attr("result","coloredBlur");
      var feMerge = filter.append("feMerge");
      feMerge.append("feMergeNode")
          .attr("in","coloredBlur");
      feMerge.append("feMergeNode")
          .attr("in","SourceGraphic");

      //-------------------- handle drag end event ---------------
      function dragended(d) {
        // we are doing nothing, here , aren't we?
      }

      //-------------------------- node mouse hover handler ---------------
      function nodeMouseEnter(d) {

        //get hovered node
        var node = d3.select(this);

        //get links
        var links = hierarchy.root.links();

        //get hovered node connected links
        var connectedLinks = links.filter(l => l.source.id == d.id || l.target.id == d.id);

        //get hovered node linked nodes
        var linkedNodes = connectedLinks.map(s => s.source.id).concat(connectedLinks.map(d => d.target.id))

        //reduce all other nodes opacity
        nodesWrapper.selectAll('.node')
          .filter(n => linkedNodes.indexOf(n.id) == -1)
          .attr('opacity', attrs.hoverOpacity);

        node.select('text').style("opacity", 1)

        //reduce all other links opacity
        linksWrapper.selectAll('.link').attr('opacity', attrs.hoverOpacity);


        //highlight hovered nodes connections
        linksWrapper.selectAll('.link')
          .filter(l => l.source.id == d.id || l.target.id == d.id)
          .attr('opacity', 1)
          .attr('stroke', attrs.activeLinkColor)

      }

      // --------------- handle mouseleave event ---------------
      function nodeMouseLeave(d) {
        if (!tracking_click){
          // return things back to normal
          nodesWrapper.selectAll('.node').attr('opacity', 1);
          linksWrapper.selectAll('.link').attr('opacity', 1).attr('stroke', attrs.linkColor)

        }
        nodesWrapper.selectAll('text').style("opacity", 0.1)

      }

      function collapse(d) {
        if (d.children) {
          d._children = d.children;
          d._children.forEach(collapse);
          d.children = null;
        }
      }

      // --------------- handle node click event ---------------
      function nodeClick(d) {

                    if (d.children) {
                      d._children = d.children;
                      d.children = null;
                    }
                    else {
                      if (!d._children){
                        $('.radarChart').empty();
                        $('.cauldron').empty();
                        $('.test_tube').empty();
                        $('.beaker').empty();
                        $('.water_drop').empty();
                        $('.round_beaker').empty();
                        $('.human').empty();
                        $('.pole_1').empty();
                        $('.legend').empty();

                        d3v5.select(".stats").style('display', 'none')
                        tracking_click = true
                        //linksWrapper.selectAll('.link').attr('opacity', attrs.hoverOpacity);
                        //


                        // Append glowing border to selected sub

                        d3.select(this)
                        .append("circle")
                        .attr("cx", 5.0)
                        .attr("cy", 5)
                        .attr("r", 20)
                        .style("fill", "transparent")
                        .style("stroke", "#39ff14")
                        .style("stroke-width", "2px")
                        .style("filter", "url(#glow)");

                        // Start animation of second screen

                        start_animation(d.data.name, function(){tracking_click=false
                          d3v5.selectAll('.node').attr('opacity', 1);
                          d3v5.selectAll('.link').attr('opacity', 1).attr('stroke', attrs.linkColor)
                        })

                      }
                      d.children = d._children;
                      d._children = null;
                    }
                    if (d.parent && d.children) { //add here,
                      d.parent.children.forEach(function(element) {
                    if (d !== element) {

                    collapse(element);
                    }});
                  }
                    update(d);
                  }


      //#########################################  UTIL FUNCS ##################################
      updateData = function () {
        main.run();
      }

      function slowDownNodes() {
        force.simulation.alphaTarget(0.05);
      };

      function speedUpNodes() {
        force.simulation.alphaTarget(0.45);
      }

      function freeNodes() {
        d3.selectAll('.node').each(n => { n.fx = null; n.fy = null; })
      }


      function projectCircle(value, radius) {
        var r = radius || 0;
        var corner = value * 2 * Math.PI;
        return [Math.sin(corner) * r, -Math.cos(corner) * r]

      }

      //recursively loop on children and extract nodes as an array
      function flatten(root, clustered) {
        var nodesArray = [];
        var i = 0;
        function recurse(node, depth) {
          if (node.children)
            node.children.forEach(function (child) {
              recurse(child, depth + 1);
            });
          if (!node.id) node.id = ++i;
          else ++i;
          node.depth = depth;
          if (clustered) {
            if (!node.cluster) {
              // if cluster coordinates are not set, set it
              node.cluster = { x: node.x, y: node.y }

            }
          }
          nodesArray.push(node);
        }
        recurse(root, 1);
        return nodesArray;
      }

      function debug() {
        if (attrs.isDebug) {
          //stringify func
          var stringified = scope + "";

          // parse variable names
          var groupVariables = stringified
            //match var x-xx= {};
            .match(/var\s+([\w])+\s*=\s*{\s*}/gi)
            //match xxx
            .map(d => d.match(/\s+\w*/gi).filter(s => s.trim()))
            //get xxx
            .map(v => v[0].trim())

          //assign local variables to the scope
          groupVariables.forEach(v => {
            main['P_' + v] = eval(v)
          })
        }
      }
      debug();
    });
  };

  //----------- PROTOTYEPE FUNCTIONS  ----------------------
  d3.selection.prototype.patternify = function (params) {
    var container = this;
    var selector = params.selector;
    var elementTag = params.tag;
    var data = params.data || [selector];

    // pattern in action
    var selection = container.selectAll('.' + selector).data(data)
    selection.exit().remove();
    selection = selection.enter().append(elementTag).merge(selection)
    selection.attr('class', selector);
    return selection;
  }

  // custom radial layout
  d3.radial = function () {
    return function setProportions(root) {
      recurse(root, 0, 1);
      function recurse(node, min, max) {
        node.proportion = (max + min) / 2;
        if (!node.x) {

          // if node has parent, match entered node positions to it's parent
          if (node.parent) {
            node.x = node.parent.x;
          } else {
            node.x = 0;
          }
        }

        // if node had parent, match entered node positions to it's parent
        if (!node.y) {
          if (node.parent) {
            node.y = node.parent.y;
          } else {
            node.y = 0;
          }
        }

        //recursively do the same for children
        if (node.children) {
          var offset = (max - min) / node.children.length;
          node.children.forEach(function (child, i, arr) {
            var newMin = min + offset * i;
            var newMax = newMin + offset;
            recurse(child, newMin, newMax);
          });
        }
      }
    }
  }

  //https://github.com/bumbeishvili/d3js-boilerplates#orderby
  Array.prototype.orderBy = function (func) {
    this.sort((a, b) => {
      var a = func(a);
      var b = func(b);
      if (typeof a === 'string' || a instanceof String) {
        return a.localeCompare(b);
      }
      return a - b;
    });
    return this;
  }


  //##########################  BOILEPLATE STUFF ################

  //dinamic keys functions
  Object.keys(attrs).forEach(key => {
    // Attach variables to main function
    return main[key] = function (_) {
      var string = `attrs['${key}'] = _`;
      if (!arguments.length) { return eval(` attrs['${key}'];`); }
      eval(string);
      return main;
    };
  });

  //set attrs as property
  main.attrs = attrs;

  //debugging visuals
  main.debug = function (isDebug) {
    attrs.isDebug = isDebug;
    if (isDebug) {
      if (!window.charts) window.charts = [];
      window.charts.push(main);
    }
    return main;
  }

  //exposed update functions
  main.data = function (value) {
    if (!arguments.length) return attrs.data;
    attrs.data = value;
    if (typeof updateData === 'function') {
      updateData();
    }
    return main;
  }


  // run  visual
  main.run = function () {
    d3.selectAll(attrs.container).call(main);
    return main;
  }

  main.filter = function (filterParams) {
    if (!arguments.length) return attrs.filterParams;
    attrs.filterParams = filterParams;
    if (typeof filter === 'function') {
      filter();
    }
    return main;
  }

  return main;
}
