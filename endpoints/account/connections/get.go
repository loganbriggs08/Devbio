package connections

import (
	ReturnModule "devbio/modules/return_module"
	"net/http"
)

func GetRequest(w http.ResponseWriter, r *http.Request) {
	sessionID := r.Header.Get("session")

	if sessionID != "" {

	} else {
		ReturnModule.MissingData(w, r)
	}
}
