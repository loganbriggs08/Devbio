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
	ProfilePicture  string   `json:"profile_picture"`
	Description     string   `json:"description"`
	Skills          []string `json:"skills"`
	Interests       []string `json:"interests"`
	SpokenLanguages []string `json:"spoken_languages"`
	Badges          []string `json:"badges"`
	IsHirable       bool     `json:"is_hirable"`
	IsDisabled      bool     `json:"is_disabled"`
}
