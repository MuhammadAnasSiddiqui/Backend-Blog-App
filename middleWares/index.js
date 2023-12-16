const jwt = require('jsonwebtoken');

const authMiddleWare = (req, res, next) => {
    try {
        if (req.headers["authorization"]);
        const token = req.headers["authorization"].split(" ");

        const verification = jwt.verify(token[1], "PRIVATEKEY");
        if (verification) {
            next()
        } else {
            res.json({
                status: false,
                message: "unAuth user"
            })
        }
    } catch (err) {
        res.json({
            status: false,
            message: "unAuth user"
        })
    }
}

module.exports = authMiddleWare