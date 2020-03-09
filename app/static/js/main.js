// This function will load the data in an order
// ONLY when the data is loaded then it will execute a function
// In this function we call the functions to make the D3 visualizations

function process_data_experiment(data, subreddit){
  var subreddit = data[0].find(function(element){
    return element.source_subreddit === subreddit;
  });
  return parseFloat(subreddit.norm_toxicity_ratio);
}

function start_animation(subreddit){
  var requests = [d3v5.csv("../static/data/source_subreddit_summary.csv")];
  Promise.all(requests).then(function(response) {
     var toxicity = process_data_experiment(response, subreddit);
     move_images(toxicity, "")
  }).catch(function(e) {
      throw(e);
  });
}
