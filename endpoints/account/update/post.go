package update

import (
	"devbio/database"
	ReturnModule "devbio/modules/return_module"
	"encoding/json"
	"net/http"
)

func PostRequest(w http.ResponseWriter, r *http.Request) {
	accountSession := r.Header.Get("session")

	if r.Header.Get("type") == "setup" {
		var updateRequestData struct {
			Username           string
			ProfilePicture     []byte   `json:"profile_picture"`
			Description        string   `json:"description"`
			Skills             []string `json:"skills"`
			Location           string   `json:"location"`
			Interests          []string `json:"interests"`
			SpokenLanguages    []string `json:"spoken_languages"`
			ProfilePictureLink string   `json:"profile_picture_link"`
		}

		decoder := json.NewDecoder(r.Body)

		if err := decoder.Decode(&updateRequestData); err != nil {
			ReturnModule.InternalServerError(w, r)
			return
		}

		accountDataResult := database.GetAccountDataFromSession(accountSession)
		updateRequestData.Username = accountDataResult.Username

		if accountDataResult.Username != "" {
			updateImageError := database.InsertOrUpdateProfileImage(accountDataResult.Username, updateRequestData.ProfilePicture)

			if updateImageError != nil {
				ReturnModule.InternalServerError(w, r)
			}
			updateRequestData.ProfilePictureLink = "http://localhost:6969/api/storage/profile/icon" + accountDataResult.Username

			updateProfileResult := database.UpdateProfileSetupData(updateRequestData)

			if updateProfileResult == true {
				ReturnModule.Success(w, r)
			} else {
				ReturnModule.InternalServerError(w, r)
			}
		} else {
			ReturnModule.MethodNotAllowed(w, r)
		}
	} else {
		var updateRequestData struct {
			Username        string
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

}
