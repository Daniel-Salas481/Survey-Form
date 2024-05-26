from flask import Flask, render_template, jsonify
from flask_cors import CORS
from audio_capture import *
from text_to_speech import *
from dictToJson import *

#Use whatever our current namespace is
app = Flask(__name__)
#CORS ensures cross orgin request for front-end and back-end
cors = CORS(app, origins='*')

@app.route('/', methods=['POST', 'GET'])
def index():

    #voiceResponse = audio_capture()
    text_to_speechFeed = text_to_speech()
    return jsonify(
        {
            "feedback": [ text_to_speechFeed ]

        }
    )


    



if __name__ == "__main__":
    app.run(debug=True, port=8080)
