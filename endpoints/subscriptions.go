package endpoints

import (
	checkout_session "devbio/endpoints/subscriptions/checkout-session"
	portal_session "devbio/endpoints/subscriptions/portal-session"
	ReturnModule "devbio/modules/return_module"
	"net/http"
)

func ManageWebhook(w http.ResponseWriter, r *http.Request) {
	if r.Method == "POST" {
		checkout_session.PostRequest(w, r)
	} else {
		ReturnModule.MethodNotAllowed(w, r)
	}
}

func ManagePortalSession(w http.ResponseWriter, r *http.Request) {
	if r.Method == "POST" {
		portal_session.PostRequest(w, r)
	} else {
		ReturnModule.MethodNotAllowed(w, r)
	}
}

func ManageCheckoutSession(w http.ResponseWriter, r *http.Request) {
	if r.Method == "POST" {
		checkout_session.PostRequest(w, r)
	} else {
		ReturnModule.MethodNotAllowed(w, r)
	}
}
