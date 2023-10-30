package banner

import (
	"devbio/database"
	ReturnModule "devbio/modules/return_module"
	"encoding/json"
	"net/http"
)

func PostRequest(w http.ResponseWriter, r *http.Request) {
	accountSession := r.Header.Get("session")

	var data struct {
		ProfileBanner []byte `json:"profile_banner"`
	}

	decoder := json.NewDecoder(r.Body)

	if err := decoder.Decode(&data); err != nil {
		ReturnModule.InternalServerError(w, r)
		return
	}

	accountDataResult := database.GetAccountData(accountSession)

	if accountDataResult.Username != "" {
		databaseQueryError := database.InsertOrUpdateBannerImage(accountDataResult.Username, data.ProfileBanner)

		if databaseQueryError != nil {
			ReturnModule.InternalServerError(w, r)
		} else {
			ReturnModule.Success(w, r)
		}
	} else {
		ReturnModule.MethodNotAllowed(w, r)
	}
}
