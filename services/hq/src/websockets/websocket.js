let setNSP = (gameIo) => {
    let state = null;
    let turnCountdown = {};
    let { eventEmitter } = require('../../config/appConfig');
    let auth = require('../middlewares/auth');
    console.log(`socket server listening on NameSpace : ${gameIo.name}`);
    //const { mainGameLoop, startDraw } = require('../casino/keno/keno');
    //mainGameLoop();
    function fancyTimeFormat(duration) {
        // Hours, minutes and seconds
        const hrs = ~~(duration / 3600);
        const mins = ~~((duration % 3600) / 60);
        const secs = ~~duration % 60;

        // Output like "1:01" or "4:03:59" or "123:03:59"
        let ret = "";

        if (hrs > 0) {
            ret += "" + hrs + ":" + (mins < 10 ? "0" : "");
        }

        ret += "" + mins + ":" + (secs < 10 ? "0" : "");
        ret += "" + secs;

        return ret;
    }
    gameIo.use(auth.isAuthorizedSocket).on('connection', async (socket) => {
        /**
         * Connection Handler.
        **/
        console.log('user connected');
        console.log(`one socket connected:${socket.id} with user_id:${socket.id}`);
        /**
         * Socket Events For Application Logic.
        **/
        socket.on('get-current-state', async () => {
            gameIo.emit("current-state", {
                state: state
            });
        })
        /**
         * Disconnection Handler.
        **/
        socket.on('disconnect', async () => {
            console.log(`one socket disconnected:${socket.id} with user_id:${socket.id}`);
        });
    });

    eventEmitter.on('start-timer', (round_id) => {
        state = 1;
        gameIo.emit("start-timer", null);
        setTimeout(() => {
            let counter = process.env.TURNTIME;
            console.log(`Timer started for round ${round_id} Counter : ${counter}`);
            turnCountdown = setInterval(function () {
                gameIo.emit("update-timer", { next_draw_id: round_id, counter: fancyTimeFormat(counter) });
                counter--
                //console.log(`Counter : ${counter}`);
                if (counter == 0) {
                    console.log(`Timer stopped for ${round_id} :: starting draw`);
                    clearInterval(turnCountdown);
                    gameIo.emit("update-timer", { next_draw_id: round_id, counter: fancyTimeFormat(counter) });
                    startDraw();
                }
            }, 1000);
        }, 2500)
    });

    eventEmitter.on('start-draw', (queue) => {
        state = 2;
        gameIo.emit("start-draw", null);
        setTimeout(() => {
            for (let i = 0; i < queue.size; i++) {
                setTimeout(() => {
                    let data = queue.dequeue();
                    if (data.event == "start-draw") {
                        gameIo.emit("update-draw", data.data.data);
                    } else {
                        eventEmitter.emit("stop-draw", data.data);
                    }
                }, i * 2500);
            }
        }, 2500)
    });

    eventEmitter.on('stop-draw', (draw) => {
        state = 3;
        setTimeout(() => {
            gameIo.emit("stop-draw", draw);
        }, 3000);

        setTimeout(() => {
            mainGameLoop();
        }, 30 * 1000);
    });
}
module.exports = {
    setNSP: setNSP
}