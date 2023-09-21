const http = require('http');
// const ws = require('../socket/ws');

const startServer = (app) => {
    const server = http.createServer(app);

    server.listen(process.env.REST_PORT);
    console.log(`server listening on port : ${server.address().port}`);
    // server.on('listening',()=>{
    //     console.log(`server listening on port : ${server.address().port}`);
    //     ws.startSocket(server);
    // });

    server.on('error', (err) => {
        console.log(`Error : ${err}`);
    });
}

module.exports = {
    startServer: startServer
}