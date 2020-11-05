const express = require('express')
const {body} = require('express-validator/check')

const _error = require('../utils/error-handel')
const controller = require('../controllers/posts')
const auth = require('../middleware/auth')

const router = express.Router()

router.use(auth.checkBearerToken)

router.get('/:postId', controller.getPost)

router.post('/create', [
    body('title').trim().isLength({min: 5}),
    body('content').trim().isLength({min: 15})
], [
    _error.validationError,
    _error.checkFile
], controller.createPost)

router.get('/', controller.getPosts)

router.put('/:postId', [
        body('title').trim().isLength({min: 5}),
        body('content').trim().isLength({min: 5})
    ],
    _error.validationError,
    controller.updatePost)

router.delete('/:postId', controller.deletePost)

module.exports = router