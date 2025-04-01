const multer = require('multer');
const fs = require('fs');
const cloudinary = require('../utils/cloudinary')

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

// Manejador de errores de Multer
const handleMulterError = (err, _req, res, next) => {
    if (err instanceof multer.MulterError) {
        res.status(413).json({ error: err.message });
    } else if (err) {
        res.status(400).json({ error: err.message });
    } else {
        next();
    }
};

const handleAvatarUpload = async (file, userId) => {
    const result = await cloudinary.uploader.upload(file.path, {
        folder: `user_avatars/${userId}`,
        transformation: [
            { width: 300, height: 300, crop: 'fill' },
            { quality: 'auto:best' },
            { format: 'webp' }
        ]
    });

    fs.unlinkSync(file.path); // Eliminar archivo temporal
    return {
        public_id: result.public_id,
        url: result.secure_url
    };
};

module.exports = { upload, handleMulterError, handleAvatarUpload }