function move_images(){

var width = 500;
var height = 500;
var svg = d3.select('.cauldron')
            .append('svg')
            .attr("width", width)
            .attr("height", height);

var myimage = svg.append('image')
    .attr('xlink:href', '../static/images/test_tube.jpg')
    .attr('width', 200)
    .attr('height', 200)

console.log(myimage)

}
