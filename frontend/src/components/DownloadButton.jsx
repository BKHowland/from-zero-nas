

function handleDownload(filePath) {
    const downloadUrl = `http://10.0.0.235:8080/download?path=${encodeURIComponent(filePath)}`; //replace with go server ip/port
    // TODO: LATER ITERATIONS MUST GET THIS VALUE FROM A CONFIG FILE TO AVOID MULTIPLE PLACES.
    // window.open(downloadUrl, '_blank'); //straightforward but opens new window

    // To support background download without a new page opening:
    // create hidden link, automatically click, and remove it
    const link = document.createElement('a');
    link.href = downloadUrl;
    link.download = '';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
}

function DownloadButton({ filePath }) {
    return (
        <button onClick={() => handleDownload(filePath)} style={{ marginLeft: '10px' }}>Download</button>
    );
}

export default DownloadButton
