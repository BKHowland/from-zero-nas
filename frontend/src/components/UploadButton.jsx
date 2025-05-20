
import { useState, useEffect } from 'react'; // required for useState hook  

function handleUpload(uploadUrl) {

}

function UploadButton({ uploadUrl }) {
    // manual file selection alternative.
    return(
        <div style={{ marginTop: '10px' }}>
            {/* <input type="file" onChange={handleChange} /> */}
            <button>
            Upload
            </button>
            {/* {progress > 0 && <p>Progress: {progress}%</p>} */}
        </div>
    );
}

export default UploadButton
