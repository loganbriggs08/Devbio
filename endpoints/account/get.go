package accounts

import (
	"devbio/database"
	ReturnModule "devbio/modules/return_module"
	"fmt"
	"net/http"
)

func GetRequest(w http.ResponseWriter, r *http.Request) {
	sessionAuthentication := r.Header.Get("session")

	if sessionAuthentication != "" {
		accountDataStruct := database.GetAccountData(sessionAuthentication)

		if accountDataStruct.Username == "" {
			fmt.Println("Error here.")
			ReturnModule.InternalServerError(w, r)
		} else {
			ReturnModule.AccountData(w, r, accountDataStruct)
		}
	} else {
		ReturnModule.MissingData(w, r)
	}
}
