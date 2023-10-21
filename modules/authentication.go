package modules

import (
	"devbio/modules/base64"
	"devbio/modules/random"
	"devbio/modules/time"
	"strconv"
)

func GenerateAuthentication(username string) string {
	return base64.Encode(username) + "." + base64.Encode(strconv.Itoa(int(time.Since_Epoch()))) + "." + base64.Encode(random.String(25))
}
