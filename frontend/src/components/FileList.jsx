
import { useState, useEffect } from 'react'; // required for useState hook  
import DownloadButton from './DownloadButton';
import folderIcon from '../assets/folderIcon.png';

function GoUpButton({ currentDir, onDirectoryClick, showWarning, setShowWarning }) {
    const handleClick = () => {
    if (currentDir == "./storage-directory/"){
        // refuse traversing upwards at top level - otherwise server returns bad request
        setShowWarning(true);
        return;
    }
    setShowWarning(false); // if not top level, clear warning if navigating up
    const parent = currentDir.replace(/\/+$/, '')   // remove trailing slashes
                         .split('/')                //make list of folder names
                         .slice(0, -1)              //remove last folder name
                         .join('/') + "/" || '/';   //join back
                        //replace trailing slash TODO: adjust back end to not expect this. overcomplicated.
    onDirectoryClick(parent);
  };

  return(
    <>
      <button onClick={handleClick}
      style={{ marginLeft: '10px', boxShadow: "2px 2px 2px #9E9E9E" }}
      >Up One Level</button>
      {showWarning && <p style={{ color: 'red' }}>Cannot go up at top level!</p>}
    </>
  );
}


function FileList({ currentDir, onDirectoryClick, refreshKey }) {
  // onDirectoryClick: a callback to handle directory clicks.
  const [files, setFiles] = useState([]);
  const [showWarning, setShowWarning] = useState(false);

  // This effect runs every time currentDir changes. this means that onDirectoryClick triggers. 
  useEffect(() => {
  fetch(`http://10.0.0.235:8080/reactfilelist?dir=${encodeURIComponent(currentDir)}`) //replace with go server ip/port
      .then(res => res.json())
      .then(data => setFiles(data))
      .catch(err => console.error("Error fetching file list:", err));
  }, [currentDir, refreshKey]);

  // New wrapper for onDirectoryClick that clears the warning on directory clicks (going down)
  const handleDirectoryClick = (path) => {
      setShowWarning(false);       // clear warning when navigating down
      onDirectoryClick(path);
  };

  return (
    <>
        <GoUpButton
            currentDir={currentDir}
            onDirectoryClick={onDirectoryClick}
            showWarning={showWarning}
            setShowWarning={setShowWarning}
        />
        {files != null ?
          <ul className="file-list-ul">
            {files.map(file => (
                <li className="file-list-li" key={file.Path}>
                {file.IsDirectory ? (
                    <button className="icon-button" onClick={() => handleDirectoryClick(file.Path)}>
                        <img src={folderIcon} alt="folder icon" className="icon-image" />
                        <span title={file.Name} className="icon-text">{file.Name}</span>
                    </button>
                ) : (
                    <span title={file.Name}> {file.Name} ({file.Size} bytes)</span>
                )}
                <DownloadButton filePath={file.Path} />
                </li>
            ))}
          </ul>
          :
          <p>This folder is empty.</p> // alternate condition using ternary operator for empty folders.
        }
    </>
  );
}

export default FileList