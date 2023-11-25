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

type GithubsRepositoryResponse struct {
	GitHubUsername        string `json:"owner.login"`
	RepositoryName        string `json:"name"`
	RepositoryDescription string `json:"description"`
	RepositoryURL         string `json:"html_url"`
	Language              string `json:"language"`
	StarCount             int    `json:"stargazers_count"`
}

func GetUserRepositories(accessToken string) ([]GithubsRepositoryResponse, error) {
	req, err := http.NewRequest("GET", "https://api.github.com/user/repos", nil)
	if err != nil {
		return nil, err
	}

	req.Header.Set("Authorization", "Bearer "+accessToken)
	req.Header.Set("Accept", "application/json")

	client := &http.Client{}
	resp, err := client.Do(req)

	fmt.Println(resp)

	if err != nil {
		return nil, err
	}
	defer resp.Body.Close()

	body, err := ioutil.ReadAll(resp.Body)

	fmt.Println(string(body))
	if err != nil {
		return nil, err
	}

	var repositories []GithubsRepositoryResponse
	if err := json.Unmarshal(body, &repositories); err != nil {
		return nil, err
	}

	return repositories, nil
}
