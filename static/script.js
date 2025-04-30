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
