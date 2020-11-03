const {validationResult} = require('express-validator/check')

exports.checkFile = (req, res, next) => {
    if (!req.file) {
        const err = new Error('upload a png file is required')
        err.statusCode = 422
        throw err
    }
    next()
}

exports.validationError = (req, res, next) => {
    const errors = validationResult(req)
    if (errors.isEmpty())
        return next()
    const err = new Error('input validation error!')
    err.statusCode = 422
    err.errors = errors.array()
    next(err)
}


exports.catchError = (err, next) => {
    if (err.statusCode == null)
        err.statusCode = 500
    next(err)
}


