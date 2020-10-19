const { User } = require("../models/index.js");
const { comparePassword } = require("../helpers/hash-password.js");
const { signToken } = require("../helpers/token.js");

class UserController {
    static async register(req, res, next) {
        let { email, password, name, type } = req.body;

        try {
            let newUser = await User.create({ email, password, name, type });

            res.status(201).json({ id: newUser.id, email: newUser.email });
        } catch (err) {
            next(err);
        }
    }

    static async login(req, res, next) {
        let { email, password } = req.body;

        try {
            let user = await User.findOne({ where: { email } });

            if (user) {
                if (comparePassword(password, user.password)) {
                    let payload = { email: user.email };
                    res.status(200).json({ access_token: signToken(payload) });
                } else {
                    throw { name: "Unauthorized" };
                }
            } else {
                throw { name: "Unauthorized" };
            }
        } catch (err) {
            next(err);
        }
    }
}

module.exports = UserController;
