const matchRouter = require('express').Router();
const Match = require('../models/Match');
const User = require('../models/User');
const { userExtractor } = require('../utils/middleware');
const Notification = require('../models/Notification');

// GET matches
matchRouter.get('/', userExtractor, async (request, response) => {
    const userRequesting = request.user;

    try {
        const matchData = await Match.findOne({ userId: userRequesting.id })
            .populate('matches.matchedUserId', 'name email avatar')
            .select('matches');

        if (!matchData) {
            return response.status(404).json({ message: 'No matches found for this user.' });
        }

        const formattedMatches = matchData.matches.map(match => ({
            id: match.matchedUserId._id.toString(),
            name: match.matchedUserId.name,
            email: match.matchedUserId.email,
            avatar: match.matchedUserId.avatar,
            matchingSkills: match.matchingSkills
        }));

        const sortedMatches = formattedMatches.sort((a, b) => b.matchingSkills.length - a.matchingSkills.length);

        response.json(sortedMatches);

    } catch (error) {
        console.error('Error getting matches:', error);
        response.status(500).json({ error: 'Failed to get matches.' });
    }
});

// GET last update info
matchRouter.get('/last-update', userExtractor, async (request, response) => {
    try {
        const matchData = await Match.findOne({ userId: request.user.id }).select('lastUpdated matches');

        response.json({
            lastUpdated: matchData?.lastUpdated || null,
            hasMatches: !!matchData,
            matchCount: matchData?.matches?.length || 0
        });

    } catch (error) {
        response.status(500).json({ error: 'Failed to check last update' });
    }
});

// POST calculate matches
matchRouter.post('/calculate', userExtractor, async (req, res) => {
    const userRequesting = req.user;

    try {
        // 1. Obtener matches existentes ANTES de calcular
        const existingMatch = await Match.findOne({ userId: userRequesting.id });
        const existingMatchIds = existingMatch?.matches?.map(match =>
            match.matchedUserId.toString()
        ) || [];

        // Determinar si es la primera vez que calcula matches
        const isFirstTimeCalculating = !existingMatch;

        console.log(`👤 Usuario ${userRequesting.id} - Matches existentes: ${existingMatchIds.length}, Primera vez: ${isFirstTimeCalculating}`);

        // 2. Calcular nuevos matches
        const otherUsers = await User.find({ _id: { $ne: userRequesting.id } });

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
        }).filter(Boolean);

        console.log(`🔍 Matches calculados: ${formattedMatches.length}`);

        // 3. Identificar SOLO los matches realmente nuevos (no en primera ejecución)
        const newMatchIds = formattedMatches
            .map(match => match.matchedUserId.toString())
            .filter(id => !existingMatchIds.includes(id));

        const newMatches = formattedMatches.filter(match =>
            newMatchIds.includes(match.matchedUserId.toString())
        );

        console.log(`🆕 Matches completamente nuevos: ${newMatches.length}`);

        // 4. Crear notificación SOLO si:
        // - NO es la primera vez calculando matches
        // - HAY matches realmente nuevos
        // - El usuario tiene lookingFor configurado
        let hasNewNotifications = false;

        const shouldCreateNotification = !isFirstTimeCalculating &&
            newMatches.length > 0 &&
            userRequesting.lookingFor &&
            userRequesting.lookingFor.length > 0;

        if (shouldCreateNotification) {
            console.log(`🎯 Creando notificación: nuevos matches detectados después de la primera vez`);

            // Verificar que no existe una notificación reciente similar
            const recentNotification = await Notification.findOne({
                user: userRequesting.id,
                type: 'new_match',
                createdAt: { $gte: new Date(Date.now() - 60000) } // Últimos 60 segundos
            });

            if (!recentNotification) {
                const notification = {
                    user: userRequesting.id,
                    type: 'new_match',
                    data: {
                        newMatchesCount: newMatches.length,
                        message: newMatches.length === 1
                            ? '¡Tienes 1 nuevo match!'
                            : `¡Tienes ${newMatches.length} nuevos matches!`,
                        timestamp: new Date().toISOString()
                    },
                    read: false
                };

                await Notification.create(notification);
                hasNewNotifications = true;

                console.log(`🔔 Notificación creada para ${newMatches.length} nuevos matches`);
            } else {
                console.log(`⏰ Notificación reciente encontrada, no se crea duplicada`);
            }
        } else {
            if (isFirstTimeCalculating) {
                console.log(`🚀 Primera vez calculando matches - no se crea notificación`);
            } else if (newMatches.length === 0) {
                console.log(`😴 No hay matches nuevos - no se crea notificación`);
            } else if (!userRequesting.lookingFor || userRequesting.lookingFor.length === 0) {
                console.log(`🤷 Usuario sin lookingFor configurado - no se crea notificación`);
            }
        }

        // 5. Actualizar matches en base de datos SIEMPRE
        const updatedMatch = await Match.findOneAndUpdate(
            { userId: userRequesting.id },
            {
                matches: formattedMatches,
                lastUpdated: new Date()
            },
            { upsert: true, new: true }
        );

        console.log(`✅ Matches actualizados - Total: ${formattedMatches.length}, Nuevos: ${newMatches.length}`);

        res.status(200).json({
            success: true,
            hasChanged: newMatches.length > 0,
            newMatchesCount: newMatches.length,
            totalMatches: formattedMatches.length,
            hasNewNotifications,
            lastUpdated: updatedMatch.lastUpdated,
            isFirstTime: isFirstTimeCalculating
        });

    } catch (error) {
        console.error('Error calculating matches:', error);
        res.status(500).json({ error: 'Failed to calculate matches.' });
    }
});

