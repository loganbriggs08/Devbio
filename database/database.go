package database

import (
	"context"
	"database/sql"
	"devbio/modules"
	"devbio/structs"
	"encoding/json"
	"errors"
	"fmt"
	"net/url"
	"time"

	"github.com/jackc/pgx/v4"
	"github.com/jackc/pgx/v4/pgxpool"

	"github.com/pterm/pterm"
)

var databaseConnection *pgxpool.Pool

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
	password := "X5^LYoi12Ebt6pCNG3fdCy&b"
	encodedPassword := url.QueryEscape(password)

	connectionString := fmt.Sprintf("postgres://devbio:%s@167.86.91.24:5432/devbio", encodedPassword)

	poolConfig, err := pgxpool.ParseConfig(connectionString)
	if err != nil {
		fmt.Println("Error parsing connection string:", err)
		return false
	}

	poolConfig.MaxConns = 20
	poolConfig.MinConns = 5
	poolConfig.MaxConnLifetime = 5 * time.Minute
	poolConfig.MaxConnIdleTime = 2 * time.Minute

	databaseConnection, err = pgxpool.ConnectConfig(context.Background(), poolConfig)

	if err != nil {
		fmt.Println("Error connecting to the database:", err)
		return false
	}

	return true
}

func CreateTables() bool {
	_, err := databaseConnection.Exec(context.Background(), `
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
				username VARCHAR(40) PRIMARY KEY,
				profile_picture TEXT,
				banner_picture TEXT,
				banner_color TEXT,
				description VARCHAR(255),
				skills TEXT,
				location TEXT,
				interests TEXT,
				spoken_languages TEXT
			);

			CREATE TABLE IF NOT EXISTS connections (
				connection_type VARCHAR(100),
				username VARCHAR(40),
				is_shown BOOLEAN,
				account_username VARCHAR(40),
				connection_date TIMESTAMP
			);

		CREATE TABLE IF NOT EXISTS sessions (
			username VARCHAR(40),
			session_token VARCHAR(255),
			FOREIGN KEY (username) REFERENCES accounts(username)
		);

		CREATE TABLE IF NOT EXISTS subscriptions (
		    username VARCHAR(40),
		    subscription_type VARCHAR(100),
		    subscription_date TIMESTAMP,
		    FOREIGN KEY (username) REFERENCES accounts(username)
		);

		CREATE TABLE IF NOT EXISTS notifications (
			recipient VARCHAR(40),
			is_for_everyone BOOLEAN,
			message VARCHAR(255)
		);

		CREATE TABLE IF NOT EXISTS statistics (
			username VARCHAR(40),
			profile_views TEXT,
			connections_clicked TEXT,
			FOREIGN KEY (username) REFERENCES profile_data(username) 
		);

		CREATE TABLE IF NOT EXISTS github_access_tokens (
		    username VARCHAR(40),
		    access_token VARCHAR(255),
		    FOREIGN KEY (username) REFERENCES profile_data(username)
		);

		CREATE TABLE IF NOT EXISTS ratelimits (
		    session_token VARCHAR(40),
		    requests_in_last_3_minutes BIGINT,
		    requests_start_time TIMESTAMP
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

	_, err = databaseConnection.Exec(context.Background(), `
		INSERT INTO accounts (username, badges, is_setup, is_hireable, is_disabled, password_hash, password_salt)
		VALUES ($1, $2, $3, $4, $5, $6, $7)
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

	query := "SELECT username FROM sessions WHERE session_token = $1"
	row := databaseConnection.QueryRow(context.Background(), query, sessionToken)

	var username sql.NullString
	if err := row.Scan(&username); err != nil {
		if err == pgx.ErrNoRows {
			return userData
		}
		return userData
	}

	if !username.Valid {
		return userData
	}

	row = databaseConnection.QueryRow(context.Background(), "SELECT username, badges, is_setup, is_hireable, is_disabled FROM accounts WHERE username = $1", username)

	err := row.Scan(
		&userData.Username,
		&badgesString,
		&userData.IsSetup,
		&userData.IsHirable,
		&userData.IsDisabled,
	)

	if err != nil {
		if err == pgx.ErrNoRows {
			return userData
		}
		return userData
	}

	row = databaseConnection.QueryRow(context.Background(), "SELECT profile_picture, description, location, skills, interests, spoken_languages FROM profile_data WHERE username = $1", username)

	row.Scan(
		&userData.ProfilePicture,
		&userData.Description,
		&userData.Location,
		&skillsString,
		&interestsString,
		&spokenLanguagesString,
	)

	if err != nil {
		if errors.Is(err, pgx.ErrNoRows) {
			return userData
		}
		return userData
	}

	if err := json.Unmarshal([]byte(badgesString), &userData.Badges); err != nil {
		pterm.Error.Println("Unmarshalling Error occurred during database retrieval")
	}
	if err := json.Unmarshal([]byte(skillsString), &userData.Skills); err != nil {
		pterm.Error.Println("Unmarshalling Error occurred during database retrieval")
	}
	if err := json.Unmarshal([]byte(interestsString), &userData.Interests); err != nil {
		pterm.Error.Println("Unmarshalling Error occurred during database retrieval")
	}
	if err := json.Unmarshal([]byte(spokenLanguagesString), &userData.SpokenLanguages); err != nil {
		pterm.Error.Println("Unmarshalling Error occurred during database retrieval")
	}

	return userData
}

func GetAccountData(username string) structs.UserResponse {
	var userData structs.UserResponse
	var badgesString, skillsString, interestsString, spokenLanguagesString string

	row := databaseConnection.QueryRow(context.Background(), "SELECT username, badges, is_setup, is_hireable, is_disabled FROM accounts WHERE LOWER(username) = LOWER($1)", username)
	err := row.Scan(
		&userData.Username,
		&badgesString,
		&userData.IsSetup,
		&userData.IsHirable,
		&userData.IsDisabled,
	)

	if err != nil {
		if errors.Is(err, pgx.ErrNoRows) {
			return userData
		}
		fmt.Println(err)
		return userData
	}

	row = databaseConnection.QueryRow(context.Background(), "SELECT profile_picture, description, location, skills, interests, spoken_languages FROM profile_data WHERE LOWER(username) = LOWER($1)", username)

	row.Scan(
		&userData.ProfilePicture,
		&userData.Description,
		&userData.Location,
		&skillsString,
		&interestsString,
		&spokenLanguagesString,
	)

	if err != nil {
		if errors.Is(err, pgx.ErrNoRows) {
			return userData
		}
		return userData
	}

	if err := json.Unmarshal([]byte(badgesString), &userData.Badges); err != nil {
		pterm.Error.Println("Unmarshalling Error occurred during database retrieval")
	}
	if err := json.Unmarshal([]byte(skillsString), &userData.Skills); err != nil {
		pterm.Error.Println("Unmarshalling Error occurred during database retrieval")
	}
	if err := json.Unmarshal([]byte(interestsString), &userData.Interests); err != nil {
		pterm.Error.Println("Unmarshalling Error occurred during database retrieval")
	}
	if err := json.Unmarshal([]byte(spokenLanguagesString), &userData.SpokenLanguages); err != nil {
		pterm.Error.Println("Unmarshalling Error occurred during database retrieval")
	}

	return userData
}

func AccountExists(username string) bool {
	var count int
	err := databaseConnection.QueryRow(context.Background(), "SELECT COUNT(*) FROM accounts WHERE LOWER(username) = LOWER($1);", username).Scan(&count)

	if err != nil {
		return false
	}

	return count > 0
}

func AddSession(username, sessionToken string) bool {
	_, err := databaseConnection.Exec(context.Background(), "DELETE FROM sessions WHERE username = $1;", username)
	if err != nil {
		return false
	}

	_, err = databaseConnection.Exec(context.Background(), "INSERT INTO sessions (username, session_token) VALUES ($1, $2);", username, sessionToken)

	if err != nil {
		return false
	}

	return true
}

func GetPasswordHashAndSalt(username string) structs.HashedAndSaltedPassword {
	var passwordHashAndSalt structs.HashedAndSaltedPassword

	err := databaseConnection.QueryRow(context.Background(), "SELECT password_hash, password_salt FROM accounts WHERE username = $1", username).Scan(&passwordHashAndSalt.HashedPassword, &passwordHashAndSalt.RandomSalt)

	if err != nil {
		if errors.Is(err, pgx.ErrNoRows) {
			return passwordHashAndSalt
		} else {
			return passwordHashAndSalt
		}
	}

	return passwordHashAndSalt
}

func GetAllUsers() ([]string, bool) {
	var userList []string
	rows, err := databaseConnection.Query(context.Background(), "SELECT username FROM accounts WHERE is_hireable = $1", true)

	for rows.Next() {
		var username string

		rowScanError := rows.Scan(&username)

		if rowScanError != nil {
			return userList, true
		}

		userList = append(userList, username)
	}

	if err != nil {
		return userList, true
	}

	return userList, false
}

func GetExploreData(username string) (structs.ExploreData, bool) {
	var exploreData structs.ExploreData

	err := databaseConnection.QueryRow(context.Background(), "SELECT * FROM explore WHERE username = $1", username).
		Scan(&exploreData.Rank, &exploreData.Username, &exploreData.AvgRating, &exploreData.YearsExperience, &exploreData.Commits, &exploreData.OpenProjects, &exploreData.Boosts)

	return exploreData, err != nil
}

func GetProfiles() ([]structs.ExploreData, bool) {
	var users []string
	var profiles []structs.ExploreData

	users, _ = GetAllUsers()

	for i := 0; i < len(users); i++ {
		username := users[i]
		exploreData, err := GetExploreData(username)

		if err {
			fmt.Println(err)
			return profiles, false
		}

		profiles = append(profiles, exploreData)
	}

	return profiles, true
}

func UpdateProfileSetupData(profileData updateRequestSetupData) bool {
	var count int
	err := databaseConnection.QueryRow(context.Background(), "SELECT COUNT(*) FROM profile_data WHERE username = $1;", profileData.Username).Scan(&count)

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
		_, err = databaseConnection.Exec(context.Background(), "UPDATE profile_data SET profile_picture = $1, description = $2, skills = $3, location = $4, interests = $5, spoken_languages = $6 WHERE username = $7;", profileData.ProfilePictureLink, profileData.Description, string(skillsJSON), profileData.Location, string(interestsJSON), string(spokenLanguagesJSON), profileData.Username)

		if err != nil {
			fmt.Println(err)
			return false
		}

		_, err = databaseConnection.Exec(context.Background(), "UPDATE accounts SET is_setup = $1 WHERE username = $2;", true, profileData.Username)

		if err != nil {
			fmt.Println(err)
			return false
		}
	} else {
		_, err = databaseConnection.Exec(context.Background(), "INSERT INTO profile_data (username, profile_picture, description, skills, location, interests, spoken_languages) VALUES ($1, $2, $3, $4, $5, $6, $7);", profileData.Username, profileData.ProfilePictureLink, profileData.Description, string(skillsJSON), profileData.Location, string(interestsJSON), string(spokenLanguagesJSON))

		if err != nil {
			fmt.Println(err)
			return false
		}

		_, err = databaseConnection.Exec(context.Background(), "UPDATE accounts SET is_setup = $1 WHERE username = $2;", true, profileData.Username)

		if err != nil {
			fmt.Println(err)
			return false
		}
	}

	return true
}

