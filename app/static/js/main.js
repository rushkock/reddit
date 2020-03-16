// This function will load the data in an order
// ONLY when the data is loaded then it will execute a function
// In this function we call the functions to make the D3 visualizations
window.onload = function(){
  background_bubbles()
  make_background()
}

function process_data_experiment(data, subreddit){
  var subreddit = data[0].find(function(element){
    return element.source_subreddit === subreddit;
  });
  return parseFloat(subreddit.norm_toxicity_ratio);
}

function start_animation(subreddit, tracking_click_f){
  var requests = [d3v5.csv("../static/data/source_subreddit_summary.csv")];
  Promise.all(requests).then(function(response) {
     var toxicity = process_data_experiment(response, subreddit);
     var choose_animation_type = ["test_tube", "test_tube", "test_tube","", "round_beaker", ""]
     move_images(toxicity, choose_animation_type[Math.floor(Math.random() * choose_animation_type.length)], tracking_click_f)
     addInputValues(subreddit,toxicity)
     draw_radarChart(subreddit)
  }).catch(function(e) {
      throw(e);
  });
}

function draw_radarChart(subreddit){
  var requests = [d3v5.json("../static/json/radarData.json")];
  Promise.all(requests).then(function(response) {
     var data = process_radar_data(response, subreddit)
     var margin = { top: 50, right: 80, bottom: 50, left: 80 },
       width = Math.min(700, window.innerWidth / 4) - margin.left - margin.right,
       height = Math.min(width, window.innerHeight - margin.top - margin.bottom);


     var radarChartOptions = {
       w: 290,
       h: 350,
       margin: margin,
       levels: 5,
       roundStrokes: true,
       color: d3.scaleOrdinal().range(["#f55f22", "#26AF32"]),
       format: '.0f',
       legend: { title: 'Word usage on Reddit', translateX: 120, translateY: 10 },
       unit: '$'
     };
     // Draw the chart, get a reference the created svg element :
     let svg_radar1 = RadarChart(".radarChart", data, radarChartOptions);

  }).catch(function(e) {
      throw(e);
  });
}

function process_radar_data(data, subreddit){
  data = data[0]
  var sub_index = 0;
  for (let i = 0; i < data.length; i++){
    if (data[i].key === subreddit){
      sub_index = data[i];
    }
  }
  selectedData = [data[0], sub_index]
  if (sub_index === 0){
    selectedData = [data[sub_index]]
  }
  return selectedData
}


function clickRadar() {
  var x = document.getElementById("radarChart");
  var y = document.getElementById("lineChart")
  if (x.style.display === "none") {
    x.style.display = "block";
    y.style.display = "none"
  }
  else {

  }
}

function clickLine() {
  var x = document.getElementById("radarChart");
  var y = document.getElementById("lineChart")
  if (y.style.display === "none") {
    y.style.display = "block";
    x.style.display = "none"
  }
  else {

  }
}
