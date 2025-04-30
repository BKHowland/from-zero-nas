package handlers

import (
	"encoding/json"
	"log"
	"net/http"
)

func ApiSubmitHandler(w http.ResponseWriter, r *http.Request) {
	log.Println("Received request:", r.Method, r.URL.Path, "-", r.RemoteAddr) // Log the request in terminal
	if r.Method == "POST" {
		var data map[string]string
		json.NewDecoder(r.Body).Decode(&data)
		filename := data["filename"]

		resp := map[string]string{
			"status":  "ok",
			"details": "Received filename: " + filename,
		}
		w.Header().Set("Content-Type", "application/json")
		json.NewEncoder(w).Encode(resp)
	} else {
		http.Error(w, "Invalid method", http.StatusMethodNotAllowed)
	}
}
