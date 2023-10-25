package database

import (
	"database/sql"
	_ "github.com/mattn/go-sqlite3"
)

var databaseStorageConnection *sql.DB

func InitializeStorageDatabase() bool {
	connection, databaseConnectionError := sql.Open("sqlite3", "storage_database.db")

	if databaseConnectionError != nil {
		return false
	} else {
		databaseStorageConnection = connection
		return true
	}
}

func CreateStorageTables() bool {
	_, err := databaseStorageConnection.Exec(`
		CREATE TABLE IF NOT EXISTS images (
			username VARCHAR(40) PRIMARY KEY,
			image BLOB
		);
	`)

	if err != nil {
		return false
	}

	return true
}
