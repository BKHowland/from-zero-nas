
import { useState, useEffect } from 'react'; // required for useState hook  
import DownloadButton from './DownloadButton';
import folderIcon from '../assets/folderIcon.png';
import fileIcon from '../assets/fileIcon.png';

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
      <button className='go-up-button' onClick={handleClick} onMouseUp={(event) => event.currentTarget.blur()}
      >Up One Level</button>
      {/* {showWarning && <p className='up-button-warning' style={{ color: 'red' }}>Cannot go up at top level!</p>} */}
      <p className="up-button-warning" style={{ visibility: showWarning ? 'visible' : 'hidden' }}>Cannot go up at top level!</p>
    </>
  );
}

function RefreshButton({forceRefresh, setShowWarning}) {
  // button to force a file list refresh and also clear warnings.
    const handleClick = () => {
      forceRefresh();
      setShowWarning(false); 
    };

  return(
    <>
      <button className='refresh-button' onClick={handleClick} onMouseUp={(e) => e.currentTarget.blur()}
      >Refresh</button>
    </>
  );
}

function MakeFileSizeReadable(fileSize) {
  // convert byte sizes into more meaningful units. Up to GB.
  let divCount = 0; // div count determines units
  while(fileSize >= 1024){
    fileSize = fileSize / 1024;
    divCount += 1;
  }
  fileSize = parseFloat(fileSize.toFixed(2)).toString();
  // console.log('divcount: ', divCount);
  switch (divCount) {
    case 0:
      return fileSize + " B"
    case 1:
      return fileSize + " KB"
    case 2:
      return fileSize + " MB"
    case 3:
      return fileSize + " GB"
    default:
      return "File Size Error";
  }
}


function FileList({ currentDir, onDirectoryClick, refreshKey, forceRefresh}) {
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
        <div className="directory-buttons">
          <RefreshButton
              forceRefresh={forceRefresh}
              setShowWarning={setShowWarning}
          />
          <GoUpButton
              currentDir={currentDir}
              onDirectoryClick={onDirectoryClick}
              showWarning={showWarning}
              setShowWarning={setShowWarning}
          />
        </div>
        {files != null ?
          (<ul className="file-list-ul">
            {files.map(file => (
                <li className="file-list-li" key={file.Path}>
                {file.IsDirectory ? (
                    <button className="icon-button" onClick={() => handleDirectoryClick(file.Path)}>
                        <img src={folderIcon} alt="folder icon" className="icon-image" />
                        <span title={file.Name} className="icon-text">{file.Name}</span>
                        <span className="icon-filesize">{MakeFileSizeReadable(file.Size)}</span>
                    </button>
                ) : (
                    <button className="icon-fakebutton" onMouseUp={(e) => e.currentTarget.blur()}> 
                        <img src={fileIcon} alt="file icon" className="icon-image" />
                        <span title={file.Name} className="icon-text">{file.Name}</span>
                        {/* <span className="icon-filesize">({file.Size} bytes)</span> */}
                        <span className="icon-filesize">{MakeFileSizeReadable(file.Size)}</span>
                    </button>
                )}
                <DownloadButton filePath={file.Path} />
                </li>
            ))}
          </ul>)
          :
          (<p>This folder is empty.</p>) // alternate condition using ternary operator for empty folders.
        }
    </>
  );
}

export default FileList