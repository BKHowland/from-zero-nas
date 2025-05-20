
import { useState, useEffect } from 'react'; // required for useState hook  

function FileList({ currentDir, onDirectoryClick }) {
    // onDirectoryClick: a callback to handle directory clicks.

    const [files, setFiles] = useState([]);

    // This effect runs every time currentDir changes. this means that onDirectoryClick triggers. 
    useEffect(() => {
    fetch(`http://10.0.0.235:8080/reactfilelist?dir=${encodeURIComponent(currentDir)}`) //replace with go server ip/port
        .then(res => res.json())
        .then(data => setFiles(data))
        .catch(err => console.error("Error fetching file list:", err));
    }, [currentDir]);

  return (
    <ul>
      {files.map(file => (
        <li key={file.Path}>
          {file.IsDirectory ? (
            <button onClick={() => onDirectoryClick(file.Path)}>
                {file.Name}
            </button>
          ) : (
            <span> {file.Name} ({file.Size} bytes)</span>
          )}
        </li>
      ))}
    </ul>
  );
}

export default FileList