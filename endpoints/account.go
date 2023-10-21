package endpoints

import (
	"devbio/endpoints/account"
	"devbio/endpoints/account/session"
	"devbio/modules/return_module"
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

func ManageSessions(w http.ResponseWriter, r *http.Request) {
	if r.Method == "GET" {
		session.GetRequest(w, r)
	} else {
		ReturnModule.MethodNotAllowed(w, r)
	}
}
