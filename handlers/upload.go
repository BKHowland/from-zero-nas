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

	err := r.ParseMultipartForm(32 << 20) // 32MB memory buffer
	if err != nil {
		http.Error(w, "File too large or invalid form", http.StatusBadRequest)
		return
	}

	// Handle multiple files under the field name "files"
	files := r.MultipartForm.File["files"]
	if len(files) == 0 {
		http.Error(w, "No files uploaded", http.StatusBadRequest)
		return
	}

	for _, header := range files {
		file, err := header.Open()
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

		_, err = io.Copy(outFile, file)
		if err != nil {
			http.Error(w, "Error writing file", http.StatusInternalServerError)
			return
		}

		log.Printf("Uploaded %s successfully!", filename)
	}

	// Redirect or respond after all files are processed
	http.Redirect(w, r, "/", http.StatusSeeOther)
}
