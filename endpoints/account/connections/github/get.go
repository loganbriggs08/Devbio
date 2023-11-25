package github

import (
	"devbio/database"
	ReturnModule "devbio/modules/return_module"
	"net/http"
)

func GithubConnectionsGetRequest(w http.ResponseWriter, r *http.Request) {
	sessionID := r.Header.Get("session")

	if sessionID != "" {
		accountData := database.GetAccountDataFromSession(sessionID)

		if accountData.Username == "" {
			ReturnModule.InternalServerError(w, r)
		}

		repositoriesArray, repositoriesArrayError := database.GetRepositoriesByUsername(accountData.Username)

		if repositoriesArrayError != nil {
			ReturnModule.InternalServerError(w, r)
		}

		ReturnModule.Repositories(w, r, repositoriesArray)
	} else {
		ReturnModule.MissingData(w, r)
	}
}
