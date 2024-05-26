import { useState, useEffect } from 'react'
import './App.css'
import axios from 'axios';

function App() {
  const [firstName, setFName] = useState("")
  const [lastName, setLName] = useState("")
  const [age, setAge] = useState("")
  const [feedback, setFeedback] = useState("")
  const [array, setArray] = useState([]); 

  const fetchText = async() => {
    const response = await axios.get("http://localhost:8080/");
    console.log(response.data.response);
    setArray(response.data.feedback);
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
        <button type='button' id='main' href=''>Speak</button>
        </label>
        </div>
        <button>Submit</button>
    </form>

  
    </>
  )
}

export default App
