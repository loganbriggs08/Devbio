package endpoints

import (
	"devbio/endpoints/explore"
	ReturnModule "devbio/modules/return_module"
	"net/http"
)

func ManageExplore(w http.ResponseWriter, r *http.Request) {
	if r.Method == "GET" {
		explore.GetRequest(w, r)
	} else {
		ReturnModule.MethodNotAllowed(w, r)
	}
}
