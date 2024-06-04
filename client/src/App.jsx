import React, { useState, useEffect, useRef } from 'react'
import './App.css'
import axios from 'axios';
import {MediaRecorder, register} from 'extendable-media-recorder';
import {connect} from 'extendable-media-recorder-wav-encoder';



function App() {
  const [firstName, setFName] = useState("")
  const [lastName, setLName] = useState("")
  const [age, setAge] = useState("")
  const [feedback, setFeedback] = useState("")
  const [array, setArray] = useState([]);
  const [recording, setRecording] = useState(false);
  const [audioURL, setAudioURL] = useState('');
  const mediaRecorderRef = useRef(null);
  const audioChunksRef = useRef([]); 


  const fetchText = async() => {
    const response = await axios.get("http://localhost:8080/");
    console.log(response.data.response);
    setArray(response.data.feedback);
  }

  const startRecording = async() => {
    const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
    mediaRecorderRef.current = new MediaRecorder(stream);
    mediaRecorderRef.current.ondataavailable = event => {
        audioChunksRef.current.push(event.data);
    };
    mediaRecorderRef.current.onstop = async () => {
        const audioBlob = new Blob(audioChunksRef.current, { type: 'audio/webm' });
        const audioURL = URL.createObjectURL(audioBlob);
        setAudioURL(audioURL);

        // Convert to WAV and send to server
        const wavBlob = await convertWebMToWav(audioBlob);
        sendToServer(wavBlob);
    };
    audioChunksRef.current = [];
    mediaRecorderRef.current.start();
    setRecording(true);
};
  
  const stopRecording = () => {
    mediaRecorderRef.current.stop();
    setRecording(false);
  };


  const convertWebMToWav = async (webmBlob) => {
    const buffer = await webmBlob.arrayBuffer();
    const audioContext = new AudioContext();
    const audioBuffer = await audioContext.decodeAudioData(buffer);

    const wavBlob = audioBufferToWavBlob(audioBuffer);
    return wavBlob;
};


const audioBufferToWavBlob = (audioBuffer) => {
  const numOfChan = audioBuffer.numberOfChannels;
  const length = audioBuffer.length * numOfChan * 2 + 44;
  const buffer = new ArrayBuffer(length);
  const view = new DataView(buffer);

  const channels = [];
  let sample, offset = 0, pos = 0;

  setUint32(0x46464952); // "RIFF"
  setUint32(length - 8); // file length - 8
  setUint32(0x45564157); // "WAVE"

  setUint32(0x20746d66); // "fmt " chunk
  setUint32(16); // length = 16
  setUint16(1); // PCM (uncompressed)
  setUint16(numOfChan);
  setUint32(audioBuffer.sampleRate);
  setUint32(audioBuffer.sampleRate * 2 * numOfChan); // avg. bytes/sec
  setUint16(numOfChan * 2); // block-align
  setUint16(16); // 16-bit (hardcoded in this demo)

  setUint32(0x61746164); // "data" - chunk
  setUint32(length - pos - 4); // chunk length

  for (let i = 0; i < audioBuffer.numberOfChannels; i++)
      channels.push(audioBuffer.getChannelData(i));

  while (pos < length) {
      for (let i = 0; i < numOfChan; i++) {
          sample = Math.max(-1, Math.min(1, channels[i][offset])); // clamp
          sample = (0.5 + sample < 0 ? sample * 32768 : sample * 32767) | 0; // scale to 16-bit signed int
          view.setInt16(pos, sample, true); // write 16-bit sample
          pos += 2;
      }
      offset++; // next source sample
  }

  return new Blob([buffer], { type: 'audio/wav' });

  function setUint16(data) {
      view.setUint16(pos, data, true);
      pos += 2;
  }

  function setUint32(data) {
      view.setUint32(pos, data, true);
      pos += 4;
  }
};


const sendToServer = async(blob) => {
  const url = 'http://localhost:8080/upload';
  const formData = new FormData();
  formData.append('file',blob)
  const config = {
    headers: {
        'content-type': 'multipart/form-data'
    }
  }
  await axios.post(url, formData,config)
};
  

  
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
        /><div>
        <button onClick={recording ? stopRecording : startRecording} type='button' id='main' href=''>Speak</button>
        <button onClick={stopRecording} type='button'>Stop</button>
        {audioURL && <audio src={audioURL} controls />}
        </div>
        </label>
        </div>
    </form>

  
    </>
  )
}

export default App
