package ReturnModule

import (
	"devbio/structs"
	"encoding/json"
	"github.com/pterm/pterm"
	"net/http"
)

func CustomError(w http.ResponseWriter, r *http.Request, ErrorMessage string, ErrorCode int) {
	ErrorResponse := structs.ErrorResponse{
		ErrorCode:    ErrorCode,
		ErrorMessage: ErrorMessage,
	}

	ErrorResponseMarshal, ErrorResponseError := json.Marshal(ErrorResponse)

	if ErrorResponseError != nil {
		pterm.Error.Println(ErrorResponseError)
	}

	w.WriteHeader(ErrorCode)

	_, ResponseWriterError := w.Write(ErrorResponseMarshal)

	if ResponseWriterError != nil {
		pterm.Error.Println(ResponseWriterError)
	}
}

func MethodNotAllowed(w http.ResponseWriter, r *http.Request) {
	ErrorResponse := structs.ErrorResponse{
		ErrorCode:    http.StatusMethodNotAllowed,
		ErrorMessage: "That method is not accepted at this endpoint.",
	}

	ErrorResponseMarshal, ErrorResponseError := json.Marshal(ErrorResponse)

	if ErrorResponseError != nil {
		pterm.Error.Println(ErrorResponseError)
	}

	w.WriteHeader(http.StatusMethodNotAllowed)

	_, ResponseWriterError := w.Write(ErrorResponseMarshal)

	if ResponseWriterError != nil {
		pterm.Error.Println(ResponseWriterError)
	}
}

func MissingData(w http.ResponseWriter, r *http.Request) {
	ErrorResponse := structs.ErrorResponse{
		ErrorCode:    http.StatusBadRequest,
		ErrorMessage: "There was missing data inside the request.",
	}

	ErrorResponseMarshal, ErrorResponseError := json.Marshal(ErrorResponse)

	if ErrorResponseError != nil {
		pterm.Error.Println(ErrorResponseError)
	}

	w.WriteHeader(http.StatusBadRequest)

	_, ResponseWriterError := w.Write(ErrorResponseMarshal)

	if ResponseWriterError != nil {
		pterm.Error.Println(ResponseWriterError)
	}
}

func InternalServerError(w http.ResponseWriter, r *http.Request) {
	ErrorResponse := structs.ErrorResponse{
		ErrorCode:    http.StatusInternalServerError,
		ErrorMessage: "There was an internal server error while trying to handle your request.",
	}

	ErrorResponseMarshal, ErrorResponseError := json.Marshal(ErrorResponse)

	if ErrorResponseError != nil {
		pterm.Error.Println(ErrorResponseError)
	}

	w.WriteHeader(http.StatusInternalServerError)

	_, ResponseWriterError := w.Write(ErrorResponseMarshal)

	if ResponseWriterError != nil {
		pterm.Error.Println(ResponseWriterError)
	}
}

func SessionCreated(w http.ResponseWriter, r *http.Request, sessionAuthentication string) {
	ErrorResponse := structs.SessionCreated{
		SessionAuthentication: sessionAuthentication,
	}

	ErrorResponseMarshal, ErrorResponseError := json.Marshal(ErrorResponse)

	if ErrorResponseError != nil {
		pterm.Error.Println(ErrorResponseError)
	}

	w.WriteHeader(http.StatusOK)

	_, ResponseWriterError := w.Write(ErrorResponseMarshal)

	if ResponseWriterError != nil {
		pterm.Error.Println(ResponseWriterError)
	}
}

func AccountData(w http.ResponseWriter, r *http.Request, accountDataStruct structs.UserResponse) {
	AccountDataResponse, ErrorResponseError := json.Marshal(accountDataStruct)

	if ErrorResponseError != nil {
		pterm.Error.Println(ErrorResponseError)
	}

	w.WriteHeader(http.StatusOK)

	_, ResponseWriterError := w.Write(AccountDataResponse)

	if ResponseWriterError != nil {
		pterm.Error.Println(ResponseWriterError)
	}
}

func ProfilesData(w http.ResponseWriter, r *http.Request, exploreDataStruct []structs.ExploreData) {
	ExploreResponse := structs.ExploreDatsResponse{
		ExploreData: exploreDataStruct,
	}

	ExploreDataResponseMarshal, ErrorResponseError := json.Marshal(ExploreResponse)

	if ErrorResponseError != nil {
		pterm.Error.Println(ErrorResponseError)
	}

	w.WriteHeader(http.StatusOK)

	_, ResponseWriterError := w.Write(ExploreDataResponseMarshal)

	if ResponseWriterError != nil {
		pterm.Error.Println(ResponseWriterError)
	}
}

func Success(w http.ResponseWriter, r *http.Request) {
	SuccessResponse := structs.SuccessResponse{
		Success: true,
	}

	SuccessResponseMarshal, ErrorResponseError := json.Marshal(SuccessResponse)

	if ErrorResponseError != nil {
		pterm.Error.Println(ErrorResponseError)
	}

	w.WriteHeader(http.StatusOK)

	_, ResponseWriterError := w.Write(SuccessResponseMarshal)

	if ResponseWriterError != nil {
		pterm.Error.Println(ResponseWriterError)
	}
}

func Notifications(w http.ResponseWriter, r *http.Request, notifications []string) {
	NotificationsResponse := structs.NotificationsResponse{
		Notifications: notifications,
	}

	NotificationsResponseMarshal, ErrorResponseError := json.Marshal(NotificationsResponse)

	if ErrorResponseError != nil {
		pterm.Error.Println(ErrorResponseError)
	}

	w.WriteHeader(http.StatusOK)

	_, ResponseWriterError := w.Write(NotificationsResponseMarshal)

	if ResponseWriterError != nil {
		pterm.Error.Println(ResponseWriterError)
	}
}

func Connections(w http.ResponseWriter, r *http.Request, connections []structs.Connection) {
	ConnectionResponse := structs.ConnectionsResponse{
		Connections: connections,
	}

	ConnectionResponseMarshal, ErrorResponseError := json.Marshal(ConnectionResponse)

	if ErrorResponseError != nil {
		pterm.Error.Println(ErrorResponseError)
	}

	w.WriteHeader(http.StatusOK)

	_, ResponseWriterError := w.Write(ConnectionResponseMarshal)

	if ResponseWriterError != nil {
		pterm.Error.Println(ResponseWriterError)
	}
}

func Statistics(w http.ResponseWriter, r *http.Request, statistics []structs.Statistics) {
	StatisticsResponse := structs.StatisticsResponse{
		Statistics: statistics,
	}

	StatisticResponseMarshal, ErrorResponseError := json.Marshal(StatisticsResponse)

	if ErrorResponseError != nil {
		pterm.Error.Println(ErrorResponseError)
	}

	w.WriteHeader(http.StatusOK)

	_, ResponseWriterError := w.Write(StatisticResponseMarshal)

	if ResponseWriterError != nil {
		pterm.Error.Println(ResponseWriterError)
	}
}
