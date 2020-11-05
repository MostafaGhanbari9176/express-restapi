const path = require('path')
const fs = require('fs')

exports.deletePostImage = imageName => {
    const imagePath = path.join(
        path.dirname(process.mainModule.filename),
        'public', 'images', 'posts', imageName)

    fs.unlink(imagePath, (err) => {
        if (err)
            console.log(err)
    })

}