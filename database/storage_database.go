package database

import (
	"database/sql"
	"errors"

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
		CREATE TABLE IF NOT EXISTS profile_images (
			username VARCHAR(40) PRIMARY KEY,
			image BLOB
		);

		CREATE TABLE IF NOT EXISTS banner_images (
			username VARCHAR(40) PRIMARY KEY,
			image BLOB
		);
	`)

	if err != nil {
		return false
	}

	return true
}

func InsertOrUpdateProfileImage(username string, image []byte) error {
	var existingImage []byte

	err := databaseStorageConnection.QueryRow("SELECT image FROM profile_images WHERE username = ?;", username).Scan(&existingImage)

	switch {
	case errors.Is(err, sql.ErrNoRows):
		_, err := databaseStorageConnection.Exec("INSERT INTO profile_images (username, image) VALUES (?, ?);", username, image)
		if err != nil {
			return err
		}
	case err != nil:
		return err
	default:
		_, err := databaseStorageConnection.Exec("UPDATE profile_images SET image = ? WHERE username = ?;", image, username)
		if err != nil {
			return err
		}
	}

	return nil
}

func GetProfileImageByUsername(username string) ([]byte, error) {
	var image []byte

	err := databaseStorageConnection.QueryRow("SELECT image FROM profile_images WHERE username = ?;", username).Scan(&image)
	if err != nil {
		if err == sql.ErrNoRows {
			return nil, nil
		}
		return nil, err
	}

	return image, nil
}

func DeleteProfileImage(username string) error {
	_, err := databaseStorageConnection.Exec("DELETE FROM profile_images WHERE username = ?;", username)
	if err != nil {
		return err
	}

	return nil
}

func InsertOrUpdateBannerImage(username string, image []byte) error {
	var existingImage []byte
	err := databaseStorageConnection.QueryRow("SELECT image FROM banner_images WHERE username = ?;", username).Scan(&existingImage)

	switch {
	case errors.Is(err, sql.ErrNoRows):
		_, err := databaseStorageConnection.Exec("INSERT INTO banner_images (username, image) VALUES (?, ?);", username, image)
		if err != nil {
			return err
		}
	case err != nil:
		return err
	default:
		_, err := databaseStorageConnection.Exec("UPDATE banner_images SET image = ? WHERE username = ?;", image, username)
		if err != nil {
			return err
		}
	}

	return nil
}

func GetBannerImageByUsername(username string) ([]byte, error) {
	var image []byte

	err := databaseStorageConnection.QueryRow("SELECT image FROM banner_images WHERE username = ?;", username).Scan(&image)
	if err != nil {
		if err == sql.ErrNoRows {
			return nil, nil
		}
		return nil, err
	}

	return image, nil
}

func DeleteBannerImage(username string) error {
	_, err := databaseStorageConnection.Exec("DELETE FROM banner_images WHERE username = ?;", username)
	if err != nil {
		return err
	}

	return nil
}
