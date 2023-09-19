const axios = require("axios").default;
let config = {
    method: 'post',
    url: 'https://api.razorpay.com/v1/fund_accounts',
    headers: {
        'Content-Type': 'application/json',
        'Authorization': constants.auth_token_razor_pay
    },
    data: data
};

let response = await axios(config);