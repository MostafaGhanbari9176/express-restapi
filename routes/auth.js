const express = require('express')
const {body} = require('express-validator/check')

const controller = require('../controllers/users')
const User = require('../models/user')
const _error = require('../utils/error-handel')
const auth = require('../middleware/auth')

const router = express.Router()

router.post('/signup', [
        body('name').trim().notEmpty(),
        body('pass').trim().isLength({min: 6}),
        body('email').trim().isEmail().normalizeEmail()
            .custom((value, {req}) => {
                return User.findOne({email: req.body.email})
                    .then(user => {
                        if (user)
                            return Promise.reject('email is used before')
                    })
            })
    ],
    _error.validationError,
    controller.signup)

router.post('/login', [
        body('email').trim().isEmail().normalizeEmail(),
        body('pass').trim().isLength({min: 6})
    ],
    _error.validationError,
    controller.login,
    auth.createBearerToken
)

module.exports = router
