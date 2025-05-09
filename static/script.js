// Handles sending requests to the Go server.
// <script src="/static/script.js" defer></script>
// This tells the browser: "When you load this page, fetch script.js from the /static/ URL path and run it after the HTML is parsed."

//Log entries can be removed on project completion as they only impact chrome's dev tools console. 

// let currentDirectory = "./storage-directory/"; // initial value - store to allow traversing backwards.
window.sharedData = {
    currentDirectory: "./storage-directory/"
};


function goToDirectory(directory) {
    // sends get request for files in a particular directory. if none provided, go up a level
    // ***NOTE: if not seeing changes, ENSURE CACHING TURNED OFF ON BROWSER! 
    console.log("Clicked to go to directory: ", directory);
    if (directory == "" && window.sharedData.currentDirectory == "./storage-directory/"){
        // Asking to go up at top level. Have to refuse. 
        document.getElementById("up-button-response").textContent = "Cannot go up at top level"
        return
    }
    else if (directory == ""){
        // none provided means go up one level
        directory = window.sharedData.currentDirectory
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
            window.sharedData.currentDirectory = directory; // update global tracker with new current location
            console.log("Switched to directory: ", window.sharedData.currentDirectory);
            document.getElementById("current-directory-display").textContent = window.sharedData.currentDirectory // display current directory
            
        })
        .catch(err => {
            console.error("Error updating file list:", err);
        });
}
