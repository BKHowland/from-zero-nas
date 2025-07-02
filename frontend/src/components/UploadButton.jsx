
import { useState, useEffect } from 'react'; // required for useState hook  
import { useRef } from 'react';

function handleUpload(uploadUrl) {

}

function UploadButton({ onUpload, isDir }) {
    // manual file selection alternative.
    // return(
    //     <div style={{ marginTop: '10px' }}>
    //         {/* <input type="file" onChange={handleChange} /> */}
    //         <button>
    //         Upload
    //         </button>
    //         {/* {progress > 0 && <p>Progress: {progress}%</p>} */}
    //     </div>
    // );
    const fileInputRef = useRef();
    let btnLabel = "Upload "
    if(isDir){
        btnLabel += "Folders"
    }else{
        btnLabel += "Files"
    }

    const handleManualSelect = (event) => {
        const selectedFiles = event.target.files;
        const filesArray = Array.from(selectedFiles);
        const pathsArray = filesArray.map(f => f.webkitRelativePath || f.name);
        onUpload({ files: filesArray, paths: pathsArray });
    };

    return (
        <>
        <button onClick={() => fileInputRef.current.click()}>
            {btnLabel}
        </button>

        <input
            type="file"
            ref={fileInputRef}
            style={{ display: 'none' }}
            multiple
            {...(isDir ? { webkitdirectory: '' } : {})} // allows folder selection in Chromium. jsx spread to conditionally include param.
            onChange={handleManualSelect}
        />
        </>
    );
}

export default UploadButton
