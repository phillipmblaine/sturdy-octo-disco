//Shorter way of doing express and router
// let router = require('express').Router();
let express = require('express');
let router = express.Router();

// alternatively, I can assign require('../db') to a variable and use that in place of the require db in const Log
let User = require('../db').import('../models/user');

const jwt = require('jsonwebtoken');

const bcrypt = require('bcryptjs');

// user endpoints
// post: allow a new user to be registered (created) with username and password
router.post('/register', function (req, res) {
    User.create({
        username: req.body.user.username,
        passwordhash: bcrypt.hashSync(req.body.user.password, 10)
    })
        .then(
            function createSuccess(user) {
                let token = jwt.sign({ id: user.id }, process.env.JWT_SECRET, { expiresIn: '1d' });
                // res.send('This is the user/register endpoint.')
                res.json({
                    user: user,
                    message: 'User successfully created.',
                    sessionToken: token
                });
            }
        )
        .catch(error => res.status(500).json({ error: error }))
});

// post: allow an existing user to login with username and password credentials
router.post('/login', function (req, res) {
    User.findOne({
        where: {
            username: req.body.user.username
        }
    })
        .then(function loginSucces(user) {
            if (user) {
                bcrypt.compare(req.body.user.password, user.passwordhash, function (error, matches) {
                    if (matches) {
                        let token = jwt.sign({ id: user.id }, process.env.JWT_SECRET, { expiresIn: '1d' });
                        res.status(200).json({
                            user: user,
                            message: "User successfully logged in.",
                            sessionToken: token
                        })
                    } else {
                        res.status(502).send({ error: "Login failed." });
                    }
                });
            } else {
                res.status(500).json({ error: 'User does not exist.' })
            }
        })
        .catch(error => res.status(500).json({ error: error }))
});

module.exports = router;