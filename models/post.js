const mongoose = require('mongoose')

const postSchema = new mongoose.Schema({
    title: {
        type: String,
        require: true
    },
    content: {
        type: String,
        require: true
    },
    imageName: {
        type: String,
        require: true
    }
}, {timestamps: true})

module.exports = mongoose.model('Post', postSchema)