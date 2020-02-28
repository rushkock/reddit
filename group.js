

d3.csv("Test1.csv", function(error, data) {
    console.log(data);
    var updated = d3.nest()
        .key(function(d) {return d.source_parent_group;})
        .key(function(d) {return d.source_child_group;
    }).sortKeys(d3.ascending).entries(data);
    console.log(updated);
})
