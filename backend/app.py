from flask import Flask
from pymongo import MongoClient
import json

app = Flask(__name__, static_url_path='', static_folder="../dist")

@app.route("/")
def index_redir():
    return app.send_static_file("index.html")

app.run(host="0.0.0.0", debug=True)