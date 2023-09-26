const mongoose = require('mongoose');
const playerModel = mongoose.model('Player');

const checkUsercodeExists = async (usercode) => {
    try {
        let user = await playerModel.findById(usercode).lean();
        return user;
    } catch (error) {
        return null;
    }
}

module.exports = {
    checkUsercodeExists : checkUsercodeExists
}