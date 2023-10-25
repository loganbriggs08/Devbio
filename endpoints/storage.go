package endpoints

import (
	"devbio/endpoints/storage"
	"devbio/modules/return_module"
	"net/http"
)

func ManageStorage(w http.ResponseWriter, r *http.Request) {
	if r.Method == "POST" {
		storage.PostRequest(w, r)
	} else {
		ReturnModule.MethodNotAllowed(w, r)
	}
}
