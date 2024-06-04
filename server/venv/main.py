from flask import Flask, render_template, request, jsonify
from flask_cors import CORS
from flask_socketio import SocketIO,emit
from audio_capture import *
from text_to_speech import *
from dictToJson import *
import os

#Use whatever our current namespace is
app = Flask(__name__)
#CORS ensures cross orgin request for front-end and back-end
CORS(app)
socketio = SocketIO(app,cors_allowed_origins="*")

UPLOAD_FOLDER = 'uploads'
app.config['UPLOAD_FOLDER'] = UPLOAD_FOLDER

@app.route('/', methods=['POST', 'GET'])
def index():

    #voiceResponse = audio_capture()
    text_to_speechFeed = text_to_speech()
    return jsonify(
        {
            "feedback": [ text_to_speechFeed ]

        }
    )


@app.route('/upload', methods=['POST'])
def get_audio():
    if 'file' not in request.files:
        return jsonify({'error': 'No file part'}), 400
    
    file = request.files['file']
    if file.filename == '':
        return jsonify({'error': 'No selected file'}), 400
    
    if file:
        file.save(os.path.join(app.config['UPLOAD_FOLDER'], file.filename))
        return jsonify({'message': 'File successfully uploaded'}), 200



    



if __name__ == "__main__":
    app.run(debug=True, port=8080)
