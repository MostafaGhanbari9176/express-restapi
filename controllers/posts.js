const Post = require('../models/post')
const User = require('../models/user')

const _error = require('../middleware/error-handel')
const utils = require('../utils/utils')

exports.createPost = (req, res, next) => {

    const title = req.body.title
    const content = req.body.content
    const imageName = req.file.filename
    const userId = req.userId

    const post = new Post({
        title: title, content: content, imageName: imageName, user: userId
    })

    post.save()
        .then(post => {
            return User.findById(req.userId)
        })
        .then(user => {
            user.posts.push(post)
            return user.save()
        })
        .then(() => {
            res.status(201).json({
                message: "successfully created",
                post: post
            })
        })
        .catch(err => _error.catchError(err, next))

}

exports.getPost = (req, res, next) => {

    const postId = req.params.postId

    Post.findById(postId)
        .populate('user', 'name _id')
        .then(post => {
            if (!post) {
                const err = new Error('could not found post')
                err.statusCode = 404
                throw err
            }

            res.status(200).json({
                post: post
            })
        })
        .catch(err => _error.catchError(err, next))

}

exports.getPosts = (req, res, next) => {

    const page = +req.query.page || 1
    const perPage = +req.query.perPage || 2
    let total

    Post.countDocuments()
        .then(count => {
            total = count
            return Post.find()
                .populate('user', 'name')
                .skip((page - 1) * perPage)
                .limit(perPage)
        })
        .then(posts => {
            res.status(200).json({
                page: page,
                perPage: perPage,
                pages: Math.ceil(total / perPage),
                total: total,
                posts: posts
            })
        })
        .catch(err => _error.catchError(err, next))

}

exports.updatePost = (req, res, next) => {

    const postId = req.params.postId
    const title = req.body.title
    const content = req.body.content
    let imageName = req.body.imageName
    if (req.file)
        imageName = req.file.filename
    if (imageName == null) {
        const err = new Error('image is required')
        err.statusCode = 422
        throw err
    }

    Post.findById(postId)
        .then(post => {
            if (!post) {
                const err = new Error('could not found post')
                err.statusCode = 404
                throw err
            }
            if (post.user.toString() !== req.userId) {
                const err = new Error('access denied')
                err.statusCode = 403
                throw err
            }
            if (req.file) {
                utils.deletePostImage(post.imageName)
                post.imageName = imageName
            }
            post.title = title
            post.content = content
            return post.save()
        })
        .then(post => {
            res.status(200).json({
                message: "update successfully",
                post: post
            })
        })
        .catch(err => _error.catchError(err, next))

}

exports.deletePost = (req, res, next) => {
    const postId = req.params.postId
    let imageName
    let creator
    let fetchedPost
    Post.findById(postId)
        .populate('user')
        .then(post => {
            if (!post) {
                const err = new Error('could not found post')
                err.statusCode = 404
                throw err
            }
            if (post.user._id.toString() !== req.userId) {
                const err = new Error('access denied')
                err.statusCode = 403
                throw err
            }
            creator = post.user
            fetchedPost = post
            imageName = post.imageName
            return Post.findByIdAndDelete(postId)

        }).then(() => {
        creator.posts.pull(fetchedPost)
        return creator.save()
    }).then(() => {
        res.status(200).json({
            message: "deleted successfully"
        })
        utils.deletePostImage(imageName)
    })
        .catch(err => _error.catchError(err, next))

}