func UpdateProfileData(profileData updateRequestData) bool {
	var count int
	err := databaseConnection.QueryRow(context.Background(), "SELECT COUNT(*) FROM profile_data WHERE username = $1;", profileData.Username).Scan(&count)

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
		_, err = databaseConnection.Exec(context.Background(), "UPDATE profile_data SET description = $1, skills = $2, location = $3, interests = $4, spoken_languages = $5 WHERE username = $6;", profileData.Description, string(skillsJSON), profileData.Location, string(interestsJSON), string(spokenLanguagesJSON), profileData.Username)

		if err != nil {
			fmt.Println(err)
			return false
		}

		_, err = databaseConnection.Exec(context.Background(), "UPDATE accounts SET is_setup = $1 WHERE username = $2;", true, profileData.Username)

		if err != nil {
			fmt.Println(err)
			return false
		}
	} else {
		_, err = databaseConnection.Exec(context.Background(), "INSERT INTO profile_data (username, description, skills, location, interests, spoken_languages) VALUES ($1, $2, $3, $4, $5, $6);", profileData.Username, profileData.Description, string(skillsJSON), profileData.Location, string(interestsJSON), string(spokenLanguagesJSON))

		if err != nil {
			fmt.Println(err)
			return false
		}

		_, err = databaseConnection.Exec(context.Background(), "UPDATE accounts SET is_setup = $1 WHERE username = $2;", true, profileData.Username)

		if err != nil {
			fmt.Println(err)
			return false
		}
	}

	return true
}

