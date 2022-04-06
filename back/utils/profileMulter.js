const multer = require('multer') // npm i multer
const path = require('path')

const upload = multer({
    storage: multer.diskStorage({
        destination: (req, file, done) => {
            done(null, 'public/profile_img/')
        },
        filename: (req, file, done) => {
            const { userid } = req.body
            const ext = path.extname(file.originalname)
            const filename = userid + Date.now() + ext
            req.uImg = filename
            done(null, filename)
        }
    }),
    // 파일용량 제한 : 5MB
    limits: { fileSize: 5 * 1024 * 1024 }
})

module.exports = {
    upload
}