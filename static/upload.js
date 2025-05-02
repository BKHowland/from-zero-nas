// function uploadFile() {
//     const file = document.getElementById("fileInput").files[0];
//     if (!file) return;

//     const chunkSize = 1024 * 1024; // 1MB
//     const totalChunks = Math.ceil(file.size / chunkSize);

//     let currentChunk = 0;
//     const status = document.getElementById("status");

//     function uploadNext() {
//         const start = currentChunk * chunkSize;
//         const end = Math.min(file.size, start + chunkSize);
//         const chunk = file.slice(start, end);

//         const formData = new FormData();
//         formData.append("filename", file.name);
//         formData.append("chunkIndex", currentChunk);
//         formData.append("totalChunks", totalChunks);
//         formData.append("chunk", chunk);

//         fetch("/upload", {
//             method: "POST",
//             body: formData
//         }).then(() => {
//             currentChunk++;
//             if (currentChunk < totalChunks) {
//                 uploadNext();
//                 status.textContent = `Uploading chunk ${currentChunk}/${totalChunks}`;
//             } else {
//                 status.textContent = "Upload complete!";
//             }
//         }).catch(err => {
//             status.textContent = "Upload failed: " + err;
//         });
//     }

//     uploadNext();
// }



function uploadFiles() {
    const files = document.getElementById("fileInput").files;
    if (!files.length) {
        alert("Please select at least one file.");
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
        } else {
            document.getElementById("statusText").textContent = `Error: ${xhr.statusText}`;
        }
    };

    // Send file
    const formData = new FormData();
    for (let i = 0; i < files.length; i++) {
        formData.append("files", files[i]); // Multiple files under the same key
    }
    xhr.send(formData);
}