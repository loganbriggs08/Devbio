package accounts

import (
	"devbio/database"
	"devbio/modules"
	"devbio/modules/return_module"
	"encoding/json"
	"net/http"
)

func PostRequest(w http.ResponseWriter, r *http.Request) {
	var requestData struct {
		Username string `json:"username"`
		Password string `json:"password"`
	}

	decoder := json.NewDecoder(r.Body)

	if err := decoder.Decode(&requestData); err != nil {
		ReturnModule.InternalServerError(w, r)
		return
	}

	accountUsername := requestData.Username
	accountPassword := requestData.Password

	if accountUsername != "" && accountPassword != "" {
		if database.AccountExists(accountUsername) {
			ReturnModule.CustomError(w, r, "An account already exists with that username.", http.StatusMethodNotAllowed)
		} else {
			if database.CreateAccount(accountUsername, accountPassword) {
				SessionAuthentication := modules.GenerateAuthentication(accountUsername)

				if database.AddSession(accountUsername, SessionAuthentication) {
					ReturnModule.SessionCreated(w, r, SessionAuthentication)
				} else {
					ReturnModule.InternalServerError(w, r)
				}
			} else {
				ReturnModule.InternalServerError(w, r)
			}
		}
	} else {
		ReturnModule.MissingData(w, r)
	}
}
