package main

import (
	"net/http"

	"nas-go/handlers"
)

// handler functions are used to respond to http requests.
// templates allow generating dynamic text from data. data passed to template during exec. items enclosed in {{ }} are actions

func main() {
	http.HandleFunc("/", handlers.MainHandler)                // registers handler for root URL
	http.HandleFunc("/api/submit", handlers.ApiSubmitHandler) // Data-only endpoint (API). JavaScript running in the page makes a background request to that API endpoint.
	http.HandleFunc("/api/gotodirectory", handlers.ApiGoToDirHandler)
	//This request goes to /api/submit behind the scenes — no page reload.
	http.Handle("/static/", http.StripPrefix("/static/", http.FileServer(http.Dir("static")))) // This sets up a handler for static files, like JavaScript or CSS
	/*
		/static/ is the URL prefix in the browser.
		http.FileServer(http.Dir("static")) serves files from the ./static/ folder on disk.
		http.StripPrefix("/static/", ...) removes /static/ from the request path before looking for files.
		A browser request to /static/script.js
		Becomes ./static/script.js on disk
	*/

	println("Server started at http://localhost:8080")
	http.ListenAndServe("0.0.0.0:8080", nil) // listen on all interfaces and accept from any IP address.
}
