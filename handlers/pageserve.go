package handlers

import (
	"html/template"
	"net/http"
	"path/filepath"
)

func MainHandler(w http.ResponseWriter, r *http.Request) {
	// r represents the request (GET, headers, form data), while w is used to send data back to the client.

	println("Request URL:", r.URL.Path)              // This was added as a reminder to handle favicon.ico requests later. mainhandler called twice per visit.
	filesfound := ReadFileDir("./storage-directory") // This creates a slice (Go's version of a dynamic array)

	tmpl := template.Must(template.ParseFiles(filepath.Join("templates", "index.html")))
	// template.Must panics if an error occurs in parsing. Go reads the index.html file and treats it as a template.
	tmpl.Execute(w, filesfound) // This executes the parsed template, writing the result to the HTTP response (w). files slice passed as data context for {{range}}

	// do we need error handling here?
}
