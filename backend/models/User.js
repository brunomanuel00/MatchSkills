const mongoose = require('mongoose')


const skillSchema = new mongoose.Schema({
    id: {
        type: String,
        required: true,
        trim: true
    },
    category: {
        type: String,
        required: true,
        enum: ['technology', 'design', 'business', 'languages', 'arts', 'crafts', 'sciences', 'others']
    }
});

const UserSchema = new mongoose.Schema({
    name: {
        type: String,
        required: [true, 'El nombre es requerido'],
        trim: true,
        maxlength: [50, 'El nombre no puede exceder 50 caracteres']
    },
    email: {
        type: String,
        required: [true, 'El email es requerido'],
        unique: true,
        lowercase: true,
        validate: {
            validator: function (v) {
                return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(v);
            },
            message: props => `${props.value} no es un email válido!`
        }
    },
    passwordHash: {
        type: String,
        required: [true, 'La contraseña es requerida']
    },
    skills: {
        type: [skillSchema],
        validate: {
            validator: function (v) {
                return v.length <= 20;
            },
            message: 'No puede tener más de 20 habilidades'
        }
    },
    lookingFor: {
        type: [skillSchema],
        validate: {
            validator: function (v) {
                return v.length <= 10;
            },
            message: 'No puede buscar más de 10 habilidades'
        }
    },
    rol: {
        type: String,
        enum: ['user', 'admin'],
        default: 'user'
    },
    avatar: {
        public_id: {
            type: String,
            default: 'default_avatar'
        },
        url: {
            type: String,
            default: process.env.DEFAULT_AVATAR_URL,
            validate: {
                validator: function (v) {
                    return /^(https?|ftp):\/\/[^\s/$.?#].[^\s]*$/.test(v);
                },
                message: props => `${props.value} no es una URL válida!`
            }
        }
    }
});

UserSchema.set('toJSON', {
    transform: (_document, returnedObject) => {
        returnedObject.id = returnedObject._id.toString()
        delete returnedObject._id
        delete returnedObject.__v
        delete returnedObject.passwordHash
        if (!returnedObject.avatar?.url) {
            returnedObject.avatar = {
                url: process.env.DEFAULT_AVATAR_URL
            };
        }

        ['skills', 'lookingFor'].forEach(field => {
            if (returnedObject[field]) {
                returnedObject[field] = returnedObject[field].map(({ _id, ...rest }) => rest);
            }
        });
    }

})

const User = mongoose.model('User', UserSchema)

module.exports = User