package github

import (
	"devbio/database"
	"net/http"
	"strconv"
)

func GithubConnectionsPatchRequest(w http.ResponseWriter, r *http.Request) {
	sessionID := r.Header.Get("session")
	accountData := database.GetAccountDataFromSession(sessionID)

	if accountData.Username != "" {
		repoName := r.Header.Get("repository_name")
		isShownStr := r.Header.Get("is_shown")

		isShown, err := strconv.ParseBool(isShownStr)
		if err != nil {
			http.Error(w, "Invalid is_shown value", http.StatusBadRequest)
			return
		}

		err = database.UpdateRepositoryIsShown(repoName, isShown)
		if err != nil {
			http.Error(w, "Error updating repository is_shown", http.StatusInternalServerError)
			return
		}
	} else {
		http.Error(w, "Session doesn't exist", http.StatusUnauthorized)
		return
	}
}
