package portal_session

import (
	"fmt"
	"github.com/stripe/stripe-go/v76"
	portalsession "github.com/stripe/stripe-go/v76/billingportal/session"
	"github.com/stripe/stripe-go/v76/checkout/session"
	"log"
	"net/http"
)

func PostRequest(w http.ResponseWriter, r *http.Request) {
	domain := "http://localhost:3000"

	r.ParseForm()
	sessionId := r.PostFormValue("session_id")

	fmt.Print(sessionId)
	s, err := session.Get(sessionId, nil)

	if err != nil {
		http.Error(w, err.Error(), http.StatusInternalServerError)
		log.Printf("session.Get: %v", err)
		return
	}

	params := &stripe.BillingPortalSessionParams{
		Customer:  stripe.String(s.Customer.ID),
		ReturnURL: stripe.String(domain),
	}
	ps, _ := portalsession.New(params)
	log.Printf("ps.New: %v", ps.URL)

	if err != nil {
		http.Error(w, err.Error(), http.StatusInternalServerError)
		log.Printf("ps.New: %v", err)
		return
	}

	http.Redirect(w, r, ps.URL, http.StatusSeeOther)
}
