package ReturnModule

import (
	"devbio/structs"
	"encoding/json"
	"log"
	"net/http"
)

func CustomError(w http.ResponseWriter, r *http.Request, ErrorMessage string, ErrorCode int) {
	ErrorResponse := structs.ErrorResponse{
		ErrorCode:    ErrorCode,
		ErrorMessage: ErrorMessage,
	}

	ErrorResponseMarshal, ErrorResponseError := json.Marshal(ErrorResponse)

	if ErrorResponseError != nil {
		log.Fatal(ErrorResponseError)
	}

	w.WriteHeader(ErrorCode)

	_, ResponseWriterError := w.Write(ErrorResponseMarshal)

	if ResponseWriterError != nil {
		log.Fatal(ResponseWriterError)
	}
}

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

func MissingData(w http.ResponseWriter, r *http.Request) {
	ErrorResponse := structs.ErrorResponse{
		ErrorCode:    http.StatusBadRequest,
		ErrorMessage: "There was missing data inside the request.",
	}

	ErrorResponseMarshal, ErrorResponseError := json.Marshal(ErrorResponse)

	if ErrorResponseError != nil {
		log.Fatal(ErrorResponseError)
	}

	w.WriteHeader(http.StatusBadRequest)

	_, ResponseWriterError := w.Write(ErrorResponseMarshal)

	if ResponseWriterError != nil {
		log.Fatal(ResponseWriterError)
	}
}

func InternalServerError(w http.ResponseWriter, r *http.Request) {
	ErrorResponse := structs.ErrorResponse{
		ErrorCode:    http.StatusInternalServerError,
		ErrorMessage: "There was an internal server error while trying to handle your request.",
	}

	ErrorResponseMarshal, ErrorResponseError := json.Marshal(ErrorResponse)

	if ErrorResponseError != nil {
		log.Fatal(ErrorResponseError)
	}

	w.WriteHeader(http.StatusInternalServerError)

	_, ResponseWriterError := w.Write(ErrorResponseMarshal)

	if ResponseWriterError != nil {
		log.Fatal(ResponseWriterError)
	}
}

func SessionCreated(w http.ResponseWriter, r *http.Request, sessionAuthentication string) {
	ErrorResponse := structs.SessionCreated{
		SessionAuthentication: sessionAuthentication,
	}

	ErrorResponseMarshal, ErrorResponseError := json.Marshal(ErrorResponse)

	if ErrorResponseError != nil {
		log.Fatal(ErrorResponseError)
	}

	w.WriteHeader(http.StatusOK)

	_, ResponseWriterError := w.Write(ErrorResponseMarshal)

	if ResponseWriterError != nil {
		log.Fatal(ResponseWriterError)
	}
}

func AccountData(w http.ResponseWriter, r *http.Request, accountDataStruct structs.UserResponse) {
	AccountDataResponse, ErrorResponseError := json.Marshal(accountDataStruct)

	if ErrorResponseError != nil {
		log.Fatal(ErrorResponseError)
	}

	w.WriteHeader(http.StatusOK)

	_, ResponseWriterError := w.Write(AccountDataResponse)

	if ResponseWriterError != nil {
		log.Fatal(ResponseWriterError)
	}
}

func Success(w http.ResponseWriter, r *http.Request) {
	SuccessResponse := structs.SuccessResponse{
		Success: true,
	}

	SuccessResponseMarshal, ErrorResponseError := json.Marshal(SuccessResponse)

	if ErrorResponseError != nil {
		log.Fatal(ErrorResponseError)
	}

	w.WriteHeader(http.StatusOK)

	_, ResponseWriterError := w.Write(SuccessResponseMarshal)

	if ResponseWriterError != nil {
		log.Fatal(ResponseWriterError)
	}
}
