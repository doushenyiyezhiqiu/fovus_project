import React, { useState } from 'react';
import axios from 'axios';
import { nanoid } from 'nanoid';

function App() {
  const [fileData, setFileData] = useState(null);  
  const [inputText, setInputText] = useState('');

  const handleFileChange = (event) => {
    const file = event.target.files[0]; 
    const reader = new FileReader();

    reader.onload = (e) => {
      const base64Content = e.target.result.split(',')[1]; 
      setFileData({
        name: file.name,
        content: base64Content,
        type: file.type
      });
    };

    reader.readAsDataURL(file);
  };

  const handleInputChange = (event) => {
    setInputText(event.target.value);
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    const id = nanoid(); 

    const data = {
      id: id,
      text: inputText,
      file: fileData  
    };
    const url = 'https://f2nnsdvfkj.execute-api.us-east-1.amazonaws.com/prod/';

    // Make the POST request with JSON payload
    axios.post(url, data, {
      headers: {
        'Content-Type': 'application/json'
      }
    })
    .then(response => {
      console.log('Success:', response.data);
      alert('File and text uploaded successfully!');
    })
    .catch(error => {
      console.error('Error uploading file and text:', error);
      alert('Failed to upload!');
    });
  };

  return (
    <div>
      <h1>Upload a File and Text</h1>
      <form onSubmit={handleSubmit}>
        <input type="text" value={inputText} onChange={handleInputChange} placeholder="Enter text" />
        <input type="file" onChange={handleFileChange} />
        <button type="submit">Upload</button>
      </form>
    </div>
  );
}

export default App;
