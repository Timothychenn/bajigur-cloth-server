const bcrypt = require('bcryptjs')

function hashPassword(password) {
    const salt = bcrypt.genSaltSync(5)
    const hashedPassword = bcrypt.hashSync(password, salt)

    return hashedPassword
}

function comparePassword(password, database) {
    return bcrypt.compareSync(password, database)
}

module.exports = {hashPassword, comparePassword}