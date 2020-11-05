const jwt = require('jsonwebtoken')

const secretPass = "lsdkcfjmuefriokpedsopuhmerceouioerb24sxc1g786rdtcsoldpuijwecy"

exports.createBearerToken = (req, res, next) => {
    const token = jwt.sign({
        email: req._user.email,
        userId: req._user._id
    }, secretPass, {expiresIn: '1h'})
    res.status(201).json({
        message: "you know logged in",
        userId: req._user._id,
        email: req._user.email,
        token: token
    })
}