const jwt = require('jsonwebtoken');
const User = require('../db').import('../models/user');

const validateSession = (req, res, next) => {
    const token = req.headers.authorization;

    console.log('token -->', token);

    if (!token) {
        return res.status(403).send({ auth: false, message: "No token provided." })
    } else {
        jwt.verify(token, process.env.JWT_SECRET, (error, decodeToken) => {

            console.log('decodeToken -->', decodeToken);

            if (!error && decodeToken) {
                User.findOne({
                    where: {
                        id: decodeToken.id // id is from the users table
                    }
                })
                    .then(user => {

                        console.log('user -->', user);

                        if (!user) throw error;

                        console.log('req -->', req);

                        req.user = user;
                        return next();
                    })
                    .catch(error => next(error)); // the next passes the error into the next function
            } else {
                req.errors = error;
                return res.status(500).send('Not authorized.');
            }
        });
    }
};

module.exports = validateSession;