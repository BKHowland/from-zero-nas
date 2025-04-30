package main

import (
	"html/template"
	"log"
	"net/http"
	"os"
	"path/filepath"

	"nas-go/handlers"
)

type FileInfo struct {
	Name        string
	Size        int64
	IsDirectory bool
}

// handler functions are used to respond to http requests.
// templates allow generating dynamic text from data. data passed to template during exec. items enclosed in {{ }} are actions

func readFileDir(dir string) []FileInfo {
	// return a slice fileinfo objects containing files or subdirectories within the provided directory via.
	var filesfound []FileInfo // to store info on files found
	entries, err := os.ReadDir(dir)
	if err != nil {
		// log.Fatal(err)
		log.Printf("Failed to read directory: %v", err)
		return filesfound
	}

	for _, entry := range entries {
		if entry.Name() != ".gitignore" {
			info, err := entry.Info()
			if err != nil {
				log.Printf("Skipping %s due to error: %v", entry.Name(), err)
				continue
			}
			filesfound = append(filesfound, FileInfo{Name: entry.Name(), Size: info.Size(), IsDirectory: entry.IsDir()})
		}
	}

	return filesfound
}

func mainHandler(w http.ResponseWriter, r *http.Request) {
	// r represents the request (GET, headers, form data), while w is used to send data back to the client.

	println("Request URL:", r.URL.Path)              // This was added as a reminder to handle favicon.ico requests later. mainhandler called twice per visit.
	filesfound := readFileDir("./storage-directory") // This creates a slice (Go's version of a dynamic array)

	tmpl := template.Must(template.ParseFiles(filepath.Join("templates", "index.html")))
	// template.Must panics if an error occurs in parsing. Go reads the index.html file and treats it as a template.
	tmpl.Execute(w, filesfound) // This executes the parsed template, writing the result to the HTTP response (w). files slice passed as data context for {{range}}

	// do we need error handling here?
}

func main() {
	http.HandleFunc("/", mainHandler)                         // registers handler for root URL
	http.HandleFunc("/api/submit", handlers.ApiSubmitHandler) // Data-only endpoint (API). JavaScript running in the page makes a background request to that API endpoint.
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
