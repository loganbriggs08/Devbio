package database

import (
	"database/sql"
	"devbio/modules"
	"devbio/structs"
	"encoding/json"
	"fmt"
	"log"

	_ "github.com/mattn/go-sqlite3"
)

var databaseConnection *sql.DB

type updateRequestSetupData struct {
	Username           string
	ProfilePicture     []byte   `json:"profile_picture"`
	Description        string   `json:"description"`
	Skills             []string `json:"skills"`
	Location           string   `json:"location"`
	Interests          []string `json:"interests"`
	SpokenLanguages    []string `json:"spoken_languages"`
	ProfilePictureLink string   `json:"profile_picture_link"`
}

type updateRequestData struct {
	Username        string
	Description     string   `json:"description"`
	Skills          []string `json:"skills"`
	Location        string   `json:"location"`
	Interests       []string `json:"interests"`
	SpokenLanguages []string `json:"spoken_languages"`
}

func InitializeDatabase() bool {
	connection, databaseConnectionError := sql.Open("sqlite3", "database.db")

	if databaseConnectionError != nil {
		return false
	} else {
		databaseConnection = connection
		return true
	}
}

func CreateTables() bool {
	_, err := databaseConnection.Exec(`
		CREATE TABLE IF NOT EXISTS accounts (
			username VARCHAR(40) PRIMARY KEY,
			badges TEXT,
			is_setup BOOLEAN,
			is_hireable BOOLEAN,
			is_disabled BOOLEAN,
			password_hash VARCHAR(255),
			password_salt VARCHAR(25)
		);
			
			CREATE TABLE IF NOT EXISTS profile_data (
				profile_id INT AUTO_INCREMENT PRIMARY KEY,
				username VARCHAR(40),
				profile_picture TEXT,
				banner_picture TEXT,
				banner_color TEXT,
				description VARCHAR(255),
				skills TEXT,
				location TEXT,
				interests TEXT,
				spoken_languages TEXT,
				FOREIGN KEY (username) REFERENCES accounts(username)
			);

			CREATE TABLE IF NOT EXISTS connections (
				connection_id INT AUTO_INCREMENT PRIMARY KEY,
				username VARCHAR(40),
				account_username VARCHAR(40),
				connection_date DATETIME,
				FOREIGN KEY (username) REFERENCES profile_data(username),
				FOREIGN KEY (account_username) REFERENCES accounts(username)
			);

		CREATE TABLE IF NOT EXISTS sessions (
			username VARCHAR(40),
			session_token VARCHAR(255),
			FOREIGN KEY (username) REFERENCES accounts(username)
		);

		CREATE TABLE IF NOT EXISTS explore (
		    username VARCHAR(40),
			rank INT,
			avg_rating FLOAT,
			years_experience FLOAT,
			commits INT,
			open_projects INT,
			boosts INT,
			FOREIGN KEY (boosts) REFERENCES boosts(boosts),
		    FOREIGN KEY (username) REFERENCES profile_data(username)
		);

		CREATE TABLE IF NOT EXISTS boosts (
		    username VARCHAR(40),
			boosts INT,
			used_boosts INT,
		    FOREIGN KEY (username) REFERENCES profile_data(username)
		);

		CREATE TABLE IF NOT EXISTS notifications (
			recipient VARCHAR(40),
			is_for_everyone BOOLEAN,
			message VARCHAR(255)
		);
	`)

	if err != nil {
		return false
	}

	return true
}

func CreateAccount(username, password string) bool {
	var badges []string
	hashedPasswordStruct := modules.HashPassword(password)

	badges = append(badges, "Beta User")

	badgesJSON, err := json.Marshal(badges)
	if err != nil {
		fmt.Println(err)
		return false
	}

	_, err = databaseConnection.Exec(`
		INSERT INTO accounts (username, badges, is_setup, is_hireable, is_disabled, password_hash, password_salt)
		VALUES (?, ?, ?, ?, ?, ?, ?)
	`, username, string(badgesJSON), false, false, false, hashedPasswordStruct.HashedPassword, hashedPasswordStruct.RandomSalt)

	if err != nil {
		fmt.Println(err)
		return false
	}

	return true
}

