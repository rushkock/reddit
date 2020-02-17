# Run app locally
In cli type the following line
```
FLASK_APP=application.py flask run
```

This is telling flask to run the file application.py.

# Folder structure
<pre>
├── app                <- This folder contains the flask application     
│   ├── templates      <- This folder contains all the html scripts
│   ├── static         <- Contains css, js, images and data
│   │     ├── css      <- contains all the css scripts
│   │     │             
│   │     ├── data     <- contains data used in this app
│   │     │                
│   │     ├── images   <- contains images used on the website including favicon
│   │     │     
│   │     └── js       <- contains javascript code (D3 code)
│   │     
│   ├─  application.py      <-- application to run the website
│   └── requirements.txt    <- The requirements file for reproducing the analysis
</pre>


## requirements.txt
This file contains the requirements that are needed to run the application.
To download all the requirements:

On linux with python3:
```
pip3 install -r requirements.txt
```

On windows:
```
I don't know feel free to fill it .. maybe same as up there.
```


## application.py
Application.py is the file that runs everything. In this file a flask app is created.
```
app = Flask(__name__)
```

Then you can add multiple routes. It connects a URL rule.
You add a route and then a function that says what should happen when this route is called.
In this function I render a template, which basically means I do a GET request for the html file "home.html".
[render_template function](https://flask.palletsprojects.com/en/1.1.x/api/?highlight=render_template#flask.render_template)

```
@app.route("/")
def home():
    return render_template("home.html")
```
Click [here](https://flask.palletsprojects.com/en/1.1.x/api/?highlight=routes#flask.Flask.add_url_rule) for more explanation.

## templates and static folder
With flask a folder called templates and a folder called static are the default paths.
When you create a flask app you can give it an argument called static_folder:
```
static_folder – the folder with static files that should be served at static_url_path. Defaults to the 'static' folder in the root path of the application.
```
The default: static_folder='static'
It contains static files such as css files.

There is also an argument template_folder which contains the templates that will be rendered.
```
template_folder – the folder that contains the templates that should be used by the application. Defaults to 'templates' folder in the root path of the application.
```
The default: template_folder='templates'

Click [here](https://flask.palletsprojects.com/en/1.1.x/api/?highlight=templates%20directory) for the documentation for this and to learn how to add other folders to the path.

The folders I put in the static folder are css, data, images and js (javascript). These are for usage convenience.

### HTML
In html I use Jinja (see [documentation](https://jinja.palletsprojects.com/en/2.11.x/))
Jinja is a templating language.

layout.html
Contains the "base", things that are used everywhere such as a navbar

Any other html pages extends this base, which means they have to look like following:
<pre>
{% extends "layout.html" %}

{% block title %}
    Title
{% endblock %}

{% block main %}
    Insert html
{% endblock %}

</pre>

Please do not make big changes to layout.html without consultation first as this may negatively influence other html files.
An example, if you are using a css file that is only specific to your html page do not link it in the layout.html because if it contains things like:

```
body {
  background-color: lightblue;
}
```

It will change every other html page.
This also counts for links, and scripts.

# Step by step guide on making a d3 visualization with this application
## Make a js script
In the js folder make a javascript script:
static/js/practice.js

## Make an html and css file
Go to the templates folder and make a new html file.
Per example imagine you made an html page called practice.html
It will be at:
templates/practice.html

In the static folder make a css file, the css file will be:
templates/css/practice.css

In the html file copy paste the code to extend layout.html (its above in this readme)

Insert a title in between the title blocks, in this case the title will be practice.
In the main block insert your code.
First add the links per example the stylesheet. If you want to make a d3 visualization you
<b>have</b> to include the link to the <b>correct</b> version of D3 you are using. The newest version is d3.v5

Link to the js script you made and the main script (see last 2 lines in example)
```
{% extends "layout.html" %}

{% block title %}
    Practice
{% endblock %}

{% block main %}
<!-- stylesheets-->
<link rel="stylesheet" href="../static/css/practice.css">

<!-- D3 links -->
<script src="https://d3js.org/d3.v5.min.js"></script>

<script src="../static/js/main.js"></script>
<script src="../static/js/practice.js"></script>
{% endblock %}
```

## Create a route in application.py
Go to the file application.py and create a route for your HTML

<b>Never</b> use the same name for the routes, per example "@app.route("/")" already exist so you have to change the name
```
@app.route("/practice")
def practice():
    return render_template("practice.html")
```
Make a function which will render your html code

## Updating navbar (optional)
You probably want a way to get to your html page, you can add it in the navbar
Go to templates/layout.html in the <ul> tag add another list item
```
<li class="nav-item"><a class="nav-link" href="/">Practice</a></li>
```

This is optional because you can just type the route behind the link and it should run.
```
http://127.0.0.1:5000/practice
```

## Calling your js code
In the js file make a function

```
function practice(){
  console.log("insert your code here")
}
```

In static/js/main.js call the function you made as follows:
```
window.onload = function()
{
  var requests = [];
  Promise.all(requests).then(function(response) {
     console.log("insert functions calls")
     practice()
  }).catch(function(e) {
      throw(e);
  });
};
```

Basically inside of the promise call your function.
We do this so that we are sure of the order the visualizations will be mode in.

## Write d3
Now inside of the function you made "practice()" insert your d3 code. Obviously you can have multiple functions in your js
script and you can call multiple functions in main but this is a way to get started.

## Reading data to use with d3 (optional)
If you need to read data:
In static/js/main.js insert a request. Per example if you want to read a csv
```
var requests = [d3.csv(name_of_csv.csv)];
```
Then pass the response to the function where you want to use the data.

```
Promise.all(requests).then(function(response) {
   console.log("insert functions calls")
   practice(response)
})
```
Note this may become confusing if the order of requests are changed so pay attention to this!

## Making an svg (optional)
Imagine you want an svg in your d3 (which you will probably want). You can insert a <div> tag with a class in your html page
```
<div class="practice"></div>
```

In the d3 file static/js/practice.js

```
var svg = d3.select('.practice')
            .append('svg')
            .attr("width", width)
            .attr("height", height);
```

## Notes on running the application
If you update javascript code or css do a hard refresh of the html page and your update will automatically be visible.
However, if you update your html code or application.py you need to run flask again. Basically stop the application and run FLASK_APP=application.py flask run again.

This can of course be done easier but its not implemented in the current version. You would need to setup flask in development mode.

# Other notes
In the console you will always have 1 error (until I fix it haha)
```
GET http://127.0.0.1:5000/favicon.ico 404 (NOT FOUND)
```

You can ignore it. It basically means there is no icon for the page.

You will also see a few cookies. These are from linking to js and bootstrap.
