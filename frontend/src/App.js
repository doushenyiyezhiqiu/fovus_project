import React, { useState } from 'react';
import axios from 'axios';
import { nanoid } from 'nanoid';

function App() {
  const [file, setFile] = useState(null);
  const [inputText, setInputText] = useState('');

  const handleFileChange = (event) => {
    setFile(event.target.files[0]);
  };

  const handleInputChange = (event) => {
    setInputText(event.target.value);
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    const id = nanoid(); // Generate unique ID for the entry

    // Create an instance of FormData to send the multipart data
    const formData = new FormData();
    formData.append('file', file);
    formData.append('text', inputText);
    formData.append('id', id);

    try {
      const response = await axios.post('https://cors-anywhere.herokuapp.com/https://vtmi8twqzk.execute-api.us-east-1.amazonaws.com/prod/', formData, {
        headers: {
          // This content type is required for multipart/form-data
          'Content-Type': 'multipart/form-data'
        }
      });
      console.log('Success:', response.data);
      alert('File and text uploaded successfully!');
    } catch (error) {
      console.error('Error uploading file and text:', error);
      alert('Failed to upload!');
    }
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
