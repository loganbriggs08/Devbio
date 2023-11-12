package database

import (
	"database/sql"
	"devbio/modules"
	"devbio/structs"
	"encoding/json"
	"errors"
	"fmt"
	_ "github.com/mattn/go-sqlite3"
	"log"
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
			is_staff BOOLEAN,
			password_hash VARCHAR(255),
			password_salt VARCHAR(25)
		);
			
			CREATE TABLE IF NOT EXISTS profile_data (
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
				connection_type VARCHAR(100),
				username VARCHAR(40),
				is_shown BOOLEAN,
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

		CREATE TABLE IF NOT EXISTS subscriptions (
		    username VARCHAR(40),
		    subscription_type VARCHAR(100),
		    subscription_date DATETIME,
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

		CREATE TABLE IF NOT EXISTS statistics (
			USERNAME VARCHAR(40),
			profile_views TEXT,
			profile_views_countries TEXT,
			FOREIGN KEY (username) REFERENCES profile_data(username) 
		);

		CREATE TABLE IF NOT EXISTS github_access_tokens (
		    username VARCHAR(40),
		    access_token VARCHAR(255),
		    FOREIGN KEY (username) REFERENCES profile_data(username)
		);

		CREATE TABLE IF NOT EXISTS ratelimits (
		    username VARCHAR(40),
		    request_count BIGINT,
		    
		    FOREIGN KEY (username) REFERENCES profile_data(username)
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
		if errors.Is(err, sql.ErrNoRows) {
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

func GetIsStaff(sessionToken string) bool {
	var username string

	query := "SELECT username FROM sessions WHERE session_token = ?"
	row := databaseConnection.QueryRow(query, sessionToken)

	if err := row.Scan(&username); err != nil {
		if errors.Is(err, sql.ErrNoRows) {
			fmt.Println("Session not found.")
			return false
		}
		fmt.Println("Error while retrieving username:", err)
		return false
	}

	var isStaff bool
	row = databaseConnection.QueryRow("SELECT is_staff FROM accounts WHERE username = ?", username)

	if err := row.Scan(&isStaff); err != nil {
		if errors.Is(err, sql.ErrNoRows) {
			fmt.Println("User not found.")
			return false
		}
		fmt.Println("Error while retrieving is_staff:", err)
		return false
	}

	return isStaff
}

func CreateNotification(recipient string, forEveryone bool, message string) bool {
	_, databaseError := databaseConnection.Exec("INSERT INTO notifications (recipient, is_for_everyone, message) VALUES(?, ?, ?)", recipient, forEveryone, message)

	if databaseError == nil {
		return true
	} else {
		return false
	}
}

func GetNotifications(username string) []string {
	var notifications []string

	userRows, userError := databaseConnection.Query("SELECT message FROM notifications WHERE recipient = ?", username)
	if userError != nil {
		return notifications
	}
	defer userRows.Close()

	for userRows.Next() {
		var message string
		if err := userRows.Scan(&message); err != nil {
			return notifications
		}
		notifications = append(notifications, message)
	}

	everyoneRows, everyoneError := databaseConnection.Query("SELECT message FROM notifications WHERE is_for_everyone = 1")
	if everyoneError != nil {
		return notifications
	}
	defer everyoneRows.Close()

	for everyoneRows.Next() {
		var message string
		if err := everyoneRows.Scan(&message); err != nil {
			return notifications
		}
		notifications = append(notifications, message)
	}

	return notifications
}

func GetConnectionsBySessionID(sessionToken string) []structs.Connection {
	var connections []structs.Connection

	accountData := GetAccountDataFromSession(sessionToken)

	if accountData.Username == "" {
		return connections
	}

	connectionRows, databaseError := databaseConnection.Query("SELECT connection_type, username, is_shown, account_username, connection_date FROM connections WHERE username = ?", accountData.Username)

	if databaseError != nil {
		return connections
	}

	for connectionRows.Next() {
		var currentParsedConnection structs.Connection

		rowScanError := connectionRows.Scan(&currentParsedConnection.ConnectionType, &currentParsedConnection.Username, &currentParsedConnection.IsShown, &currentParsedConnection.AccountUsername, &currentParsedConnection.ConnectionDate)

		if rowScanError != nil {
			return connections
		}

		connections = append(connections, currentParsedConnection)
	}

	return connections
}

func AddGithubAccessToken(username string, accessToken string) bool {
	row := databaseConnection.QueryRow("SELECT username FROM github_access_tokens WHERE username = ?", username)

	var existingUsername string
	if err := row.Scan(&existingUsername); err == sql.ErrNoRows {
		_, insertError := databaseConnection.Exec("INSERT INTO github_access_tokens (username, access_token) VALUES (?, ?)", username, accessToken)

		if insertError != nil {
			fmt.Println(insertError)
			return false
		}

		return true
	} else if err != nil {
		return false
	}

	_, updateError := databaseConnection.Exec("UPDATE github_access_tokens SET access_token = ? WHERE username = ?", accessToken, username)

	if updateError != nil {
		fmt.Println(updateError)
		return false
	}

	return true
}

func AddConnection(connectionType string, username string, isShown bool, accountUsername string, connectionDate string) bool {
	row := databaseConnection.QueryRow("SELECT username FROM connections WHERE connection_type = ? AND username = ?", connectionType, username)

	var existingUsername string

	if err := row.Scan(&existingUsername); errors.Is(err, sql.ErrNoRows) {
		_, insertError := databaseConnection.Exec("INSERT INTO connections (connection_type, username, is_shown, account_username, connection_date) VALUES (?, ?, ?, ?, ?)", connectionType, username, isShown, accountUsername, connectionDate)

		if insertError != nil {
			fmt.Println(insertError)
			return false
		}

		return true
	} else if err != nil {
		fmt.Println(err)
		return false
	}

	_, updateError := databaseConnection.Exec("UPDATE connections SET account_username = ?, connection_date = ? WHERE connection_type = ? AND username = ?", accountUsername, connectionDate, connectionType, username)

	if updateError != nil {
		fmt.Println(updateError)
		return false
	}

	return true
}

func DeleteConnection(username string, connectionType string) bool {
	_, databaseExecError := databaseConnection.Exec("DELETE FROM connections WHERE username = ? AND connection_type = ?", username, connectionType)

	if databaseExecError != nil {
		return false
	} else {
		return true
	}
}
