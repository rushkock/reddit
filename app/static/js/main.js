// This function will load the data in an order
// ONLY when the data is loaded then it will execute a function
// In this function we call the functions to make the D3 visualizations
window.onload = function()
{
  var requests = [d3v5.csv("../static/data/subreddits_norm_toxic.csv")];
  Promise.all(requests).then(function(response) {
     var toxicity = process_data_experiment(response);
     move_images(toxicity)
  }).catch(function(e) {
      throw(e);
  });
};


function process_data_experiment(data){
  var subreddit = data[0].find(function(element){
    return element.source === "bestof" && element.target === "advice";
  });
  return parseFloat(subreddit.norm_toxicity);
}
