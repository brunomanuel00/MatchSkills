const matchRouter = require('express').Router();
const Match = require('../models/Match');
const User = require('../models/User');
const bcrypt = require('bcrypt');
const { userExtractor } = require('../utils/middleware');
const { getSkillMatches } = require('../service/geminiAI');

matchRouter.post('/calculate', userExtractor, async (req, res) => {
    const userRequesting = req.user;

    try {
        const lookingForString = JSON.stringify(userRequesting.lookingFor);
        const lookingForHash = await bcrypt.hash(lookingForString, 10);

        const existingMatch = await Match.findOne({ userId: userRequesting.id });

        if (existingMatch && existingMatch.lookingForHash === lookingForHash) {
            return res.status(200).json({ message: 'Matches are up to date.' });
        }

        const otherUsers = await User.find({ _id: { $ne: userRequesting.id } });

        const matchesFromAI = await getSkillMatches(userRequesting, otherUsers);
        console.log('IA Response:', matchesFromAI);

        if (!Array.isArray(matchesFromAI)) {
            return res.status(500).json({ error: 'La IA no devolvió una lista válida de coincidencias.' });
        }

        const formattedMatches = matchesFromAI.map(match => ({
            matchedUserId: match.userId,
            matchingSkills: Array.isArray(match.matchingSkills)
                ? match.matchingSkills.map(skill => {
                    // Si vienen como strings tipo JSON, los parseas
                    return typeof skill === 'string' ? JSON.parse(skill) : skill;
                })
                : []
        }));

        const matchDocument = await Match.findOneAndUpdate(
            { userId: userRequesting.id },
            { matches: formattedMatches },
            { upsert: true, new: true }
        );

        res.status(201).json(matchDocument);

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

        res.json(formattedMatches);

    } catch (error) {
        console.error('Error getting matches:', error);
        res.status(500).json({ error: 'Failed to get matches.' });
    }
});



module.exports = matchRouter;