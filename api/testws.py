import websocket
import json

ws = websocket.WebSocket()
ws.connect("ws://172.31.217.136:8000/v1/nano")
ws.send(json.dumps({"id":"1"}))
ws.send(json.dumps({"best_match":"Liam Pilarski"}))
while True:
	print(ws.recv())
	while True:
		print("hi")