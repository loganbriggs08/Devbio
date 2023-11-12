package accounts

import (
	"devbio/database"
	ReturnModule "devbio/modules/return_module"
	"net/http"
)

func GetRequest(w http.ResponseWriter, r *http.Request) {
	sessionAuthentication := r.Header.Get("session")
	username := r.Header.Get("username")

	if sessionAuthentication != "" {
		accountDataStruct := database.GetAccountDataFromSession(sessionAuthentication)

		if accountDataStruct.Username == "" {
			ReturnModule.InternalServerError(w, r)
		} else {
			ReturnModule.AccountData(w, r, accountDataStruct)
		}
	} else if username != "" {
		accountDataStruct := database.GetAccountData(username)

		if accountDataStruct.Username == "" {
			ReturnModule.InternalServerError(w, r)
		} else {
			ReturnModule.AccountData(w, r, accountDataStruct)
		}
	} else {
		ReturnModule.MissingData(w, r)
	}
}
