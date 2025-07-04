import DropZone from './DropZone';
import UploadButton from './UploadButton';
import { useState } from 'react';

function FileUploadZone({ currentDir, forceRefresh }) {
  const [progress, setProgress] = useState(0);
  const [uploading, setUploading] = useState(false);

  const handleUpload = ({ files, paths }) => {
    const formData = new FormData();
    console.log('handle upload with paths: ', paths);

    for (let i = 0; i < files.length; i++) {
      formData.append('files', files[i]);
      formData.append('paths', paths[i]);
    }

    formData.append('destination', currentDir);

    const xhr = new XMLHttpRequest();
    xhr.open('POST', 'http://10.0.0.235:8080/upload', true);

    // Track upload progress
    xhr.upload.onprogress = (e) => {
      if (e.lengthComputable) {
        const percent = Math.round((e.loaded / e.total) * 100);
        setProgress(percent);
      }
    };

    xhr.onloadstart = () => {
      setUploading(true);
      setProgress(0);
    };

    xhr.onloadend = () => {
      setUploading(false);
      setProgress(100); // Force 100% on complete
    };

    xhr.onload = () => {
      if (xhr.status === 200) {
        console.log('Upload complete!');
        forceRefresh();
        console.log('after refresh function with dir: ', currentDir);
      } else {
        console.error('Upload failed:', xhr.statusText);
      }
    };

    xhr.send(formData);
  };

  return (
    <>
      <DropZone onUpload={handleUpload} />
      <div className='alt-upload-options'>
        <label>Or, manually select:</label>
        <UploadButton onUpload={handleUpload} isDir={false} />
        <UploadButton onUpload={handleUpload} isDir={true} />
      </div>

      {uploading && (
        <div style={{ marginTop: '10px' }}>
          <progress value={progress} max="100" style={{ width: '100%' }} />
          <p>Uploading: {progress}%</p>
        </div>
      )}
    </>
  );
}

export default FileUploadZone