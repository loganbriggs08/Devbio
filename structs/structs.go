package structs

type ErrorResponse struct {
	ErrorCode    int    `json:"error_code"`
	ErrorMessage string `json:"error_message"`
}

type HashedAndSaltedPassword struct {
	HashedPassword string
	RandomSalt     string
}

type SessionCreated struct {
	SessionAuthentication string `json:"session_authentication"`
}

type UserResponse struct {
	Username        string   `json:"username"`
	ProfilePicture  []byte   `json:"profile_picture"`
	Description     string   `json:"description"`
	Skills          []string `json:"skills"`
	Interests       []string `json:"interests"`
	Location        string   `json:"location"`
	SpokenLanguages []string `json:"spoken_languages"`
	Badges          []string `json:"badges"`
	IsSetup         bool     `json:"is_setup"`
	IsHirable       bool     `json:"is_hirable"`
	IsDisabled      bool     `json:"is_disabled"`
}

type SuccessResponse struct {
	Success bool `json:"success"`
}

type ExploreData struct {
	Rank            float64 `json:"rank"`
	Username        string  `json:"username"`
	AvgRating       float32 `json:"avg_rating"`
	YearsExperience int     `json:"years_experience"`
	Commits         int     `json:"commits"`
	OpenProjects    int     `json:"open_projects"`
	Boosts          int     `json:"boosts"`
}

type ExploreResponse struct {
	ExploreData []ExploreData
}
