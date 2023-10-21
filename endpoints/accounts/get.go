package accounts

import (
	ReturnModule "devbio/modules/return_module"
	"encoding/json"
	"net/http"
)

func GetRequest(w http.ResponseWriter, r *http.Request) {
	var requestData struct {
		Username string `json:"username"`
	}

	decoder := json.NewDecoder(r.Body)

	if err := decoder.Decode(&requestData); err != nil {
		ReturnModule.InternalServerError(w, r)
		return
	}

	accountUsername := requestData.Username

	if accountUsername != "" {

	} else {
		ReturnModule.MissingData(w, r)
	}
}
