const express = require('express')
const bodyParser = require('body-parser')
const multer = require('multer')
const mongoose = require('mongoose')
const path = require('path')

const multerSettings = require('./utils/multer-settings')
const postRouter = require('./routes/post')
const authRouter = require('./routes/auth')
const utils = require('./utils/utils')

const app = express()

app.use(bodyParser.json())
app.use(multer(multerSettings).single('image'))

app.use('/post/image', express.static(path.join(__dirname, 'public', 'images', 'posts')))

app.use('/post', postRouter)
app.use('/auth', authRouter)

app.use((err, req, res, next) => {
    const statusCode = err.statusCode || 500
    const message = err.message || "message is empty"
    const errors = err.errors || []

    if (req.file)
        utils.deletePostImage(req.file.filename)

    res.status(statusCode).json({
        message: message,
        errors: errors
    })

})

mongoose.connect('mongodb://localhost:27017/restapi')
    .then(result => {
        app.listen(8080, () => {
            console.log("listen on 8080")
        })
    }).catch(err => console.log(err))