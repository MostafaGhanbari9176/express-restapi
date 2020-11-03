const Posts = require('../models/post')

const _error = require('../utils/error-handel')

exports.createPost = (req, res, next) => {

    const title = req.body.title
    const content = req.body.content
    const imageName = req.file.filename

    const post = new Posts({
        title: title, content: content, imageName: imageName
    })

    post.save()
        .then(post => {
            res.status(201).json({
                message: "successfully created",
                post: post
            })
        }).catch(err => _error.catchError(err, next))

}

exports.getPost = (req, res, next) => {

    const postId = req.params.postId

    Posts.findById(postId)
        .then(post => {
            if (!post) {
                const err = new Error('could not found post')
                err.statusCode = 404
                throw err
            }
            res.status(200).json({
                message: "post fetched",
                post: post
            })
        })
        .catch(err => _error.catchError(err, next))

}

exports.getPosts = (req, res, next) => {

    Posts.find()
        .then(posts => {
            res.status(200).json({
                message: "all post",
                posts: posts
            })
        })
        .catch(err => _error.catchError(err, next))

}