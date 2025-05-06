package handlers

import (
	"io"
	"log"
	"net/http"
	"os"
	"path/filepath"
)

func UploadHandler(w http.ResponseWriter, r *http.Request) {
	// server will send request containing file data to be saved on server. multiple files and folders to be supported.

	const maxUploadSize = 10 << 30 // 10 GB
	r.Body = http.MaxBytesReader(w, r.Body, maxUploadSize)

	err := r.ParseMultipartForm(32 << 20)
	if err != nil {
		http.Error(w, "File too large or invalid form", http.StatusBadRequest)
		return
	}

	form := r.MultipartForm
	files := form.File["files"]

	for _, fileHeader := range files {
		// This still gives you the correct relative path (if sent via third argument in append())
		// currently not being respected in practice. to be fixed.
		relPath := fileHeader.Filename

		// Debug log
		log.Println("Received file with relPath:", relPath)

		// Sanitize and ensure full path
		relPath = filepath.Clean(relPath)
		uploadPath := filepath.Join("uploads", relPath)

		err := os.MkdirAll(filepath.Dir(uploadPath), os.ModePerm)
		if err != nil {
			http.Error(w, "Unable to create directories", http.StatusInternalServerError)
			return
		}

		file, err := fileHeader.Open()
		if err != nil {
			http.Error(w, "Error opening file", http.StatusInternalServerError)
			return
		}
		defer file.Close()

		outFile, err := os.Create(uploadPath)
		if err != nil {
			http.Error(w, "Unable to create file", http.StatusInternalServerError)
			return
		}
		defer outFile.Close()

		_, err = io.Copy(outFile, file)
		if err != nil {
			http.Error(w, "Error saving file", http.StatusInternalServerError)
			return
		}

		log.Printf("Saved: %s", uploadPath)
	}

	http.Redirect(w, r, "/", http.StatusSeeOther)
}
