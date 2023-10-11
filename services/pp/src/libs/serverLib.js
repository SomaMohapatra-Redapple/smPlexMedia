const http = require('http');
class Server {
    /**
     * Create class instance and fill params from URL or fill it with default values if URL not contain needed data.
     * @constructs
    */
    constructor() {
        //================Platform API URL================================
        // this.baseUrl = "";//New structur

        //================================================================
    };

    //##########################################################################

    // getData(url, options) {
    //     return new Promise((resolve, reject) => {
    //         // let opt = JSON.stringify(options);
    //         const request = http.request(url, options, (response) => {
    //             let data = '';

    //             response.on('data', (chunk) => {
    //                 data += chunk;
    //             });

    //             response.on('end', () => {
    //                 try {
    //                     const parsedData = JSON.parse(data);
    //                     resolve(parsedData);
    //                 } catch (error) {
    //                     reject(error);
    //                 }
    //             });
    //         });

    //         request.on('error', (error) => {
                
    //             reject(error);
    //         });

    //         request.end();
    //     });
    // };

    async getData(url, options) {
        try {
            let response = await fetch(url, options);
            if (response.status == 200) {
                return response.json();
            } else {
                console.log("test")
            }
        } catch (err) {
            console.log("getData Error log: ", err);
        }
    };
    async TokenAuthentication(_token) {
        try {
            let reqHeaders = new Headers();
            reqHeaders.append("Content-Type", "application/json");
            let url = this.baseUrl + this.userAuthenticationUrlApi + "?token=" + _token;
            let requestOptions = {
                method: 'POST',
                headers: reqHeaders,
            };
            return (await this.getData(url, requestOptions));
        } catch (err) {
            cons.load("TokenAuthentication error : ", err);
        }
    };
    async HowManyPreviousNextEvents(_howManyPrevious, _howManyNext, sessionId, _gameType) {
        try {
            let reqHeaders = new Headers();
            reqHeaders.append("Content-Type", "application/json");
            reqHeaders.append("token", this.token);
            let url = this.baseUrl + this.howManyPreviousAndNextEventApi + "?howmanyprevious=" + howManyPrevious + "&howmanynext=" + _howManyNext + "&session_id=" + sessionId + "&type=" + gameType;
            let requestOptions = {
                method: 'GET',
                headers: reqHeaders,
            };
            return (await this.getData(url, requestOptions));
        } catch (error) {
            console.log("error----", error);
        }
    };
};
let server = new Server();

module.exports = {
    server: server
};