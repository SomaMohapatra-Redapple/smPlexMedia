const https = require('http');

class APIClient {
    constructor(apiUrl) {
        this.apiUrl = apiUrl;
    }

    async fetchData(endpoint) {
        const requestOptions = {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json',
            },
        };

        const url = `${this.apiUrl}/${endpoint}`;

        try {
            const data = await this.makeRequest(url, requestOptions);
            return data;
        } catch (error) {
            throw error;
        }
    }

    async postData(endpoint, requestData) {
        const requestOptions = {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            data : requestData
        };

        const url = `${this.apiUrl}/callback?function=${endpoint}`;

        try {
            const data = await this.makeRequest(url, requestOptions);
            return data;
        } catch (error) {
            throw error;
        }
    }

    makeRequest(url, requestOptions) {
        return new Promise((resolve, reject) => {
            const request = https.request(url, requestOptions, (response) => {
                let data = '';

                response.on('data', (chunk) => {
                    data += chunk;
                });

                response.on('end', () => {
                    try {
                        const parsedData = JSON.parse(data);
                        resolve(parsedData);
                    } catch (error) {
                        reject(error);
                    }
                });
            });

            request.on('error', (error) => {
                reject(error);
            });

            request.end();
        });
    }
}

module.exports = APIClient;