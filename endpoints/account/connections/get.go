package connections

import (
	"devbio/database"
	ReturnModule "devbio/modules/return_module"
	"net/http"
)

func GetRequest(w http.ResponseWriter, r *http.Request) {
	sessionID := r.Header.Get("session")

	if sessionID != "" {
		ReturnModule.Connections(w, r, database.GetConnectionsBySessionID(sessionID))
	} else {
		ReturnModule.MissingData(w, r)
	}
}
