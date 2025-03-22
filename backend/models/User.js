const mongoose = require('mongoose')

const UserSchema = new mongoose.Schema({
    name: String,
    email: { type: String, unique: true },
    passwordHash: String,
    skills: [String],
    lookingFor: [String],
    rol: {
        type: String,
        enum: ["user", "admin"],
        default: "user",
    },
});

UserSchema.set('toJSON', {
    transform: (_document, returnedObject) => {
        returnedObject.id = returnedObject._id.toString()
        delete returnedObject._id
        delete returnedObject.__v
        delete returnedObject.passwordHash
    }

})

const User = mongoose.model('User', UserSchema)

module.exports = User