import axios from 'axios';
import { CloudinaryContext, Video } from 'cloudinary-react';
import React, { useState } from 'react';

function App() {
  const [file, setFile] = useState(null);
  const [fileData, setFileData] = useState({ fileUrl: '', publicId: '' });

  const handleFileChange = (event) => {
    setFile(event.target.files[0]);
  };

  const handleUpload = async () => {
    const formData = new FormData();
    formData.append('file', file);

    try {
      const response = await axios.post('http://localhost:3001/upload', formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      });
      setFileData({ fileUrl: response.data.fileUrl, publicId: response.data.publicId });
      console.log(response.data);
    } catch (error) {
      console.error('Error uploading file:', error);
    }
  };

  return (
    <div className="App">
      <h1>Upload File to Cloudinary</h1>
      <input type="file" onChange={handleFileChange} />
      <button onClick={handleUpload}>Upload</button>

      <div style={{marginTop: 20 + 'px'}}>
      {fileData.fileUrl &&  <span>File Url: <a href={fileData.fileUrl} target='_blank' rel="noreferrer"> {fileData.fileUrl}</a></span>}
      </div>

      {fileData.fileUrl && (
        <div>
          <h2>Uploaded File:</h2>
          {file && file.type.startsWith('image') ? (
            <img src={fileData.fileUrl} alt="Uploaded file" style={{ width: '300px' }} />
          ) : (
            <CloudinaryContext cloudName={process.env.REACT_APP_CLOUD_NAME}>
              <Video publicId={fileData.publicId} controls width="300px" />
            </CloudinaryContext>
          )}
        </div>
      )}
    </div>
  );
}

export default App;
