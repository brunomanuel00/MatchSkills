const cloudinary = require('cloudinary').v2;
require('dotenv').config();

cloudinary.config({
    cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
    api_key: process.env.CLOUDINARY_API_KEY,
    api_secret: process.env.CLOUDINARY_API_SECRET,
    secure: true
});

// Configuración global de Cloudinary
cloudinary.config({
    upload_preset: 'ml_default', // Opcional: Crea un upload preset en tu cuenta
    // api_proxy: process.env.CLOUDINARY_PROXY // Si necesitas proxy
});

module.exports = cloudinary;