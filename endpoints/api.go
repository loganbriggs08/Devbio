package endpoints

import (
	ReturnModule "devbio/modules/return_module"
	"net/http"
)

func ManageApi(w http.ResponseWriter, r *http.Request) {
	if r.Method == "GET" {
		ReturnModule.CustomError(w, r, "hello world", http.StatusOK)
	} else {
		ReturnModule.MethodNotAllowed(w, r)
	}
}
