// Handles sending requests to the Go server.
// <script src="/static/script.js" defer></script>
// This tells the browser: "When you load this page, fetch script.js from the /static/ URL path and run it after the HTML is parsed."

//Log entries can be removed on project completion as they only impact chrome's dev tools console. 

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


function goToDirectory(name) {
    // example: redirect or load dynamically
    // window.location.href = '/browse/' + encodeURIComponent(name);
    console.log("Clicked to go to directory: ", name);

    fetch("/api/gotodirectory", {
        method: "POST",
        headers: {
            "Content-Type": "application/json"
        },
        body: JSON.stringify({ directory: name })
    })
    .then(response => response.json())
    .then(data => {
        document.getElementById("response").textContent = data.details;
    })
    .catch(error => {
        document.getElementById("response").textContent = "Error: " + error;
    });
}