func GetAccountDataFromSession(sessionToken string) structs.UserResponse {
	var userData structs.UserResponse
	var badgesString, skillsString, interestsString, spokenLanguagesString string

	query := "SELECT username FROM sessions WHERE session_token = ?"
	row := databaseConnection.QueryRow(query, sessionToken)

	var username sql.NullString
	if err := row.Scan(&username); err != nil {
		if err == sql.ErrNoRows {
			return userData
		}
		log.Println("Error while retrieving username:", err)
		return userData
	}

	if !username.Valid {
		return userData
	}

	row = databaseConnection.QueryRow("SELECT username, badges, is_setup, is_hireable, is_disabled FROM accounts WHERE username = ?", username)

	err := row.Scan(
		&userData.Username,
		&badgesString,
		&userData.IsSetup,
		&userData.IsHirable,
		&userData.IsDisabled,
	)

	if err != nil {
		if err == sql.ErrNoRows {
			return userData
		}
		log.Println("Error while scanning data:", err)
		return userData
	}

	row = databaseConnection.QueryRow("SELECT profile_picture, description, location, skills, interests, spoken_languages FROM profile_data WHERE username = ?", username)

	row.Scan(
		&userData.ProfilePicture,
		&userData.Description,
		&userData.Location,
		&skillsString,
		&interestsString,
		&spokenLanguagesString,
	)

	if err != nil {
		if err == sql.ErrNoRows {
			return userData
		}
		log.Println("Error while scanning data:", err)
		return userData
	}

	if err := json.Unmarshal([]byte(badgesString), &userData.Badges); err != nil {
		log.Println("Error while unmarshaling badges:", err)
	}
	if err := json.Unmarshal([]byte(skillsString), &userData.Skills); err != nil {
		log.Println("Error while unmarshaling skills:", err)
	}
	if err := json.Unmarshal([]byte(interestsString), &userData.Interests); err != nil {
		log.Println("Error while unmarshaling interests:", err)
	}
	if err := json.Unmarshal([]byte(spokenLanguagesString), &userData.SpokenLanguages); err != nil {
		log.Println("Error while unmarshaling spoken languages:", err)
	}

	return userData
}

func GetAccountData(username string) structs.UserResponse {
	var userData structs.UserResponse
	var badgesString, skillsString, interestsString, spokenLanguagesString string

	row := databaseConnection.QueryRow("SELECT username, badges, is_setup, is_hireable, is_disabled FROM accounts WHERE username = ?", username)

	err := row.Scan(
		&userData.Username,
		&badgesString,
		&userData.IsSetup,
		&userData.IsHirable,
		&userData.IsDisabled,
	)

	if err != nil {
		if err == sql.ErrNoRows {
			return userData
		}
		log.Println("Error while scanning data:", err)
		return userData
	}

	row = databaseConnection.QueryRow("SELECT profile_picture, description, location, skills, interests, spoken_languages FROM profile_data WHERE username = ?", username)

	row.Scan(
		&userData.ProfilePicture,
		&userData.Description,
		&userData.Location,
		&skillsString,
		&interestsString,
		&spokenLanguagesString,
	)

	if err != nil {
		if err == sql.ErrNoRows {
			return userData
		}
		log.Println("Error while scanning data:", err)
		return userData
	}

	if err := json.Unmarshal([]byte(badgesString), &userData.Badges); err != nil {
		log.Println("Error while unmarshaling badges:", err)
	}
	if err := json.Unmarshal([]byte(skillsString), &userData.Skills); err != nil {
		log.Println("Error while unmarshaling skills:", err)
	}
	if err := json.Unmarshal([]byte(interestsString), &userData.Interests); err != nil {
		log.Println("Error while unmarshaling interests:", err)
	}
	if err := json.Unmarshal([]byte(spokenLanguagesString), &userData.SpokenLanguages); err != nil {
		log.Println("Error while unmarshaling spoken languages:", err)
	}

	return userData
}

func AccountExists(username string) bool {
	var count int
	err := databaseConnection.QueryRow("SELECT COUNT(*) FROM accounts WHERE LOWER(username) = LOWER(?);", username).Scan(&count)

	if err != nil {
		return false
	}

	return count > 0
}

func AddSession(username, sessionToken string) bool {
	_, err := databaseConnection.Exec("DELETE FROM sessions WHERE username = ?;", username)
	if err != nil {
		return false
	}

	_, err = databaseConnection.Exec("INSERT INTO sessions (username, session_token) VALUES (?, ?);", username, sessionToken)

	if err != nil {
		return false
	}

	return true
}

func GetPasswordHashAndSalt(username string) structs.HashedAndSaltedPassword {
	var passwordHashAndSalt structs.HashedAndSaltedPassword

	err := databaseConnection.QueryRow("SELECT password_hash, password_salt FROM accounts WHERE username = ?", username).Scan(&passwordHashAndSalt.HashedPassword, &passwordHashAndSalt.RandomSalt)

	if err != nil {
		if err == sql.ErrNoRows {
			return passwordHashAndSalt
		} else {
			log.Fatal(err)
			return passwordHashAndSalt
		}
	}

	return passwordHashAndSalt
}

