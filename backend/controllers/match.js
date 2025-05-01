const matchRouter = require('express').Router();
const Match = require('../models/Match');
const User = require('../models/User');
const { userExtractor } = require('../utils/middleware');
const { getSkillMatches } = require('../service/geminiAI');

// matchRouter.post('/calculate', userExtractor, async (req, res) => {
//     const userRequesting = req.user;

//     try {

//         // const existingMatch = await Match.findOne({ userId: userRequesting.id });

//         // if (existingMatch) {
//         //     return res.status(200).json({ message: 'Matches are up to date.' });
//         // }

//         const otherUsers = await User.find({ _id: { $ne: userRequesting.id } });

//         const matchesFromAI = await getSkillMatches(userRequesting, otherUsers);
//         console.log('IA Response:', matchesFromAI);

//         if (!Array.isArray(matchesFromAI)) {
//             return res.status(500).json({ error: 'La IA no devolvió una lista válida de coincidencias.' });
//         }

//         const formattedMatches = matchesFromAI.map(match => ({
//             matchedUserId: match.userId,
//             matchingSkills: Array.isArray(match.matchingSkills)
//                 ? match.matchingSkills.map(skill => {
//                     // Si vienen como strings tipo JSON, los parseas
//                     return typeof skill === 'string' ? JSON.parse(skill) : skill;
//                 })
//                 : []
//         }));

//         const matchDocument = await Match.findOneAndUpdate(
//             { userId: userRequesting.id },
//             { matches: formattedMatches },
//             { upsert: true, new: true }
//         );

//         res.status(201).json(matchDocument);

//     } catch (error) {
//         console.error('Error calculating matches:', error);
//         res.status(500).json({ error: 'Failed to calculate matches.' });
//     }
// });

matchRouter.post('/calculate', userExtractor, async (req, res) => {
    const userRequesting = req.user;

    try {
        const otherUsers = await User.find({ _id: { $ne: userRequesting.id } });

        // Calcular coincidencias sin IA
        const formattedMatches = otherUsers.map(other => {
            const matchingSkills = userRequesting.lookingFor.filter(skill =>
                other.skills.some(s =>
                    s.id === skill.id && s.category === skill.category
                )
            );

            if (matchingSkills.length > 0) {
                return {
                    matchedUserId: other._id,
                    matchingSkills
                };
            }

            return null;
        }).filter(Boolean); // Elimina los nulls

        const existingMatch = await Match.findOne({ userId: userRequesting.id });

        // Detectar cambios en coincidencias
        const hasChanged =
            !existingMatch ||
            JSON.stringify(existingMatch.matches) !== JSON.stringify(formattedMatches);

        // Guardar solo si hay cambios
        await Match.findOneAndUpdate(
            { userId: userRequesting.id },
            { matches: formattedMatches },
            { upsert: true, new: true }
        );

        res.status(201).json({ hasChanged });

    } catch (error) {
        console.error('Error calculating matches:', error);
        res.status(500).json({ error: 'Failed to calculate matches.' });
    }
});


matchRouter.get('/', userExtractor, async (req, res) => {
    const userRequesting = req.user;

    try {
        const matchData = await Match.findOne({ userId: userRequesting.id })
            .populate('matches.matchedUserId', 'name email avatar') // Aseguramos que se pueblen estos campos
            .select('matches');

        if (!matchData) {
            return res.status(404).json({ message: 'No matches found for this user.' });
        }

        const formattedMatches = matchData.matches.map(match => ({
            id: match.matchedUserId._id.toString(), // Convertimos ObjectId a string
            name: match.matchedUserId.name,
            email: match.matchedUserId.email,
            avatar: match.matchedUserId.avatar,
            matchingSkills: match.matchingSkills
        }));

        const sortedMatches = formattedMatches.sort((a, b) => b.matchingSkills.length - a.matchingSkills.length);

        res.json(sortedMatches);

    } catch (error) {
        console.error('Error getting matches:', error);
        res.status(500).json({ error: 'Failed to get matches.' });
    }
});



module.exports = matchRouter;