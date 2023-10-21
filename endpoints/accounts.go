package endpoints

import (
	"devbio/endpoints/accounts"
	"devbio/modules/ReturnModule"
	"net/http"
)

func ManageAccounts(w http.ResponseWriter, r *http.Request) {
	if r.Method == "POST" {
		accounts.PostRequest(w, r)
	} else if r.Method == "GET" {
		accounts.GetRequest(w, r)
	} else if r.Method == "DELETE" {
		accounts.DeleteRequest(w, r)
	} else {
		ReturnModule.MethodNotAllowed(w, r)
	}
}
