let axios = require('axios');
module.exports = class Server {
    /**
     * Create class instance and fill params from URL or fill it with default values if URL not contain needed data.
     * @constructs
    */
    constructor() {
        // Initialize any properties or configurations here //
        // this.baseUrl = "";  //New structur
    };

    //##########################################################################

    // async getData(url, options) {
    //     try {
    //         let response = await fetch(url, options);
    //         return {
    //             response: response,
    //             error: false
    //         }
    //     } catch (err) {
    //         console.log(" serverLib getData Error log: ", err);
    //         return {
    //             error: true
    //         }
    //     }
    // };

    async getData(url, options) {
        try {
            let response = await axios(url, options);
            return {
                response: response,
                error: false
            }
        } catch (err) {
            console.log(" serverLib getData Error log: ", err);
            return {
                error: true
            }
        }
    };

    async postData(apiUrl, endpoint, bodyData) {
        try {
            let url = `${apiUrl}/callback?function=${endpoint}`;
            let requestOptions = {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                data: JSON.stringify(bodyData)
            };
            const data = await this.getData(url, requestOptions);
            return data;
        } catch (error) {
            console.error(' server lib Error: ', error);
            return {
                error: true
            }
        }
    };

    async call(url, config) {
        try {
            const data = await this.getData(url, config);
            return data;
        } catch (error) {
            console.error(' server lib Error: ', error);
            return {
                error: true
            }
        }
    };
};