func GetIsStaff(sessionToken string) bool {
	var username string

	row := databaseConnection.QueryRow(context.Background(), "SELECT username FROM sessions WHERE session_token = $1", sessionToken)

	if err := row.Scan(&username); err != nil {
		if errors.Is(err, pgx.ErrNoRows) {
			fmt.Println("Session not found.")
			return false
		}
		fmt.Println("Error while retrieving username:", err)
		return false
	}

	var isStaff bool
	row = databaseConnection.QueryRow(context.Background(), "SELECT is_staff FROM accounts WHERE username = $1", username)

	if err := row.Scan(&isStaff); err != nil {
		if errors.Is(err, pgx.ErrNoRows) {
			fmt.Println("User not found.")
			return false
		}
		fmt.Println("Error while retrieving is_staff:", err)
		return false
	}

	return isStaff
}

func CreateNotification(recipient string, forEveryone bool, message string) bool {
	_, databaseError := databaseConnection.Exec(context.Background(), "INSERT INTO notifications (recipient, is_for_everyone, message) VALUES($1, $2, $3)", recipient, forEveryone, message)

	if databaseError == nil {
		return true
	} else {
		return false
	}
}

func GetNotifications(username string) []string {
	var notifications []string

	userRows, userError := databaseConnection.Query(context.Background(), "SELECT message FROM notifications WHERE recipient = $1", username)
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

	everyoneRows, everyoneError := databaseConnection.Query(context.Background(), "SELECT message FROM notifications WHERE is_for_everyone = 1")
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

	connectionRows, databaseError := databaseConnection.Query(context.Background(), "SELECT connection_type, username, is_shown, account_username, connection_date FROM connections WHERE username = $1", accountData.Username)

	if databaseError != nil {
		return connections
	}

	for connectionRows.Next() {
		var currentParsedConnection structs.Connection

		rowScanError := connectionRows.Scan(&currentParsedConnection.ConnectionType, &currentParsedConnection.Username, &currentParsedConnection.IsShown, &currentParsedConnection.AccountUsername, &currentParsedConnection.ConnectionDate)

		if rowScanError != nil {
			fmt.Println(rowScanError)
			return connections
		}

		connections = append(connections, currentParsedConnection)
	}

	return connections
}

