package ReturnModule

import (
	"devbio/structs"
	"encoding/json"
	"log"
	"net/http"
)

func MethodNotAllowed(w http.ResponseWriter, r *http.Request) {
	ErrorResponse := structs.ErrorResponse{
		ErrorCode:    http.StatusMethodNotAllowed,
		ErrorMessage: "That method is not accepted at this endpoint.",
	}

	ErrorResponseMarshal, ErrorResponseError := json.Marshal(ErrorResponse)

	if ErrorResponseError != nil {
		log.Fatal(ErrorResponseError)
	}

	w.WriteHeader(http.StatusMethodNotAllowed)

	_, ResponseWriterError := w.Write(ErrorResponseMarshal)

	if ResponseWriterError != nil {
		log.Fatal(ResponseWriterError)
	}
}
