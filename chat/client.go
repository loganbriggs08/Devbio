package chat

import (
	"github.com/gorilla/websocket"
)

type Client struct {
	socket  *websocket.Conn
	receive chan []byte

	dm *dm
}

func (c *Client) read() {
	defer c.socket.Close()
	for {
		_, msg, err := c.socket.ReadMessage()
		if err != nil {
			return
		}
		c.dm.forward <- msg
	}
}

func (c *Client) write() {
	defer c.socket.Close()
	for msg := range c.receive {
		err := c.socket.WriteMessage(websocket.TextMessage, msg)
		if err != nil {
			return
		}
	}
}

// dm := newDm()
// go dm.run()