func AddGithubAccessToken(username string, accessToken string) bool {
	row := databaseConnection.QueryRow(context.Background(), "SELECT username FROM github_access_tokens WHERE username = $1", username)

	var existingUsername string
	if err := row.Scan(&existingUsername); err == pgx.ErrNoRows {
		_, insertError := databaseConnection.Exec(context.Background(), "INSERT INTO github_access_tokens (username, access_token) VALUES ($1, $2)", username, accessToken)

		if insertError != nil {
			fmt.Println(insertError)
			return false
		}

		return true
	} else if err != nil {
		return false
	}

	_, updateError := databaseConnection.Exec(context.Background(), "UPDATE github_access_tokens SET access_token = $1 WHERE username = $2", accessToken, username)

	if updateError != nil {
		fmt.Println(updateError)
		return false
	}

	return true
}

func AddConnection(connectionType string, username string, isShown bool, accountUsername string, connectionDate string) bool {
	tx, err := databaseConnection.Begin(context.Background())
	if err != nil {
		fmt.Println("Error beginning transaction:", err)
		return false
	}
	defer func() {
		if err := recover(); err != nil {
			fmt.Println("Recovered from panic:", err)
		}
	}()
	defer tx.Rollback(context.Background())

	row := tx.QueryRow(context.Background(), "SELECT username FROM connections WHERE connection_type = $1 AND username = $2", connectionType, username)
	var existingUsername string

	if err := row.Scan(&existingUsername); errors.Is(err, pgx.ErrNoRows) {
		_, insertError := tx.Exec(context.Background(), "INSERT INTO connections (connection_type, username, is_shown, account_username, connection_date) VALUES ($1, $2, $3, $4, $5)", connectionType, username, isShown, accountUsername, connectionDate)

		if insertError != nil {
			fmt.Println("Error inserting row:", insertError)
			return false
		}
	} else if err != nil {
		fmt.Println("Error scanning row:", err)
		return false
	} else {
		_, updateError := tx.Exec(context.Background(), "UPDATE connections SET account_username = $1, connection_date = $2 WHERE connection_type = $3 AND username = $4", accountUsername, connectionDate, connectionType, username)

		if updateError != nil {
			fmt.Println("Error updating row:", updateError)
			return false
		}
	}

	if commitErr := tx.Commit(context.Background()); commitErr != nil {
		fmt.Println("Error committing transaction:", commitErr)
		return false
	}

	return true
}

