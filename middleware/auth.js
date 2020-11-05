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

exports.checkBearerToken = (req, res, next) => {
    const header = req.get('Authorization')
    let token
    if (header) {
        token = header.split(' ')[1]
        try {
            const decodedToken = jwt.verify(token, secretPass)
            if (decodedToken) {
                req.userId = decodedToken.userId
                console.log(decodedToken)
                return next()
            }
        } catch (err) {
            err.statusCode = 500
            throw err
        }
    }

    const err = new Error('not authenticated')
    err.statusCode = 403
    throw err
}
