const express = require('express');
const router = express.Router();
const multer = require('multer');
const userController = require('../controllers/userController');
const middleware = require('../utils/middleware');

const upload = multer({
    dest: 'temp_uploads/',
    limits: {
        fileSize: 10 * 1024 * 1024, // 10MB
        files: 1
    },
    fileFilter: (_req, file, cb) => {
        if (!file.mimetype.startsWith('image/')) {
            return cb(new Error('Solo se permiten imágenes'));
        }
        cb(null, true);
    }
});


const handleMulterError = (err, _req, res, next) => {
    if (err instanceof multer.MulterError) {
        res.status(413).json({ error: err.message });
    } else if (err) {
        res.status(400).json({ error: err.message });
    } else {
        next();
    }
};

router.patch(
    '/:id/avatar',
    middleware.userExtractor,
    upload.single('avatar'),
    handleMulterError,
    userController.uploadAvatar
);

module.exports = router;