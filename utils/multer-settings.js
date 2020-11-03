const multer = require('multer')
const path = require('path')

module.exports = {
    storage: multer.diskStorage({
        destination: (req, file, cb) => {
            cb(null, path.join(path.dirname(process.mainModule.filename), 'public', 'images', 'posts'))
        },
        filename: (req, file, cb) => {
            cb(null, `${Date.now()}-${file.originalname}`)
        }
    }),
    fileFilter: (req, file, cb) => {
        if (file.mimetype === 'image/png')
            cb(null, true)
        else
            cb(null, false)
    }
}