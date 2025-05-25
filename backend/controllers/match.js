const matchRouter = require('express').Router();
const Match = require('../models/Match');
const User = require('../models/User');
const { userExtractor } = require('../utils/middleware');
const { getSkillMatches } = require('../service/aiMatchtes');

// matchRouter.post('/calculate', userExtractor, async (req, res) => {
//     const userRequesting = req.user;

//     try {
//         // Obtener todos los usuarios excepto el solicitante
//         const otherUsers = await User.find({ _id: { $ne: userRequesting.id } });

//         console.log(`Calculando matches para usuario ${userRequesting.id} contra ${otherUsers.length} usuarios`);

//         // Obtener coincidencias usando IA
//         const matchesFromAI = await getSkillMatches(userRequesting, otherUsers);

//         console.log('Respuesta de IA:', matchesFromAI);

//         if (!Array.isArray(matchesFromAI)) {
//             console.error('La IA no devolvió un array válido');
//             return res.status(500).json({ error: 'La IA no devolvió una lista válida de coincidencias.' });
//         }

//         // Formatear las coincidencias para guardar en la base de datos
//         const formattedMatches = matchesFromAI.map(match => ({
//             matchedUserId: match.userId,
//             matchingSkills: match.matchingSkills
//         }));

//         console.log(`IA encontró ${formattedMatches.length} coincidencias`);

//         // Verificar si ya existe un registro de matches para este usuario
//         const existingMatch = await Match.findOne({ userId: userRequesting.id });

//         // Detectar cambios comparando con matches existentes
//         let hasChanged = true;

//         if (existingMatch) {
//             const currentMatches = JSON.stringify(
//                 existingMatch.matches.map(m => ({
//                     matchedUserId: m.matchedUserId.toString(),
//                     matchingSkills: m.matchingSkills
//                 }))
//             );

//             const newMatches = JSON.stringify(formattedMatches);
//             hasChanged = currentMatches !== newMatches;

//             console.log(`Matches ${hasChanged ? 'han cambiado' : 'no han cambiado'}`);
//         }

//         // Guardar solo si hay cambios
//         if (hasChanged) {
//             await Match.findOneAndUpdate(
//                 { userId: userRequesting.id },
//                 { matches: formattedMatches },
//                 { upsert: true, new: true }
//             );

//             console.log('Matches guardados en base de datos');
//         }

//         res.status(201).json({
//             hasChanged,
//             matchCount: formattedMatches.length,
//             message: hasChanged ? 'Matches actualizados' : 'Matches están actualizados'
//         });

//     } catch (error) {
//         console.error('Error calculating matches:', error);
//         res.status(500).json({ error: 'Failed to calculate matches.' });
//     }
// });


//Esta ruta es para calculo manual y asi comprobar si la AI esta respondiendo correctamente
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