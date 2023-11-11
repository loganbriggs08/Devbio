package endpoints

import (
	"devbio/endpoints/account"
	"devbio/endpoints/account/connections"
	"devbio/endpoints/account/connections/callback"
	"devbio/endpoints/account/session"
	"devbio/endpoints/account/statistics"
	"devbio/endpoints/account/update"
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

func ManageUpdate(w http.ResponseWriter, r *http.Request) {
	if r.Method == "POST" {
		update.PostRequest(w, r)
	} else {
		ReturnModule.MethodNotAllowed(w, r)
	}
}

func ManageStatistics(w http.ResponseWriter, r *http.Request) {
	if r.Method == "GET" {
		statistics.GetRequest(w, r)
	} else {
		ReturnModule.MethodNotAllowed(w, r)
	}
}

func ManageConnections(w http.ResponseWriter, r *http.Request) {
	if r.Method == "GET" {
		connections.GetRequest(w, r)
	} else {
		ReturnModule.MethodNotAllowed(w, r)
	}
}

func ManageConnectionsCallback(w http.ResponseWriter, r *http.Request) {
	if r.Method == "POST" {
		callback.PostRequest(w, r)
	} else {
		ReturnModule.MethodNotAllowed(w, r)
	}
}
