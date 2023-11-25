package explore

import (
	"devbio/database"
	ReturnModule "devbio/modules/return_module"
	"net/http"
)

func GetRequest(w http.ResponseWriter, r *http.Request) {
	profileDataStruct, err := database.GetProfiles()
	if err {
		ReturnModule.InternalServerError(w, r)
	} else {
		ReturnModule.ProfilesData(w, r, profileDataStruct)
	}
}
