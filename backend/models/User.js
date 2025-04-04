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
        required: [true, 'The name is required'],
        trim: true,
        maxlength: [50, 'The name cannot exceed 50 characters']
    },
    email: {
        type: String,
        required: [true, 'Email is required'],
        unique: true,
        lowercase: true,
        validate: {
            validator: function (v) {
                return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(v);
            },
            message: props => `${props.value} is not a valid email!`
        }
    },
    passwordHash: {
        type: String,
        required: [true, 'Password is required']
    },
    skills: {
        type: [skillSchema],
        validate: {
            validator: function (v) {
                return v.length <= 15;
            },
            message: 'You cannot have more than 15 skills'
        }
    },
    lookingFor: {
        type: [skillSchema],
        validate: {
            validator: function (v) {
                return v.length <= 15;
            },
            message: 'You cannot search for more than 15 skills'
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
                message: props => `${props.value} is not a valid URL!`
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