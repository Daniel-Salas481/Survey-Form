import { useState, useEffect } from 'react'
import './App.css'
import axios from 'axios';
import {MediaRecorder, register} from 'extendable-media-recorder';
import {connect} from 'extendable-media-recorder-wav-encoder';


let mediaRecorder = null;
let audioBlobs = [];
let capturedStream = null;



function App() {
  const [firstName, setFName] = useState("")
  const [lastName, setLName] = useState("")
  const [age, setAge] = useState("")
  const [feedback, setFeedback] = useState("")
  const [array, setArray] = useState([]); 

  // Register the extendable-media-recorder-wav-encoder
  const connect = async() =>  {
  const connectionResult = await performConnection();
  await register(connectionResult);
  }

  const performConnection = async () => {
  // Simulate an async connection process
    return new Promise((resolve, reject) => {
      setTimeout(() => {
        const connectionResult = 'Connected'; // Example result
        resolve(connectionResult);
      }, 1000); // Simulate a delay
     });
  };

  const fetchText = async() => {
    const response = await axios.get("http://localhost:8080/");
    console.log(response.data.response);
    setArray(response.data.feedback);
  }

  const startRecording = () => {
    return navigator.mediaDevices.getUserMedia({
      audio: {
        echoCancellation: true,
      }
    }).then(stream => {
        audioBlobs = [];
        capturedStream = stream;
  
        // Use the extended MediaRecorder library
        mediaRecorder = new MediaRecorder(stream, {
          mimeType: 'audio/webm'
        });
  
        // Add audio blobs while recording 
        mediaRecorder.addEventListener('dataavailable', event => {
          audioBlobs.push(event.data);
        });
  
        mediaRecorder.start();
    }).catch((e) => {
      console.error(e);
    });
  };
  
  const stopRecording = () => {
    return new Promise(resolve => {
      if (!mediaRecorder) {
        resolve(null);
        return;
      }
  
      mediaRecorder.addEventListener('stop', () => {
        const mimeType = mediaRecorder.mimeType;
        const audioBlob = new Blob(audioBlobs, { type: mimeType });
  
        if (capturedStream) {
          capturedStream.getTracks().forEach(track => track.stop());
        }
  
        resolve(audioBlob);
      });
      
      mediaRecorder.stop();
      
    });
  };

  

  const uploadBlob = async (blob, fileType) => 
  {
  

    const formData = new FormData();
    formData.append('audio', blob, 'file');
    formData.append('type', fileType || 'webm');

    const apiUrl = "http://localhost:8080/upload/audio"


    try {
      const response = await axios.post(apiUrl, formData, {
        headers: {
          'Content-Type': 'multipart/form-data'
        },
        cache: 'no-cache'
      });
  
      return response.data;
    } catch (error) {
      console.error('Error uploading audio:', error);
      throw error;
    }

  };


  const allAtOnce = async () =>
  {
    // Init
    await connect();

    // User clicks record button
    startRecording();

    // User clicks the stop button or a defined timeout
    const webmAudio = await stopRecording();

    // Upload blob to server
    const response = await uploadBlob(webmAudio, 'webm');
  }
  
  useEffect(() =>  {
    fetchText() 
  },[])
  return (
    <>
    <h1>Populous Update Survey</h1>
    <h2>Please fill out the Survey</h2>
    <form>
      <div>
    <label>First Name:
        <input
          type="text" 
          value={firstName}
          onChange={(e) => setFName(e.target.value)}
        />
        </label>

    <label>Last Name:
        <input
          type="text" 
          value={lastName}
          onChange={(e) => setLName(e.target.value)}
        />
        </label>
      </div>

    <label>Age:
        <input
          type="text" 
          value={age}
          onChange={(e) => setAge(e.target.value)}
        />
        </label>
        <div>
        <label>Feedback:
        <input
          type="text" 
          value={array}
          onChange={(e) => setFeedback(e.target.value)}
        />
        <button onClick={allAtOnce} type='button' id='main' href=''>Speak</button>
        <button onClick={stopRecording} type='button'>Stop</button>
        </label>
        </div>
        <button onClick={uploadBlob} type='button'>Submit</button>
    </form>

  
    </>
  )
}

export default App
