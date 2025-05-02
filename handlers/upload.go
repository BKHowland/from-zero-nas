package handlers

import (
	"io"
	"log"
	"net/http"
	"os"
	"path/filepath"
)

func UploadHandler(w http.ResponseWriter, r *http.Request) {
	const maxUploadSize = 10 << 30 // 10 GB

	r.Body = http.MaxBytesReader(w, r.Body, maxUploadSize)

	err := r.ParseMultipartForm(32 << 20) // 32MB memory buffer for form parsing only
	if err != nil {
		http.Error(w, "File too large or invalid form", http.StatusBadRequest)
		return
	}

	file, header, err := r.FormFile("file")
	if err != nil {
		http.Error(w, "Error retrieving file", http.StatusBadRequest)
		return
	}
	defer file.Close()

	filename := filepath.Base(header.Filename)
	outPath := filepath.Join("uploads", filename)

	outFile, err := os.Create(outPath)
	if err != nil {
		http.Error(w, "Unable to save file", http.StatusInternalServerError)
		return
	}
	defer outFile.Close()

	_, err = io.Copy(outFile, file) // streaming, minimal memory usage
	if err != nil {
		http.Error(w, "Error writing file", http.StatusInternalServerError)
		return
	}

	log.Printf("Uploaded %s successfully!", filename)

	// Redirect back or send a response
	http.Redirect(w, r, "/", http.StatusSeeOther)
}
