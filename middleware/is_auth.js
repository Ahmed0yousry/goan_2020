const jwt = require('jsonwebtoken');

module.exports = (req, res, next) => {
    const authHeader = req.get('Authorization');
    if (!authHeader) {
        error = new Error('Not Authenticated');
        error.statusCode = 401;
        throw error;
    }
    const token = authHeader.split(' ')[1];
    let decoded_token;
    try {
        decoded_token = jwt.verify(token, 'anaAHMEDyousry1998');
    } catch (err) {
        err.statusCode = 500;
        throw err;
    }
    if (!decoded_token) {
        error = new Error('Not Authenticated');
        error.statusCode = 401;
        throw error;
    }
    req.userId = decoded_token.userId;
    next();
}