func DeleteConnection(username string, connectionType string) bool {
	_, databaseExecError := databaseConnection.Exec(context.Background(), "DELETE FROM connections WHERE username = $1 AND connection_type = $2", username, connectionType)

	if databaseExecError != nil {
		return false
	} else {
		return true
	}
}

func IsRatelimited(sessionToken string) (bool, error) {
	if sessionToken == "" {
		return false, nil
	}

	if databaseConnection == nil {
		return false, errors.New("databaseConnection is nil")
	}

	// Use a proper context
	ctx := context.Background()

	var requestsInLast3Minutes int64
	var requestsStartTime time.Time

	err := databaseConnection.QueryRow(ctx, "SELECT requests_in_last_3_minutes, requests_start_time FROM ratelimits WHERE session_token = $1", sessionToken).
		Scan(&requestsInLast3Minutes, &requestsStartTime)

	if errors.Is(err, pgx.ErrNoRows) {
		_, err = databaseConnection.Exec(ctx, "INSERT INTO ratelimits (session_token, requests_in_last_3_minutes, requests_start_time) VALUES ($1, 1, CURRENT_TIMESTAMP)", sessionToken)
		if err != nil {
			return false, err
		}
		return false, nil
	} else if err != nil {
		return false, err
	}

	elapsedTime := time.Since(requestsStartTime)

	if elapsedTime > 3*time.Minute {
		_, err := databaseConnection.Exec(ctx, "UPDATE ratelimits SET requests_start_time = CURRENT_TIMESTAMP, requests_in_last_3_minutes = 1 WHERE session_token = $1", sessionToken)
		if err != nil {
			return false, err
		}
		return false, nil
	}

	if requestsInLast3Minutes > 120 {
		return true, nil
	}

	_, err = databaseConnection.Exec(ctx, "UPDATE ratelimits SET requests_in_last_3_minutes = requests_in_last_3_minutes + 1 WHERE session_token = $1", sessionToken)

	if err != nil {
		return false, err
	}

	return false, nil
}

func UpdateStatistics(username string, connectionClicked bool) bool {
	accountData := GetAccountData(username)

	if accountData.Username == "" {
		fmt.Println("Account doesn't exist")
		return false
	}

	currentDate := time.Now().Format("2006-01-02")

	var statistics structs.Statistics
	err := databaseConnection.QueryRow(context.Background(), "SELECT profile_views, connections_clicked FROM statistics WHERE username = $1", username).
		Scan(&statistics.ProfileViews, &statistics.ConnectionsClicked)

	if err != nil && !errors.Is(err, pgx.ErrNoRows) {
		fmt.Println("Error fetching statistics:", err)
		return false
	}

	updateJSONData(&statistics.ProfileViews, currentDate)

	if connectionClicked {
		updateJSONData(&statistics.ConnectionsClicked, currentDate)
	}

	if err := updateOrInsertStatistics(username, statistics.ProfileViews, statistics.ConnectionsClicked); err != nil {
		fmt.Println("Error updating statistics:", err)
		return false
	}

	return true
}

