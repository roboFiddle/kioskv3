import websocket
import json
try:
    import thread
except ImportError:
    import _thread as thread
import time

signal = True

def change():
    global signal
    signal = not signal

def get():
    global signal
    return signal

def on_message(ws, message):
    message = json.loads(message)
    print(message)
    change()

def on_error(ws, error):
    print(error)

def on_close(ws):
    print("### closed ###")

def on_open(ws):
    pass


if __name__ == "__main__":
    websocket.enableTrace(True)
    ws = websocket.WebSocketApp("ws://67.205.155.37:8000/users",
                              on_message = lambda ws,msg: on_message(ws, msg),
                              on_error = on_error,
                              on_close = on_close)
    ws.on_open = on_open
    ws.run_forever()