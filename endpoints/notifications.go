package endpoints

import (
	"devbio/endpoints/notifications"
	ReturnModule "devbio/modules/return_module"
	"net/http"
)

func ManageNotifications(w http.ResponseWriter, r *http.Request) {
	if r.Method == "GET" {
		notifications.GetRequest(w, r)
	} else if r.Method == "POST" {
		notifications.PostRequest(w, r)
	} else {
		ReturnModule.MethodNotAllowed(w, r)
	}
}
