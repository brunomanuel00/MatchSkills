const mongoose = require('mongoose');

const matchSchema = new mongoose.Schema({
    userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', unique: true },
    matches: [
        {
            matchedUserId: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
            matchingSkills: [{
                id: { type: String, required: true },
                category: { type: String, required: true }
            }]
        }
    ]
});

matchSchema.set('toJSON', {
    transform: (_document, returnedObject) => {
        returnedObject.id = returnedObject._id.toString()
        delete returnedObject._id
        delete returnedObject.__v
    }
})

module.exports = mongoose.model('Match', matchSchema);