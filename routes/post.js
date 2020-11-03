const express = require('express')
const {body} = require('express-validator/check')

const _error = require('../utils/error-handel')
const controller = require('../controllers/posts')

const router = express.Router()

router.get('/:postId', controller.getPost)

router.post('/create', [
    body('title').trim().isLength({min: 5}),
    body('content').trim().isLength({min: 15})
], [
    _error.validationError,
    _error.checkFile
], controller.createPost)

router.get('/', controller.getPosts)

module.exports = router