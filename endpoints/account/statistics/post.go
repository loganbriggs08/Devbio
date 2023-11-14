package statistics

import (
	"devbio/database"
	ReturnModule "devbio/modules/return_module"
	"net/http"
	"strconv"
)

func PostRequest(w http.ResponseWriter, r *http.Request) {
	viewedProfile := r.Header.Get("profile")
	connectionClickedStr := r.Header.Get("connection_clicked")

	connectionClicked, err := strconv.ParseBool(connectionClickedStr)
	if err != nil {
		ReturnModule.InternalServerError(w, r)
		return
	}

	if viewedProfile == "" {
		ReturnModule.MissingData(w, r)
	} else {
		if database.UpdateStatistics(viewedProfile, connectionClicked) {
			ReturnModule.Success(w, r)
		} else {
			ReturnModule.InternalServerError(w, r)
		}
	}
}
