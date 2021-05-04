import asyncio
import websocket
from websocket import create_connection

server_ip = "67.205.155.37"
websocket.enableTrace(True)
global ws
ws = create_connection("ws://"+server_ip+":8000/v1/nano")
ws.close()


class Timer:
    def __init__(self, timeout, callback):
        self._timeout = timeout
        self._callback = callback
        self._task = asyncio.ensure_future(self._job())

    async def _job(self):
        await asyncio.sleep(self._timeout)
        await self._callback()

    def cancel(self):
        self._task.cancel()


async def timeout_callback():
    await asyncio.sleep(.1)
    global ws
    try:
        x = ws.recv()
    except Exception as e:
        raise Exception("dick penis")
        print("dicks")
        ws = create_connection("ws://"+server_ip+":8000/v1/nano")


async def main():
    print('\nfirst example:')
    timer = Timer(2, timeout_callback)  # set timer for two seconds
    await asyncio.sleep(2.5)  # wait to see timer works
    timer.cancel()

    print('\nsecond example:')
    timer = Timer(2, timeout_callback)  # set timer for two seconds
    await asyncio.sleep(1)
    timer.cancel()  # cancel it
    await asyncio.sleep(1.5) 



loop = asyncio.new_event_loop()
asyncio.set_event_loop(loop)
try:
    loop.run_until_complete(main())
finally:
    loop.run_until_complete(loop.shutdown_asyncgens())
    loop.close()