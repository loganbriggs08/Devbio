package endpoints

import (
	"devbio/endpoints/storage/profile/banner"
	"devbio/endpoints/storage/profile/icon"
	"devbio/modules/return_module"
	"net/http"
)

func ManageIcon(w http.ResponseWriter, r *http.Request) {
	if r.Method == "POST" {
		icon.PostRequest(w, r)
	} else if r.Method == "GET" {
		icon.GetRequest(w, r)
	} else {
		ReturnModule.MethodNotAllowed(w, r)
	}
}

func ManageBanner(w http.ResponseWriter, r *http.Request) {
	if r.Method == "POST" {
		banner.PostRequest(w, r)
	} else if r.Method == "GET" {
		banner.GetRequest(w, r)
	} else {
		ReturnModule.MethodNotAllowed(w, r)
	}
}
