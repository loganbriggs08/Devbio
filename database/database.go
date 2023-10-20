package database

import (
	"database/sql"
	"log"
	"strconv"
	"strings"

	"github.com/lib/pq"
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
            password_hash VARCHAR(255),
            password_salt VARCHAR(25),
			disabled_account BOOLEAN,
        );

		CREATE TABLE IF NOT EXISTS badges (
			username VARCHAR(40),
			badges TEXT,
			FOREIGN KEY (username) REFERENCES accounts(username);
		);
    `)

	if err != nil {
		log.Fatal(err)
		return false
	}
	return true
}
