package endpoints

import (
	ReturnModule "devbio/modules/return_module"
	"fmt"
	"net/http"
)

func ManageNotifications(w http.ResponseWriter, r *http.Request) {
	if r.Method == "GET" {
		fmt.Println("Hello World")
	} else {
		ReturnModule.MethodNotAllowed(w, r)
	}
}
