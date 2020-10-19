const jwt = require('jsonwebtoken')

function signToken(payload) {
    let token = jwt.sign(payload, process.env.SECRET)

    return token
}

function verifyToken(token) {
    let decoded = jwt.verify(token, process.env.SECRET)

    return decoded
}

module.exports = {signToken, verifyToken}