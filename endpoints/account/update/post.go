package update

import (
	"devbio/database"
	ReturnModule "devbio/modules/return_module"
	"encoding/json"
	"fmt"
	"net/http"
)

func PostRequest(w http.ResponseWriter, r *http.Request) {
	accountSession := r.Header.Get("session")

	var updateRequestData struct {
		Username        string
		ProfilePicture  []byte   `json:"profile_picture"`
		Description     string   `json:"description"`
		Skills          []string `json:"skills"`
		Location        string   `json:"location"`
		Interests       []string `json:"interests"`
		SpokenLanguages []string `json:"spoken_languages"`
	}

	decoder := json.NewDecoder(r.Body)

	if err := decoder.Decode(&updateRequestData); err != nil {
		ReturnModule.InternalServerError(w, r)
		return
	}

	fmt.Println(updateRequestData.ProfilePicture)

	accountDataResult := database.GetAccountData(accountSession)
	updateRequestData.Username = accountDataResult.Username

	if accountDataResult.Username != "" {
		updateProfileResult := database.UpdateProfileData(updateRequestData)

		if updateProfileResult == true {
			ReturnModule.Success(w, r)
		} else {
			ReturnModule.InternalServerError(w, r)
		}
	} else {
		ReturnModule.MethodNotAllowed(w, r)
	}
}
