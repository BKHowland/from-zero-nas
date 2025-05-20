package handlers

import (
	"encoding/json"
	"html/template"
	"log"
	"net/http"
	"os"
	"path/filepath"
)

type FileInfo struct {
	Name        string
	Path        string // to track where each file is from, and request directory changes.
	Size        int64
	IsDirectory bool
}

func ReadFileDir(dir string) []FileInfo {
	// return a slice fileinfo objects containing files or subdirectories within the provided directory via.
	var filesfound []FileInfo               // to store info on files found
	log.Println("Reading directory: ", dir) // for debug, remove later.
	entries, err := os.ReadDir(dir)
	if err != nil {
		// log.Fatal(err)
		log.Printf("Failed to read directory: %s (%v)", dir, err) //avoid closing program on error.
		return filesfound
	}

	//loop through all discovered files and folders and add to the return
	for _, entry := range entries {
		if entry.Name() != ".gitignore" {
			info, err := entry.Info()
			if err != nil {
				log.Printf("Skipping %s due to error: %v", entry.Name(), err)
				continue
			}
			if entry.IsDir() {
				filesfound = append(filesfound, FileInfo{Name: entry.Name(), Path: dir + entry.Name() + "/", Size: info.Size(), IsDirectory: entry.IsDir()})
			} else {
				filesfound = append(filesfound, FileInfo{Name: entry.Name(), Path: dir + entry.Name(), Size: info.Size(), IsDirectory: entry.IsDir()})
			}

		}
	}

	return filesfound
}

func FileListHandler(w http.ResponseWriter, r *http.Request) {
	dir := r.URL.Query().Get("dir")
	if dir == "" {
		// may be able to remove this, since this prefix is added by default.
		dir = "./storage-directory/"
	}

	files := ReadFileDir(dir)

	tmpl, err := template.ParseFiles(filepath.Join("templates", "filelist.html"))
	if err != nil {
		http.Error(w, "Template error", http.StatusInternalServerError)
		return
	}

	tmpl.Execute(w, files)
}

func ReactFileListHandler(w http.ResponseWriter, r *http.Request) {
	// Set CORS headers to allow requests from localhost:5173
	w.Header().Set("Access-Control-Allow-Origin", "*") // Change this to your front-end URL if needed
	// TODO: REMOVE THE STAR AS IT IS A SECURITY RISK. TESTING PURPOSES ONLY.
	w.Header().Set("Access-Control-Allow-Headers", "Content-Type")
	w.Header().Set("Access-Control-Allow-Methods", "GET")

	if r.Method == http.MethodOptions {
		return // Handle pre-flight request
	}

	dir := r.URL.Query().Get("dir")
	if dir == "" {
		// may be able to remove this, since this prefix is added by default.
		dir = "./storage-directory/"
	}

	files := ReadFileDir(dir)

	w.Header().Set("Content-Type", "application/json")
	json.NewEncoder(w).Encode(files)
}
