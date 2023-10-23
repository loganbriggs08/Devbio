package explore

import (
	"devbio/database"
	"devbio/structs"
	"sort"
)

func _() structs.ExploreResponse {
	var exploreResponse structs.ExploreResponse
	var exploreDataFinal []structs.ExploreData
	userResponses, didRunIntoError := database.GetAllUsers()

	if didRunIntoError {
		var emptyUserResponses structs.ExploreResponse
		return emptyUserResponses
	}

	for _, user := range userResponses {
		userExploreData, hasError := database.GetExploreData(user)
		if hasError {
			break
		}
		userExploreData.Rank = CalculateRank(userExploreData)
		exploreDataFinal = append(exploreDataFinal, userExploreData)
	}

	sort.Slice(exploreDataFinal, func(i, j int) bool {
		return exploreDataFinal[i].Rank > exploreDataFinal[j].Rank
	})

	exploreResponse.ExploreData = exploreDataFinal

	return exploreResponse
}

func CalculateRank(exploreData structs.ExploreData) float64 {
	return float64(exploreData.AvgRating*2 + float32(exploreData.YearsExperience) + float32(exploreData.Commits)/1000 + float32(exploreData.Boosts)*5)
}
