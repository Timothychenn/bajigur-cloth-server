function errorHandler(err, req, res, next) {
    switch (err.name) {
        case "SequelizeValidationError":
            res.status(400).json({
                code: "400",
                message: err.errors.map((error) => error.message),
            });
            break;

        case "Unauthorized":
            res.status(401).json({
                code: "401",
                message: "Invalid email or password",
            });
            break;

        case "Unauthorized User":
            res.status(401).json({
                code: "401",
                message: "User need to login",
            });
            break;

        case "Forbidden":
            res.status(403).json({
                code: "403",
                message: "User unauthorized to access or modify this data",
            });
            break;

        case "Not Found":
            res.status(404).json({
                code: "404",
                message: "Data not found",
            });
            break;

        default:
            res.status(500).json({
                code: "500",
                message: "Internal server error",
            });
            break;
    }
}

module.exports = { errorHandler };
