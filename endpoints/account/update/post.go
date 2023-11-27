package update

import (
	"devbio/database"
	ReturnModule "devbio/modules/return_module"
	"encoding/json"
	"net/http"
)

var languages = []string{
	"English",
	"German",
	"Danish",
	"Spanish",
	"French",
	"Croatian",
	"Italian",
	"Lithuanian",
	"Hungarian",
	"Dutch",
	"Norwegian",
	"Polish",
	"Portuguese",
	"Romainian",
	"Swedish",
	"Vietnamese",
	"Turkish",
	"Czech",
	"Greek",
	"Bulgarian",
	"Russian",
	"Ukrainian",
	"Hindi",
	"Thai",
	"Chinese",
	"Japanese",
	"Korean",
}

var skills = []string{
	"JavaScript",
	"Python",
	"Java",
	"C++",
	"C#",
	"Ruby",
	"Swift",
	"Kotlin",
	"PHP",
	"Go",
	"TypeScript",
	"Rust",
	"Scala",
	"Perl",
	"Haskell",
	"Lua",
	"Objective-C",
	"Dart",
	"Elixir",
	"R",
	"Clojure",
	"Groovy",
	"SQL",
	"Assembly",
	"HTML/CSS",
	"Shell Scripting",
	"VHDL",
	"Verilog",
	"Matlab",
	"Fortran",
	"COBOL",
	"PL/SQL",
	"Ada",
	"Lisp",
	"Prolog",
	"COOL",
	"D",
	"F#",
	"Racket",
	"Erlang",
	"Julia",
	"Scratch",
	"Bash",
	"PowerShell",
	"ABAP",
	"VBScript",
	"Pascal",
	"Photoshop",
	"Figma",
}

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
			Colour             int64    `json:"selected_colour"`
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
			updateRequestData.ProfilePictureLink = "http://localhost:6969/api/storage/profile/icon/" + accountDataResult.Username

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
			Colour          int64    `json:"selected_colour"`
		}

		decoder := json.NewDecoder(r.Body)

		if err := decoder.Decode(&updateRequestData); err != nil {
			ReturnModule.InternalServerError(w, r)
			return
		}

		accountDataResult := database.GetAccountDataFromSession(accountSession)
		updateRequestData.Username = accountDataResult.Username

		for _, skill := range updateRequestData.Skills {
			if !containsString(skill, skills) {
				continue
			}
		}

		for _, language := range updateRequestData.SpokenLanguages {
			if !containsString(language, languages) {
				continue
			}
		}

		for _, interest := range updateRequestData.Interests {
			if len(interest) > 50 {
				continue
			}
		}

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

func containsString(str string, list []string) bool {
	for _, v := range list {
		if v == str {
			return true
		}
	}
	return false
}
