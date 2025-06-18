const mongoose = require('mongoose');

const notificationSchema = new mongoose.Schema({
    user: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
    type: { type: String, enum: ['new_message', 'new_match'] },
    data: { type: mongoose.Schema.Types.Mixed },
    read: { type: Boolean, default: false },
    createdAt: { type: Date, default: Date.now }
});

// 1) Virtual para "id"
notificationSchema.virtual('id').get(function () {
    return this._id.toHexString();
});

// 2) Configurar transformación
notificationSchema.set('toJSON', {
    virtuals: true,           // Incluir el campo virtual "id"
    versionKey: false,        // Quitar "__v"
    transform: (doc, ret) => {
        // ret es el objeto que se va a serializar
        // Reemplazamos ret.user por solo nombre y email:
        if (ret.user && typeof ret.user === 'object') {
            ret.user = {
                name: ret.user.name,
                email: ret.user.email
            };
        }
        // Eliminamos _id
        delete ret._id;
    }
});

module.exports = mongoose.model('Notification', notificationSchema);