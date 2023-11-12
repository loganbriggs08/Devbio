package connections

import (
	"devbio/database"
	ReturnModule "devbio/modules/return_module"
	"net/http"
)

func DeleteRequest(w http.ResponseWriter, r *http.Request) {
	session := r.Header.Get("session")
	connectionType := r.Header.Get("type")

	username := database.GetAccountDataFromSession(session).Username

	if username != "" && connectionType != "" {
		if database.DeleteConnection(username, connectionType) == true {
			ReturnModule.Success(w, r)
		} else {
			ReturnModule.InternalServerError(w, r)
		}
	} else {
		ReturnModule.MissingData(w, r)
	}
}