func updateOrInsertStatistics(username string, profileViews, connectionsClicked string) error {
	var existingUsername string
	err := databaseConnection.QueryRow(context.Background(), "SELECT username FROM statistics WHERE username=$1", username).Scan(&existingUsername)

	if errors.Is(err, pgx.ErrNoRows) {
		_, err := databaseConnection.Exec(context.Background(), "INSERT INTO statistics (username, profile_views, connections_clicked) VALUES ($1, $2, $3)",
			username, profileViews, connectionsClicked)
		return err
	} else if err != nil {
		return err
	}

	_, err = databaseConnection.Exec(context.Background(), "UPDATE statistics SET profile_views=$1, connections_clicked=$2 WHERE username=$3",
		profileViews, connectionsClicked, username)

	return err
}

func updateJSONData(jsonStr *string, currentDate string) {
	var jsonData map[string]int

	if *jsonStr == "" {
		jsonData = make(map[string]int)
	} else {
		err := json.Unmarshal([]byte(*jsonStr), &jsonData)
		if err != nil {
			fmt.Println("Error decoding JSON:", err)
			return
		}
	}

	jsonData[currentDate]++

	if len(jsonData) > 365 {
		oldestDate := currentDate
		for date := range jsonData {
			if date < oldestDate {
				oldestDate = date
			}
		}

		delete(jsonData, oldestDate)
	}

	updatedJSON, err := json.Marshal(jsonData)
	if err != nil {
		fmt.Println("Error encoding JSON:", err)
		return
	}

	*jsonStr = string(updatedJSON)
}

func GetStatisticsForLastNDays(username string, n int) ([]structs.Statistics, error) {
	if n > 365 {
		return nil, fmt.Errorf("you can't fetch over 365 days of data")
	}

	var statistics structs.Statistics
	err := databaseConnection.QueryRow(context.Background(), "SELECT profile_views, connections_clicked FROM statistics WHERE username = $1", username).
		Scan(&statistics.ProfileViews, &statistics.ConnectionsClicked)

	if err != nil && !errors.Is(err, pgx.ErrNoRows) {
		return nil, fmt.Errorf("Error fetching statistics: %v", err)
	}

	var result []structs.Statistics
	for i := n - 1; i >= 0; i-- {
		date := time.Now().AddDate(0, 0, -i).Format("2006-01-02")
		statistics.ProfileViews = updateJSONDataForDate(statistics.ProfileViews, date)
		statistics.ConnectionsClicked = updateJSONDataForDate(statistics.ConnectionsClicked, date)

		result = append(result, structs.Statistics{
			Username:           username,
			ProfileViews:       statistics.ProfileViews,
			ConnectionsClicked: statistics.ConnectionsClicked,
		})
	}

	return result, nil
}

func updateJSONDataForDate(jsonStr string, currentDate string) string {
	var jsonData map[string]int

	if jsonStr == "" {
		jsonData = make(map[string]int)
	} else {
		err := json.Unmarshal([]byte(jsonStr), &jsonData)
		if err != nil {
			fmt.Println("Error decoding JSON:", err)
			return jsonStr
		}
	}

	jsonData[currentDate]++

	if len(jsonData) > 365 {
		oldestDate := currentDate
		for date := range jsonData {
			if date < oldestDate {
				oldestDate = date
			}
		}

		delete(jsonData, oldestDate)
	}

	updatedJSON, err := json.Marshal(jsonData)
	if err != nil {
		fmt.Println("Error encoding JSON:", err)
		return jsonStr
	}

	return string(updatedJSON)
}
