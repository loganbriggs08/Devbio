package github

import (
	"encoding/json"
	"fmt"
	"io/ioutil"
	"net/http"
	"net/url"
	"strings"
)

func ExchangeCodeForAccessToken(clientID, clientSecret, code, redirectURI string) (string, error) {
	payload := url.Values{}
	payload.Set("client_id", clientID)
	payload.Set("client_secret", clientSecret)
	payload.Set("code", code)
	payload.Set("redirect_uri", redirectURI)

	req, err := http.NewRequest("POST", "https://github.com/login/oauth/access_token", strings.NewReader(payload.Encode()))

	if err != nil {
		return "", err
	}

	req.Header.Set("Content-Type", "application/x-www-form-urlencoded")
	req.Header.Set("Accept", "application/json")

	client := &http.Client{}
	resp, err := client.Do(req)
	if err != nil {
		return "", err
	}
	defer resp.Body.Close()

	body, err := ioutil.ReadAll(resp.Body)
	if err != nil {
		return "", err
	}

	accessToken, err := parseAccessTokenResponse(body)
	if err != nil {
		return "", err
	}

	return accessToken, nil
}

func parseAccessTokenResponse(response []byte) (string, error) {
	var data map[string]interface{}
	if err := json.Unmarshal(response, &data); err != nil {
		return "", err
	}

	accessToken, ok := data["access_token"].(string)
	if !ok {
		return "", fmt.Errorf("unable to extract access token from response")
	}

	return accessToken, nil
}

func GetGitHubUsername(accessToken string) (string, error) {
	req, err := http.NewRequest("GET", "https://api.github.com/user", nil)
	if err != nil {
		return "", err
	}

	req.Header.Set("Authorization", "Bearer "+accessToken)
	req.Header.Set("Accept", "application/json")

	client := &http.Client{}
	resp, err := client.Do(req)
	if err != nil {
		return "", err
	}
	defer resp.Body.Close()

	body, err := ioutil.ReadAll(resp.Body)
	if err != nil {
		return "", err
	}

	var userData map[string]interface{}
	if err := json.Unmarshal(body, &userData); err != nil {
		return "", err
	}

	username, ok := userData["login"].(string)
	if !ok {
		return "", fmt.Errorf("unable to extract username from GitHub API response")
	}

	return username, nil
}
