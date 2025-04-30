package handlers

import (
	"encoding/json"
	"net/http"
)

func ApiSubmitHandler(w http.ResponseWriter, r *http.Request) {
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