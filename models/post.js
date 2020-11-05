const mongoose = require('mongoose')

const Schema = mongoose.Schema

const postSchema = new Schema({
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
    },
    user:{
        type:Schema.Types.ObjectId,
        ref:'User',
        required:true
    }
}, {timestamps: true})

module.exports = mongoose.model('Post', postSchema)
