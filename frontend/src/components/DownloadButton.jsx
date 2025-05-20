

function handleDownload(filePath) {
    const downloadUrl = `http://10.0.0.235:8080/download?path=${encodeURIComponent(filePath)}`; //replace with go server ip/port
    // TODO: LATER ITERATIONS MUST GET THIS VALUE FROM A CONFIG FILE TO AVOID MULTIPLE PLACES.
    window.open(downloadUrl, '_blank');
}

function DownloadButton({ filePath }) {
    return (
        <button onClick={() => handleDownload(filePath)} style={{ marginLeft: '10px' }}>Download</button>
    );
}

export default DownloadButton
