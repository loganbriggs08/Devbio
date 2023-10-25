package main

import (
	"devbio/database"
	"devbio/endpoints"
	"github.com/pterm/pterm"
	"log"
	"net/http"
)

func corsMiddleware(next http.Handler) http.Handler {
	return http.HandlerFunc(func(w http.ResponseWriter, r *http.Request) {
		w.Header().Set("Access-Control-Allow-Origin", "*")
		w.Header().Set("Access-Control-Allow-Methods", "*")
		w.Header().Set("Access-Control-Allow-Headers", "*")

		if r.Method == http.MethodOptions {
			w.WriteHeader(http.StatusOK)
			return
		}

		next.ServeHTTP(w, r)
	})
}

func main() {
	if database.InitializeStorageDatabase() && database.CreateStorageTables() {
		pterm.Success.Println("Storage database has been initalized successfully.")

		if database.InitializeDatabase() && database.CreateTables() {
			pterm.Success.Println("Database has been initalized successfully.")

			http.HandleFunc("/api/account", endpoints.ManageAccounts)
			http.HandleFunc("/api/account/session", endpoints.ManageSessions)
			http.HandleFunc("/api/account/update", endpoints.ManageUpdate)

			http.HandleFunc("/api/storage/", endpoints.ManageStorage)

			log.Fatal(http.ListenAndServe(":6969", corsMiddleware(http.DefaultServeMux)))
		} else {
			pterm.Fatal.WithFatal(true).Println("Failed to initalize database successfully.")
		}
	} else {
		pterm.Fatal.WithFatal(true).Println("Failed to initalize storage database successfully.")
	}
}
