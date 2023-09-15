let mongoose = require('mongoose');
const responseLib = require('../libs/responseLib');
let PlayerModel = mongoose.model('Player');

let userBalance = (req, res) => {
    try {
        // let findUserBalance = PlayerModel.find({ : `${req.body.country_code}`, mobile: `${req.body.mobile}` }).lean();

        let payLoad = {
            currency: "kwr",
            cash: +1000,
            bonus : +100,
        }

        let apiResponse = responseLib.generate(false, "User Balance", payLoad);
        res.status(200).send(apiResponse);

    } catch (error) {
        let apiResponse = responseLib.generate(true, error.message, {});
        res.status(500).send(apiResponse);
    }
}

module.exports = {
    userBalance: userBalance
}