module.exports = matchRouter;

















// const { getSkillMatches } = require('../service/aiMatchtes');
//this is for the ai use but i don't have access
// matchRouter.post('/calculate', userExtractor, async (request, response) => {
//     const userRequesting = request.user;

//     try {
//         // Obtener todos los usuarios excepto el solicitante
//         const otherUsers = await User.find({ _id: { $ne: userRequesting.id } });

//         console.log(`Calculando matches para usuario ${userRequesting.id} contra ${otherUsers.length} usuarios`);

//         // Obtener coincidencias usando IA
//         const matchesFromAI = await getSkillMatches(userRequesting, otherUsers);

//         console.log('Respuesta de IA:', matchesFromAI);

//         if (!Array.isArray(matchesFromAI)) {
//             console.error('La IA no devolvió un array válido');
//             return response.status(500).json({ error: 'La IA no devolvió una lista válida de coincidencias.' });
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

//         response.status(201).json({
//             hasChanged,
//             matchCount: formattedMatches.length,
//             message: hasChanged ? 'Matches actualizados' : 'Matches están actualizados'
//         });

//     } catch (error) {
//         console.error('Error calculating matches:', error);
//         response.status(500).json({ error: 'Failed to calculate matches.' });
//     }
// });


//Esta ruta es para calculo manual y asi comprobar si la AI esta respondiendo correctamente
// matchRouter.post('/calculate', userExtractor, async (request, response) => {
//     const userRequesting = request.user;

//     try {
//         const otherUsers = await User.find({ _id: { $ne: userRequesting.id } });

//         // Calcular coincidencias sin IA
//         const formattedMatches = otherUsers.map(other => {
//             const matchingSkills = userRequesting.lookingFor.filter(skill =>
//                 other.skills.some(s =>
//                     s.id === skill.id && s.category === skill.category
//                 )
//             );

//             if (matchingSkills.length > 0) {
//                 return {
//                     matchedUserId: other._id,
//                     matchingSkills
//                 };
//             }

//             return null;
//         }).filter(Boolean); // Delete nulls

//         const existingMatch = await Match.findOne({ userId: userRequesting.id });

//         // Detectar cambios en coincidencias
//         const hasChanged =
//             !existingMatch ||
//             JSON.stringify(existingMatch.matches) !== JSON.stringify(formattedMatches);


//         if (hasChanged) {
//             const existingMatchIds = existingMatch.matches.map(match =>
//                 match.matchedUserId.toString()
//             );

//             const newMatches = formattedMatches.filter(newMatch =>
//                 !existingMatchIds.includes(newMatch.matchedUserId.toString())
//             )
//             console.log("Estas son las matches: ", newMatches);

//             console.log(`👥 Matches existentes: ${existingMatchIds.length}`);
//             console.log(`🆕 Nuevos matches encontrados: ${newMatches.length}`);

//             if (newMatches.length > 0) {
//                 const notifications = newMatches.map(match => ({
//                     user: userRequesting.id,
//                     type: 'new_match',
//                     data: {
//                         matchedUserId: match.matchedUserId,
//                         matchingSkills: match.matchingSkills,
//                         message: `¡Tienes un nuevo match con ${match.matchingSkills.length} habilidades en común!`
//                     },
//                     read: false
//                 }));


//                 // Guardar todas las notificaciones
//                 await Notification.insertMany(notifications);

//                 console.log(`🔔 Se crearon ${notifications.length} notificaciones`);
//             }
//         }

//         // Guardar solo si hay cambios
//         await Match.findOneAndUpdate(
//             { userId: userRequesting.id },
//             { matches: formattedMatches },
//             { upsert: true, new: true }
//         );

//         response.status(201).json({ hasChanged });

//     } catch (error) {
//         console.error('Error calculating matches:', error);
//         response.status(500).json({ error: 'Failed to calculate matches.' });
//     }
// });

