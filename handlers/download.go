package handlers

import (
	"archive/zip"
	"io"
	"log"
	"net/http"
	"os"
	"path/filepath"
)

func DownloadHandler(w http.ResponseWriter, r *http.Request) {
	// handles the client's request to download a file or folder. serves zip for folders.
	path := r.URL.Query().Get("path")
	if path == "" {
		http.Error(w, "Missing file path", http.StatusBadRequest)
		return
	}
	path = filepath.Clean(path) // clean up the path for windows
	log.Println("Client requesting download of: ", path)

	if filepath.Ext(path) == "" {
		// no extension means the requested file is a folder. must be zipped.
		tempZipPath := path + ".zip"

		// Zip folder (use a helper to zip it on the fly or pre-zip)
		err := zipFolder(path)
		if err != nil {
			http.Error(w, "Failed to zip folder", http.StatusInternalServerError)
			return
		}
		defer os.Remove(tempZipPath) // remove zip after execution but before return.

		w.Header().Set("Content-Disposition", "attachment; filename="+filepath.Base(tempZipPath))
		w.Header().Set("Content-Type", "application/zip")
		http.ServeFile(w, r, tempZipPath)

	} else {
		// just a regular file. No zip required.
		w.Header().Set("Content-Disposition", "attachment; filename="+filepath.Base(path))
		w.Header().Set("Content-Type", "application/octet-stream") // generic type for binary data
		// tells browser to not attempt to execute, just DL.
		http.ServeFile(w, r, path)
	}

}

func zipFolder(folderPath string) error {
	//zips the folder at the path provided, outputs in same directory.
	zipFilePath := folderPath + ".zip"

	// Create the zip file
	zipFile, err := os.Create(zipFilePath)
	if err != nil {
		log.Println("Error creating zip file:", err)
		return nil
	}
	defer zipFile.Close()

	// Create a new zip writer
	zipWriter := zip.NewWriter(zipFile)
	defer zipWriter.Close()

	// Walk through the folder and add files to the zip archive
	err = filepath.Walk(folderPath, func(filePath string, info os.FileInfo, err error) error {
		if err != nil {
			log.Println("Error walking the path", err)
			return err
		}

		// Skip the root folder itself (we only want to add its contents)
		if filePath == folderPath {
			return nil
		}

		// Create a new zip entry
		relPath, err := filepath.Rel(folderPath, filePath)
		if err != nil {
			log.Println("Error creating relative path:", err)
			return err // or handle the error as appropriate
		}

		if info.IsDir() {
			// check if it is a directory and handle if so
			// Add trailing slash to mark it as a directory in zip
			_, err := zipWriter.Create(relPath + "/")
			if err != nil {
				log.Println("Error creating directory in zip:", err)
				return err
			}
			return nil // skip file opening and processing
		}

		// Open the file
		file, err := os.Open(filePath)
		if err != nil {
			log.Println("Error opening file:", err)
			return err
		}
		defer file.Close()

		zipEntry, err := zipWriter.Create(relPath)
		if err != nil {
			log.Println("Error creating zip entry:", err)
			return err
		}

		// Copy the file content into the zip entry
		_, err = io.Copy(zipEntry, file)
		if err != nil {
			log.Println("Error copying file to zip entry:", err)
			return err
		}

		return nil
	})

	if err != nil {
		log.Println("Error zipping folder:", err)
		return err
	}

	log.Println("Folder successfully zipped:", zipFilePath)
	return nil
}
