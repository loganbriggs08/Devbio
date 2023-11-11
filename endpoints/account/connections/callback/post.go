package callback

import (
	"devbio/database"
	"devbio/modules/github"
	ReturnModule "devbio/modules/return_module"
	"github.com/joho/godotenv"
	"net/http"
	"time"
)

func PostRequest(w http.ResponseWriter, r *http.Request) {
	authenticationType := r.Header.Get("type")
	sessionID := r.Header.Get("session")
	code := r.Header.Get("code")

	envFile, _ := godotenv.Read(".env")

	username := database.GetAccountDataFromSession(sessionID).Username

	if username == "" {
		ReturnModule.MethodNotAllowed(w, r)
	} else {
		if authenticationType == "github" {
			accessToken, exchangeError := github.ExchangeCodeForAccessToken(envFile["GITHUB_CLIENT_ID"], envFile["GITHUB_CLIENT_SECRET"], code, "http://localhost:6969/callback/github")

			if exchangeError != nil {
				ReturnModule.InternalServerError(w, r)
			} else {
				if database.AddGithubAccessToken(username, accessToken) == true {
					githubUsername, usernameFetchError := github.GetGitHubUsername(accessToken)

					if usernameFetchError != nil {
						ReturnModule.InternalServerError(w, r)
					} else {
						if database.AddConnection("GitHub", username, true, githubUsername, time.Now().Format("2006-01-02 15:04:05")) == true {
							ReturnModule.Success(w, r)
						} else {
							ReturnModule.InternalServerError(w, r)
						}
					}
				} else {
					ReturnModule.InternalServerError(w, r)
				}
			}
		} else {
			ReturnModule.MissingData(w, r)
		}
	}
}