func GetAllUsers() ([]string, bool) {
	var userList []string
	rows, err := databaseConnection.Query("SELECT username FROM accounts WHERE is_hireable = ?", true)

	for rows.Next() {
		var username string

		rowScanError := rows.Scan(&username)

		if rowScanError != nil {
			return userList, true
		}

		userList = append(userList, username)
	}

	if err != nil {
		fmt.Println(err)
		return userList, true
	}

	return userList, false
}

func GetExploreData(username string) (structs.ExploreData, bool) {
	var exploreData structs.ExploreData

	err := databaseConnection.QueryRow("SELECT * FROM explore WHERE username = ?", username).Scan(&exploreData.Rank, &exploreData.Username, &exploreData.AvgRating, &exploreData.YearsExperience, &exploreData.Commits, &exploreData.OpenProjects, &exploreData.Boosts)

	if err != nil {
		fmt.Println(err)
		return exploreData, true
	}

	return exploreData, false
}

func UpdateProfileSetupData(profileData updateRequestSetupData) bool {
	var count int
	err := databaseConnection.QueryRow("SELECT COUNT(*) FROM profile_data WHERE username = ?;", profileData.Username).Scan(&count)

	if err != nil {
		fmt.Println(err)
		return false
	}

	skillsJSON, err := json.Marshal(profileData.Skills)
	if err != nil {
		fmt.Println(err)
		return false
	}

	interestsJSON, err := json.Marshal(profileData.Interests)
	if err != nil {
		fmt.Println(err)
		return false
	}

	spokenLanguagesJSON, err := json.Marshal(profileData.SpokenLanguages)
	if err != nil {
		fmt.Println(err)
		return false
	}

	if count > 0 {
		_, err = databaseConnection.Exec("UPDATE profile_data SET profile_picture = ?, description = ?, skills = ?, location = ?, interests = ?, spoken_languages = ? WHERE username = ?;", profileData.ProfilePictureLink, profileData.Description, string(skillsJSON), profileData.Location, string(interestsJSON), string(spokenLanguagesJSON), profileData.Username)

		if err != nil {
			fmt.Println(err)
			return false
		}

		_, err = databaseConnection.Exec("UPDATE accounts SET is_setup = ? WHERE username = ?;", 1, profileData.Username)

		if err != nil {
			fmt.Println(err)
			return false
		}
	} else {
		_, err = databaseConnection.Exec("INSERT INTO profile_data (username, profile_picture, description, skills, location, interests, spoken_languages) VALUES (?, ?, ?, ?, ?, ?, ?);", profileData.Username, profileData.ProfilePictureLink, profileData.Description, string(skillsJSON), profileData.Location, string(interestsJSON), string(spokenLanguagesJSON))

		if err != nil {
			fmt.Println(err)
			return false
		}

		_, err = databaseConnection.Exec("UPDATE accounts SET is_setup = ? WHERE username = ?;", 1, profileData.Username)

		if err != nil {
			fmt.Println(err)
			return false
		}
	}

	return true
}

func UpdateProfileData(profileData updateRequestData) bool {
	var count int
	err := databaseConnection.QueryRow("SELECT COUNT(*) FROM profile_data WHERE username = ?;", profileData.Username).Scan(&count)

	if err != nil {
		fmt.Println(err)
		return false
	}

	skillsJSON, err := json.Marshal(profileData.Skills)
	if err != nil {
		fmt.Println(err)
		return false
	}

	interestsJSON, err := json.Marshal(profileData.Interests)
	if err != nil {
		fmt.Println(err)
		return false
	}

	spokenLanguagesJSON, err := json.Marshal(profileData.SpokenLanguages)
	if err != nil {
		fmt.Println(err)
		return false
	}

	if count > 0 {
		_, err = databaseConnection.Exec("UPDATE profile_data SET description = ?, skills = ?, location = ?, interests = ?, spoken_languages = ? WHERE username = ?;", profileData.Description, string(skillsJSON), profileData.Location, string(interestsJSON), string(spokenLanguagesJSON), profileData.Username)

		if err != nil {
			fmt.Println(err)
			return false
		}

		_, err = databaseConnection.Exec("UPDATE accounts SET is_setup = ? WHERE username = ?;", 1, profileData.Username)

		if err != nil {
			fmt.Println(err)
			return false
		}
	} else {
		_, err = databaseConnection.Exec("INSERT INTO profile_data (username, description, skills, location, interests, spoken_languages) VALUES (?, ?, ?, ?, ?, ?, ?);", profileData.Username, profileData.Description, string(skillsJSON), profileData.Location, string(interestsJSON), string(spokenLanguagesJSON))

		if err != nil {
			fmt.Println(err)
			return false
		}

		_, err = databaseConnection.Exec("UPDATE accounts SET is_setup = ? WHERE username = ?;", 1, profileData.Username)

		if err != nil {
			fmt.Println(err)
			return false
		}
	}

	return true
}
