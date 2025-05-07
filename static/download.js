

function downloadFiles(fullPath) {
    // sends a request to the server to download the requested file or folder. 
    // Using more simple method which relies on browser to send get request and react to the response
    // by opening the native download prompt assuming correct server reply.
    console.log("User download request for file: ", fullPath);
    window.location.href = `/download?path=${encodeURIComponent(fullPath)}`; // Let browser handle sending GET request.
}

