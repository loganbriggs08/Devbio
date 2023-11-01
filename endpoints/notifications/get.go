package notifications

import (
	"devbio/database"
	ReturnModule "devbio/modules/return_module"
	"net/http"
)

func GetRequest(w http.ResponseWriter, r *http.Request) {
	session := r.Header.Get("session")

	if session != "" {
		userInformation := database.GetAccountDataFromSession(session)

		if userInformation.Username != "" {
			notificationsForUser := database.GetNotifications(userInformation.Username)

			ReturnModule.Notifications(w, r, notificationsForUser)
		} else {
			ReturnModule.InternalServerError(w, r)
		}
	} else {
		ReturnModule.MissingData(w, r)
	}
}
