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

# Other notes
In the console you will always have 1 error (until I fix it haha)
```
GET http://127.0.0.1:5000/favicon.ico 404 (NOT FOUND)
```

You can ignore it. It basically means there is no icon for the page.

You will also see a few cookies. These are from linking to js and bootstrap.
