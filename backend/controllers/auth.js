const bcrypt = require('bcrypt')
const jwt = require('jsonwebtoken')
const User = require('../models/User')
const express = require('express')
const authRouter = express.Router()
const middleware = require('../utils/middleware')

authRouter.post('/register', async (request, response) => {
    const { name, email, password, skills, lookingFor, rol, avatar } = request.body;

    if (password.length < 8) {
        return response.status(400).json({ error: "password" });
    }

    if (!name || !email) {
        return response.status(400).json({ error: "fields" });
    }

    const existEmail = await User.findOne({ email })

    if (existEmail) {
        return response.status(400).json({ error: "invalidEmail" });
    }

    if (rol === 'admin') {
        return response.status(400).json({ error: "JSON modificate manually" });
    }

    const saltRounds = 10;
    const passwordHash = await bcrypt.hash(password, saltRounds);

    const user = new User({
        name,
        email,
        passwordHash,
        skills,
        lookingFor,
        rol,
        avatar
    });

    const userSaved = await user.save();
    response.status(201).json(userSaved);
});

authRouter.post('/login', async (request, response) => {

    const { email, password } = request.body

    const user = await User.findOne({ email })
    if (!user) {
        return response.status(404).json({ error: "invalid email" })
    }
    const passwordCorrect = user === null
        ? false
        : await bcrypt.compare(password, user.passwordHash)

    if (!(user && passwordCorrect)) {
        return response.status(400).json({
            error: 'invalid password'
        })
    }
    const userForToken = {
        email: email,
        id: user._id,
        rol: user.rol
    }
    const token = jwt.sign(
        userForToken,
        process.env.SECRET,
        { expiresIn: '24h' }
    )

    response.cookie('token', token, {
        httpOnly: true,
        secure: true,
        sameSite: 'strict',
        maxAge: 1000 * 60 * 60 * 24,
    })

    response.status(200).json({ message: 'login success', user });
})

authRouter.post('/logout', (_req, res) => {
    res.clearCookie('token', {
        httpOnly: true,
        secure: true,
        sameSite: 'strict',
        domain: process.env.COOKIE_DOMAIN || 'localhost'
    });

    res.status(200).json({ message: 'session closed' });
});

authRouter.get('/verify-auth', middleware.userExtractor, async (req, res) => {
    const token = req.cookies.token;

    if (!token) {
        return res.status(204).json({ error: 'No vacio' });
    }
    const decoded = jwt.verify(token, process.env.SECRET);
    const user = await User.findById(decoded.id);

    if (!user) {
        return res.status(401).json({ error: 'Usuario no encontrado' });
    }
    res.status(200).json(user);

});

module.exports = authRouter;