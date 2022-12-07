from flask import Flask
import pymongo
import json
import ssl
from dotenv import load_dotenv
import os

# moved mongo URI into env file
load_dotenv()
# flag for switching mongo connection for testing
mongo_debug = True

if (mongo_debug):
    mongo_client = pymongo.MongoClient("mongodb://localhost:27017/")
else:
    uri = os.getenv("MONGO_URI")
    pem_path = os.getenv("PEM_PATH")
    try:
        mongo_client = pymongo.MongoClient(uri,
                        tls=True,
                        tlsCertificateKeyFile=pem_path)
    except Exception as e:
        print(e)
        exit()


app = Flask(__name__, static_url_path='', static_folder="../dist")

@app.route("/")
def serve_root():
    return app.send_static_file("index.html")

@app.route("/<path>")
def serve_static_index(path):
    return app.send_static_file("index.html")


app.run(host="0.0.0.0", debug=False)