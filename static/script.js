// Handles sending requests to the Go server.
// <script src="/static/script.js" defer></script>
// This tells the browser: "When you load this page, fetch script.js from the /static/ URL path and run it after the HTML is parsed."

//Log entries can be removed on project completion as they only impact chrome's dev tools console. 

let currentDirectory = "./storage-directory/"; // initial value - store to allow traversing backwards.

function submitFilename() {
    const filename = document.getElementById("filename").value;
    console.log("submitFilename triggered, filename:", filename); // This should log to the browser console
    fetch("/api/submit", {
        method: "POST",
        headers: {
            "Content-Type": "application/json"
        },
        body: JSON.stringify({ filename: filename })
    })
    .then(response => response.json())
    .then(data => {
        document.getElementById("response").textContent = data.details;
    })
    .catch(error => {
        document.getElementById("response").textContent = "Error: " + error;
    });
}


function goToDirectory(directory) {
    // sends get request for files in a particular directory. if none provided, go up a level
    console.log("Clicked to go to directory: ", directory);
    if (directory == "" && currentDirectory == "./storage-directory/"){
        // Asking to go up at top level. Have to refuse. 
        document.getElementById("up-button-response").textContent = "Cannot go up at top level"
        return
    }
    else if (directory == ""){
        // none provided means go up one level
        directory = currentDirectory
        directory = directory.replace(/\/$/, ''); // Remove trailing slash
        let parts = directory.split('/'); // split current path into parts
        parts.pop(); // Remove last segment (current folder)
        directory = parts.join('/') + '/';
    }
    fetch(`/filelist?dir=${directory}`)
        .then(response => response.text())
        .then(html => {
            document.getElementById("file-list").innerHTML = html;
            document.getElementById("up-button-response").textContent = "" // clear error box
            currentDirectory = directory; // update global tracker with new current location
            console.log("Switched to directory: ", currentDirectory);
            document.getElementById("current-directory-display").textContent = currentDirectory // display current directory
            
        })
        .catch(err => {
            console.error("Error updating file list:", err);
        });
}
