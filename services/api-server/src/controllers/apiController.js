/**
 * 
 * @author Rajdeep Adhikary
 * @purpose To channelise requests to appropriate servers
 * @createdDate Oct 11 2023
 * @lastUpdated Oct 11 2023
 * @lastUpdatedBy Rajdeep Adhikary
 */

module.exports = {
    test : (req, res) => {
        res.send('running');
    }
}