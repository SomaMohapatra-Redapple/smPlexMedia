const http = require('http');

const startServer = (app) => {
    const server = http.createServer(app);

    server.listen(process.env.REST_PORT);
    console.log(`Server is Listning on port : ${process.env.REST_PORT}`);

    server.on('error', (err) => {
        console.log(`Error : ${err}`);
    });
}

module.exports = {
    startServer: startServer
}