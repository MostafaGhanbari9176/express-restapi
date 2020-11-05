const bcrypt = require('bcryptjs')

const User = require('../models/user')
const _error = require('../utils/error-handel')

exports.signup = (req, res, next) => {

    const email = req.body.email
    const name = req.body.name
    const pass = req.body.pass

    bcrypt.hash(pass, 12)
        .then(hashedPass => {
            const user = new User({
                email: email,
                name: name,
                pass: hashedPass
            })

            return user.save()

        }).then(user => {
        res.status(201).json({
            message: "your account successfully created",
            userId: user._id,
            email: user.email
        })
    })
        .catch(err => _error.catchError(err, next))

}

exports.login = (req, res, next) => {

    const email = req.body.email
    const pass = req.body.pass

    let fetchedUser

    User.findOne({email: email})
        .then(user => {
            if (!user) {
                const err = new Error('email is not found')
                err.statusCode = 401
                throw err
            }
            fetchedUser = user
            return bcrypt.compare(pass, user.pass)
        })
        .then(isEqual => {
            if(!isEqual){
                const err = new Error('pass is incorrect')
                err.statusCode = 401
                throw err
            }

            req._user = fetchedUser
            next()
        })
        .catch(err => _error.catchError(err, next))

}
