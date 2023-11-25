package github

import (
	"devbio/database"
	"devbio/modules/github"
	ReturnModule "devbio/modules/return_module"
	"devbio/structs"
	"net/http"
)

func GithubConnectionsPostRequest(w http.ResponseWriter, r *http.Request) {
	sessionID := r.Header.Get("session")

	if sessionID != "" {
		accountUsername := database.GetAccountDataFromSession(sessionID).Username

		if accountUsername != "" {
			githubAccessToken, githubAccessTokenError := database.GetAccessTokenByUsername(accountUsername)

			if githubAccessTokenError != nil {
				ReturnModule.InternalServerError(w, r)
			}

			userRepos, userReposError := github.GetUserRepositories(githubAccessToken)

			if userReposError != nil {
				refreshToken, _ := database.GetRefreshTokenByUsername(accountUsername)
				newAccessToken, _ := github.RefreshAccessToken(refreshToken)

				if database.SetGithubTokens(accountUsername, newAccessToken, refreshToken) {
					userReposNew, _ := github.GetUserRepositories(githubAccessToken)

					if database.DeleteRepositoryData(accountUsername) {
						for _, repo := range userReposNew {
							currentRepo := structs.RepositoryResponse{
								RepositoryName:        repo.RepositoryName,
								RepositoryDescription: repo.RepositoryDescription,
								RepositoryURL:         repo.RepositoryURL,
								StarCount:             repo.StarCount,
								Language:              repo.Language,
							}
							err := database.InsertRepositoryData(currentRepo, accountUsername)
							if err != nil {
								ReturnModule.InternalServerError(w, r)
							}
						}
					} else {
						ReturnModule.InternalServerError(w, r)
					}
				} else {
					ReturnModule.InternalServerError(w, r)
				}
			}

			if database.DeleteRepositoryData(accountUsername) {
				for _, repo := range userRepos {
					currentRepo := structs.RepositoryResponse{
						RepositoryName:        repo.RepositoryName,
						RepositoryDescription: repo.RepositoryDescription,
						RepositoryURL:         repo.RepositoryURL,
						StarCount:             repo.StarCount,
						Language:              repo.Language,
					}
					database.InsertRepositoryData(currentRepo, accountUsername)
				}
			} else {
				ReturnModule.InternalServerError(w, r)
			}

		} else {
			ReturnModule.MethodNotAllowed(w, r)
		}

	} else {
		ReturnModule.MissingData(w, r)
	}
}
