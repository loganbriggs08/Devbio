package database

import (
	"database/sql"

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
			disabled_account BOOLEAN,
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

			CREATE TABLE IF NOT EXISTS badges (
				badge_id INT AUTO_INCREMENT PRIMARY KEY,
				username VARCHAR(40),
				badge_name VARCHAR(255),
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
