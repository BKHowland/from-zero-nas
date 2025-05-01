package handlers

import (
	"html/template"
	"log"
	"net/http"
	"path/filepath"
)

func MainHandler(w http.ResponseWriter, r *http.Request) {
	// r represents the request (GET, headers, form data), while w is used to send data back to the client.

	println("Request URL:", r.URL.Path)               // This was added as a reminder to handle favicon.ico requests later. mainhandler called twice per visit.
	filesfound := ReadFileDir("./storage-directory/") // This creates a slice (Go's version of a dynamic array)

	// tmpl := template.Must(template.ParseFiles(filepath.Join("templates", "index.html")))
	// // Define the function map first for converting relative file path into filename within template.
	// funcMap := template.FuncMap{
	// 	"filename": path.Base, // Registering the path.Base function as "filename"
	// }

	// Create the template with the function map
	// tmpl, err := template.New("index.html").Funcs(funcMap).ParseFiles(filepath.Join("templates", "index.html"))
	tmpl, err := template.New("index.html").ParseFiles(filepath.Join("templates", "index.html"))
	if err != nil {
		log.Println("Error parsing template:", err) // Log the error without terminating the program
		// You can handle the error more gracefully, e.g., return an HTTP error response
		http.Error(w, "Internal Server Error", http.StatusInternalServerError)
		return
	}
	// template.Must panics if an error occurs in parsing. Go reads the index.html file and treats it as a template.
	tmpl.Execute(w, filesfound) // This executes the parsed template, writing the result to the HTTP response (w). files slice passed as data context for {{range}}

	// do we need error handling here?
}
