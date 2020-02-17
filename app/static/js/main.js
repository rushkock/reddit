// This function will load the data in an order
// ONLY when the data is loaded then it will execute a function
// In this function we call the functions to make the D3 visualizations
window.onload = function()
{
  var requests = [];
  Promise.all(requests).then(function(response) {
     console.log("insert functions calls")
     move_images()
  }).catch(function(e) {
      throw(e);
  });
};
