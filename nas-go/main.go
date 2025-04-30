package main

import (
	"html/template"
	"net/http"
	"path/filepath"

	"nas-go/handlers"
)

type FileInfo struct {
	Name string
	Size int64
}

func mainHandler(w http.ResponseWriter, r *http.Request) {
	files := []FileInfo{
		{"example.txt", 1234},
		{"photo.jpg", 567890},
	}
	tmpl := template.Must(template.ParseFiles(filepath.Join("templates", "index.html")))
	tmpl.Execute(w, files)
}

func main() {
	http.HandleFunc("/", mainHandler)
	http.HandleFunc("/api/submit", handlers.ApiSubmitHandler)
	http.Handle("/static/", http.StripPrefix("/static/", http.FileServer(http.Dir("static"))))

	println("Server started at http://localhost:8080")
	http.ListenAndServe(":8080", nil)
}
