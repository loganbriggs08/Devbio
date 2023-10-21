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
			is_hireable BOOLEAN,
			is_disabled BOOLEAN,
			password_hash VARCHAR(255),
			password_salt VARCHAR(25)
		);
			
			CREATE TABLE IF NOT EXISTS profile_data (
				profile_id INT AUTO_INCREMENT PRIMARY KEY,
				username VARCHAR(40),
				profile_picture TEXT,
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
		INSERT INTO accounts (username, badges, is_hireable, is_disabled, password_hash, password_salt)
		VALUES (?, ?, ?, ?, ?, ?)
	`, username, string(badgesJSON), false, false, hashedPasswordStruct.HashedPassword, hashedPasswordStruct.RandomSalt)

	if err != nil {
		fmt.Println(err)
		return false
	}

	return true
}

func GetAccountData(sessionToken string) structs.UserResponse {
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

	row = databaseConnection.QueryRow("SELECT username, badges, is_hireable, is_disabled FROM accounts WHERE username = ?", username)

	err := row.Scan(
		&userData.Username,
		&badgesString,
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

	row = databaseConnection.QueryRow("SELECT profile_picture, description, location FROM profile_data WHERE username = ?", username)

	row.Scan(
		&userData.ProfilePicture,
		&userData.Description,
		&userData.Location,
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
	err := databaseConnection.QueryRow("SELECT COUNT(*) FROM accounts WHERE username = ?;", username).Scan(&count)

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
