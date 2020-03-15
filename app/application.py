import sys, os
from flask import Flask, render_template
from flask import Flask, request, render_template, abort, Response
from bokeh.embed import components
import pandas as pd

import numpy as np
from bokeh.plotting import figure, show, output_file
from bokeh.models import ColumnDataSource, LabelSet


app = Flask(__name__)

@app.route('/')
def index():
    return render_template('home.html')
