
function uploadFiles() {
    // based on files selected, will upload them to the server. Allows regular files or folders.
    // TODO: for folders, make it respect the directory structure instead of unpacking them. maybe server side issue.
    // also, allow providing a directory or using the current directory to tell the server where to put them!
    const files = document.getElementById("fileInput").files;
    const folderFiles = document.getElementById("folderInput").files;

    if (files.length === 0 && folderFiles.length === 0) {
        alert("Please select at least one file or folder.");
        return;
    }

    const xhr = new XMLHttpRequest();
    xhr.open("POST", "/upload", true);

    // Progress event
    xhr.upload.onprogress = function (e) {
        if (e.lengthComputable) {
            const percent = Math.round((e.loaded / e.total) * 100);
            document.getElementById("progressBar").value = percent;
            document.getElementById("statusText").textContent = `Uploading: ${percent}%`;
        }
    };

    // Completion
    xhr.onload = function () {
        if (xhr.status == 200) {
            document.getElementById("statusText").textContent = "Upload complete!";

            // refresh view
            fetch(`/filelist?dir=${window.sharedData.currentDirectory}`)
            .then(response => response.text())
            .then(html => {
                document.getElementById("file-list").innerHTML = html;
                document.getElementById("up-button-response").textContent = "" // clear error box
                console.log("Refreshed directory: ", window.sharedData.currentDirectory);
                document.getElementById("current-directory-display").textContent = window.sharedData.currentDirectory // display current directory
                
            })
            .catch(err => {
                console.error("Error updating file list:", err);
            });

            // clear file selections
            document.getElementById("fileInput").value = "";
            document.getElementById("folderInput").value = "";

        } else {
            document.getElementById("statusText").textContent = `Error: ${xhr.statusText}`;
        }
    };

    // Prepare FormData
    const formData = new FormData();

    // Add regular files
    for (let i = 0; i < files.length; i++) {
        formData.append("files", files[i]); // Multiple files under the same key
    }

    // Add folder files with their relative paths
    for (let i = 0; i < folderFiles.length; i++) {
        const file = folderFiles[i];
        console.log("appending file to formdata with relative path: ", file.webkitRelativePath); // This should log to the browser console
        formData.append("files", file); // Go's fileHeader.Filename strips path from the base name and discards. have to seperately add it.
        formData.append("paths", file.webkitRelativePath); // Preserve folder structure.        
    }
    formData.append("destination", window.sharedData.currentDirectory); // Set the upload destination to currently viewed dir.  

    // Send the files
    xhr.send(formData);

}

