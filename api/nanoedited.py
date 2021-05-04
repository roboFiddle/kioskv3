import websocket
import json
import threading
import time
from websocket import create_connection
import signal

server_ip = "67.205.155.37"

def handler(signum, frame):
    #global ws
    raise Exception("{}s have elapsed, killing process".format(1))
    ws.close()


def websocket_initialize():
    fat = True
    '''
    ws = websocket.WebSocket()
    ws.connect("ws://"+server_ip+":8000/v1/nano")
    '''
    global ws
    websocket.enableTrace(True)
    ws = create_connection("ws://"+server_ip+":8000/v1/nano")
    ws.send(json.dumps({"id":"1"}))
    print("Connected to server")
    ws.close()
    def do():
        signal.signal(signal.SIGALRM, handler)
        signal.alarm(.01)
        global ws
        try:
            x = ws.recv()
            print("here")
        except Exception as e:
            print(e)
            print("yeet")
            ws = create_connection("ws://"+server_ip+":8000/v1/nano")
        '''
        ws.send(json.dumps({"best_match": "Liam Pilarski"}))
        ws.close()
        print(ws)
        print(ws.recv())
        print("done")
        '''
    while True:
        try:
            do()
        except Exception as e:
            print(e)
        print("done")


websocket_initialize()
