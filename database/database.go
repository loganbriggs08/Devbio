package database

import (
	"database/sql"
	"devbio/modules"
	"encoding/json"
	"fmt"

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
