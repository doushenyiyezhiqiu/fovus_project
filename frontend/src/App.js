import React, { useState } from 'react';
import { nanoid } from 'nanoid';
import axios from 'axios';

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
    const id = nanoid();  // Generate unique ID for the entry
    const formData = new FormData();
    formData.append('file', file);
    formData.append('text', inputText);
    formData.append('id', id);

    try {
      await axios.post('https://iyetwt9lzj.execute-api.us-east-1.amazonaws.com/prod/', formData, {
        headers: {
          'Content-Type': 'multipart/form-data'
        }
      });
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


