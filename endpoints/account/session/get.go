package session

import (
	"devbio/database"
	"devbio/modules"
	ReturnModule "devbio/modules/return_module"
	"net/http"
)

func GetRequest(w http.ResponseWriter, r *http.Request) {
	accountUsername := r.Header.Get("username")
	accountPassword := r.Header.Get("password")

	if accountUsername != "" && accountPassword != "" {
		databaseHashAndPassword := database.GetPasswordHashAndSalt(accountUsername)
		passwordMatches := modules.Unhash(accountPassword, databaseHashAndPassword.HashedPassword, databaseHashAndPassword.RandomSalt)

		if passwordMatches {
			authenticationString := modules.GenerateAuthentication(accountUsername)
			sessionAuthentication := database.AddSession(accountUsername, authenticationString)

			if sessionAuthentication {
				ReturnModule.SessionCreated(w, r, authenticationString)
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
