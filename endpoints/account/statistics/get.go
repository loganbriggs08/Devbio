package statistics

import (
	"devbio/database"
	ReturnModule "devbio/modules/return_module"
	"net/http"
	"strconv"
)

func GetRequest(w http.ResponseWriter, r *http.Request) {
	session := r.Header.Get("session")
	days := r.Header.Get("days")

	if session == "" {
		ReturnModule.MissingData(w, r)
	} else {
		accountUsername := database.GetAccountDataFromSession(session).Username

		if accountUsername == "" {
			ReturnModule.InternalServerError(w, r)
		} else {
			if days == "" {
				statistics, statisticsError := database.GetStatisticsForLastNDays(accountUsername, 1)

				if statisticsError != nil {
					ReturnModule.InternalServerError(w, r)
				} else {
					ReturnModule.Statistics(w, r, statistics)
				}
			} else {
				daysStringToInt, _ := strconv.Atoi(days)
				statistics, statisticsError := database.GetStatisticsForLastNDays(accountUsername, daysStringToInt)

				if statisticsError != nil {
					ReturnModule.InternalServerError(w, r)
				} else {
					ReturnModule.Statistics(w, r, statistics)
				}
			}
		}
	}
}
