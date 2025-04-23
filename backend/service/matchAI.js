// const Match = require('../models/Match');
// const crypto = require('crypto');
// // const aimlapi = require('./aimlapi'); // Supongamos que tienes un módulo para interactuar con aimlapi

// async function calculateLookingForHash(lookingFor) {
//     const sortedLookingFor = lookingFor.map(item => item.id).sort().join(',');
//     return crypto.createHash('sha256').update(sortedLookingFor).digest('hex');
// }

// async function calculateMatchesWithAI(userLookingFor, otherUsers) {
//     // Lógica para interactuar con aimlapi.com
//     // Esto implicará formatear los datos y manejar los límites de caracteres.
//     // Podrías enviar lotes de skills de otros usuarios a la IA.
//     // La IA debería devolver los IDs de los usuarios que coinciden y las habilidades coincidentes.

//     const matches = [];
//     // Ejemplo simulado (reemplazar con la interacción real con la IA)
//     for (const otherUser of otherUsers) {
//         const matchingSkills = otherUser.skills.filter(skill =>
//             userLookingFor.some(lookingForSkill => lookingForSkill.id === skill.id)
//         ).map(skill => skill.id);

//         if (matchingSkills.length > 0 && otherUser._id.toString() !== userLookingFor.userId) {
//             matches.push({
//                 matchedUserId: otherUser._id,
//                 matchingSkills: matchingSkills
//             });
//         }
//     }
//     return matches;
// }

// async function getExistingMatch(userId) {
//     return await Match.findOne({ userId });
// }

// async function createOrUpdateMatch(userId, lookingForHash, matches) {
//     const existingMatch = await Match.findOne({ userId });
//     if (existingMatch) {
//         existingMatch.lookingForHash = lookingForHash;
//         existingMatch.matches = matches;
//         return await existingMatch.save();
//     } else {
//         const newMatch = new Match({
//             userId: userId,
//             lookingForHash: lookingForHash,
//             matches: matches
//         });
//         return await newMatch.save();
//     }
// }

// module.exports = {
//     calculateLookingForHash,
//     calculateMatchesWithAI,
//     getExistingMatch,
//     createOrUpdateMatch
// };