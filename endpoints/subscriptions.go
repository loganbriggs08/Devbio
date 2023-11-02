package endpoints

import (
	"devbio/endpoints/subscriptions"
	ReturnModule "devbio/modules/return_module"
	"net/http"
)

func ManageSubscribe(w http.ResponseWriter, r *http.Request) {
	if r.Method == "POST" {
		subscriptions.PostRequest(w, r)
	} else {
		ReturnModule.MethodNotAllowed(w, r)
	}
}
