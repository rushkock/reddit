import sys, os
from flask import Flask, render_template
from flask import Flask, request, render_template, abort, Response
from bokeh.embed import components
import pandas as pd

import numpy as np
from bokeh.plotting import figure, show, output_file
from bokeh.models import ColumnDataSource, LabelSet

app = Flask(__name__)


def radar_graph(subreddit):
    ########### this code can go into the main code and it will work faster
    df = pd.read_csv('static/data/subreddits_norm_toxic.csv')
    df = df.drop(columns='Unnamed: 0')
    df = df.drop_duplicates(subset=['source', 'target'])
    df['positive_rate'] = 1 - df['toxicity']
    ################## but for now do everything in here!

    ####DATA SELECTION####
    a = df[df['source'] == subreddit]
    a = a.sort_values('toxicity')

    # TOP 3 friends
    friend_names = list(a['target'][:3])

    # TOP 3 enemies
    enemies_names = list(a['target'][-3:])

    # TOXICITY
    friend_toxicity = list(a['toxicity'][:3])
    enemies_toxicity = list(a['toxicity'][-3:])

    # POSITIVITY
    friends_positivity = list(a['positive_rate'][:3])
    enemies_positivity = list(a['positive_rate'][-3:])

    #######RADAR_GRAPH creation####

    nothing = [""]

    # number of vertices
    num_vars = 6

    centre = 0.5

    theta = np.linspace(0, 2 * np.pi, num_vars, endpoint=False)
    # rotate theta such that the first axis is at the top
    theta += np.pi / 2

    def unit_poly_verts(theta, centre):
        """Return vertices of polygon for subplot axes.
        This polygon is circumscribed by a unit circle centered at (0.5, 0.5)
        """
        x0, y0, r = [centre] * 3
        verts = [(r * np.cos(t) + x0, r * np.sin(t) + y0) for t in theta]
        return verts

    def radar_patch(r, theta, centre):
        """ Returns the x and y coordinates corresponding to the magnitudes of
        each variable displayed in the radar plot
        """
        # offset from centre of circle
        offset = 0.0
        yt = (r * centre + offset) * np.sin(theta) + centre
        xt = (r * centre + offset) * np.cos(theta) + centre
        return xt, yt

    verts = unit_poly_verts(theta, centre)
    x = [v[0] for v in verts]
    y = [v[1] for v in verts]

    p = figure(title="Top 3 friends and enemies of the subreddit " + subreddit, plot_width=400, plot_height=400)
    text = friend_names + enemies_names + nothing

    source = ColumnDataSource({'x': x + [centre], 'y': y + [1], 'text': text})

    p.line(x="x", y="y", source=source)

    labels = LabelSet(x="x", y="y", text="text", source=source)

    p.add_layout(labels)

    p.title.text_color = "green"
    p.title.text_font_size = "15px"

    # example factor:
    f1 = np.array(friend_toxicity + enemies_toxicity)
    f2 = np.array(friends_positivity + enemies_positivity)

    # xt = np.array(x)
    flist = [f1, f2]

    labels = ['Toxicity', 'Positivity']

    colors = ['red', 'green']

    for i in range(len(flist)):
        xt, yt = radar_patch(flist[i], theta, centre)
        p.patch(x=xt, y=yt, fill_alpha=0.15, fill_color=colors[i], legend_label=labels[i])
    return p

@app.route('/')
def index():
    plot = radar_graph('the_donald')
    script, div = components(plot)
    kwargs = {'script': script, 'div': div}
    kwargs['title'] = 'bokeh-with-flask'
    return render_template('home.html', **kwargs)
