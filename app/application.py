import sys, os
from flask import Flask, render_template

app = Flask(__name__)


@app.route("/")
def home():
    return render_template("home.html")

@app.route("/practice")
def practice():
    return render_template("practice.html")
