package chat

import (
	"github.com/gorilla/websocket"
	"net/http"
)

type dm struct {
	clients map[*Client]bool

	join    chan *Client
	leave   chan *Client
	forward chan []byte
}

func newDM() *dm {
	return &dm{
		forward: make(chan []byte),
		join:    make(chan *Client),
		leave:   make(chan *Client),
		clients: make(map[*Client]bool),
	}
}

func (dm *dm) run() {
	for {
		select {
		case client := <-dm.join:
			dm.clients[client] = true
		case client := <-dm.leave:
			delete(dm.clients, client)
			close(client.receive)
		case msg := <-dm.forward:
			for client := range dm.clients {
				select {
				case client.receive <- msg:
				default:
					close(client.receive)
					delete(dm.clients, client)
				}
			}
		}
	}
}

const (
	sokcetBufferSize  = 1024
	messageBufferSize = 25
)

var upgrader = &websocket.Upgrader{ReadBufferSize: sokcetBufferSize, WriteBufferSize: sokcetBufferSize}

func (d *dm) ServeHttp(w http.ResponseWriter, req *http.Request) {
	socket, err := upgrader.Upgrade(w, req, nil)
	if err != nil {
		return
	}

	client := &Client{
		socket:  socket,
		receive: make(chan []byte, messageBufferSize),
		dm:      d,
	}

	d.join <- client
	defer func() { d.leave <- client }()

	go client.write()
	client.read()
}
