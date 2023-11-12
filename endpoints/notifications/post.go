package notifications

import (
	"devbio/database"
	ReturnModule "devbio/modules/return_module"
	"encoding/json"
	"net/http"
)

func PostRequest(w http.ResponseWriter, r *http.Request) {
	session := r.Header.Get("session")

	if session != "" {
		if database.GetIsStaff(session) {
			var requestData struct {
				Recipient   string `json:"recipient"`
				ForEveryone bool   `json:"for_everyone"`
				Message     string `json:"message"`
			}

			decoder := json.NewDecoder(r.Body)

			if err := decoder.Decode(&requestData); err != nil {
				ReturnModule.InternalServerError(w, r)
				return
			}

			if database.CreateNotification(requestData.Recipient, requestData.ForEveryone, requestData.Message) {
				ReturnModule.Success(w, r)
			} else {
				ReturnModule.InternalServerError(w, r)
			}

		} else {
			ReturnModule.CustomError(w, r, "Requests to this endpoint can only be sent by authorised users", http.StatusForbidden)
		}
	} else {
		ReturnModule.MissingData(w, r)
	}
}
