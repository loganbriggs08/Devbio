package modules

import (
	"devbio/structs"
	"github.com/pterm/pterm"
	"math/rand"

	"golang.org/x/crypto/bcrypt"
)

func randomString(length int) (string, error) {
	var realReturnValue string
	const letterBytes = "abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ"

	returnValue := make([]byte, length)

	for i := range returnValue {
		returnValue[i] = letterBytes[rand.Intn(len(letterBytes))]
	}

	realReturnValue = string(returnValue)
	return realReturnValue, nil
}

func HashPassword(password string) structs.HashedAndSaltedPassword {
	var HashedAndSaltedPassword = structs.HashedAndSaltedPassword{}
	var RandomSalt, _ = randomString(15)

	PasswordWithSalt := password + RandomSalt

	hashedPassword, hashedPasswordError := bcrypt.GenerateFromPassword([]byte(PasswordWithSalt), bcrypt.DefaultCost)

	HashedAndSaltedPassword.HashedPassword = string(hashedPassword)
	HashedAndSaltedPassword.RandomSalt = string(RandomSalt)

	if hashedPasswordError != nil {
		pterm.Error.Println(hashedPasswordError)

		return HashedAndSaltedPassword
	}

	return HashedAndSaltedPassword
}

func Unhash(password string, passwordHash string, passwordSalt string) bool {
	saltedPassword := append([]byte(password), []byte(passwordSalt)...)

	err := bcrypt.CompareHashAndPassword([]byte(passwordHash), saltedPassword)

	return err == nil
}
