package handlers

import (
	"encoding/json"
	"io"
	"log"
	"net/http"
	"os"
	"path/filepath"
)

func UploadHandler(w http.ResponseWriter, r *http.Request) {
	// cleint will send request containing file data to be saved on server. This handles saving it. multiple files and folders to be supported.

	// Set CORS headers to allow requests from localhost:5173
	w.Header().Set("Access-Control-Allow-Origin", "*") // Change this to your front-end URL if needed
	// TODO: REMOVE THE STAR AS IT IS A SECURITY RISK. TESTING PURPOSES ONLY.
	w.Header().Set("Access-Control-Allow-Headers", "Content-Type")
	w.Header().Set("Access-Control-Allow-Methods", "POST, GET")

	const maxUploadSize = 10 << 30 // 10 GB
	r.Body = http.MaxBytesReader(w, r.Body, maxUploadSize)

	err := r.ParseMultipartForm(32 << 20)
	if err != nil {
		http.Error(w, "File too large or invalid form", http.StatusBadRequest)
		return
	}

	form := r.MultipartForm
	log.Print("############### UPLOAD START ############### \nReceived save request: \n", form)
	files := form.File["files"]
	paths := form.Value["paths"]                    // Slice of relative paths, same order as files
	destinationPath := form.Value["destination"][0] // Path currently viewed by client. Only one provided.
	log.Println("Requested save directory: ", destinationPath)
	log.Println("Relative path count: ", len(paths))

	for i, fileHeader := range files {
		// This still gives you the correct relative path (if sent via third argument in append())
		// currently not being respected in practice. to be fixed.
		relPath := paths[i] // Get matching relative path

		// Debug log
		log.Println("Received file with relPath:", relPath)

		// Sanitize and ensure full path
		relPath = filepath.Clean(relPath)
		uploadPath := filepath.Join(destinationPath, relPath)

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
	log.Println("############### UPLOAD FINISH ###############")

	// http.Redirect(w, r, "/", http.StatusSeeOther) // rather than redirect, front end will fetch updated list.
	resp := map[string]string{
		"status":  "ok",
		"details": "Files Saved successfully to " + destinationPath,
	}
	w.Header().Set("Content-Type", "application/json")
	json.NewEncoder(w).Encode(resp)
}
