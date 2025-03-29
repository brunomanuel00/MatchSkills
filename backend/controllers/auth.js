const bcrypt = require('bcrypt')
const jwt = require('jsonwebtoken')
const User = require('../models/User')
const express = require('express')
const authRouter = express.Router()




authRouter.post('/register', async (request, response) => {
    const { name, email, password, skills, lookingFor, rol } = request.body;

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

    let userRol = rol || "user";

    const saltRounds = 10;
    const passwordHash = await bcrypt.hash(password, saltRounds);

    const user = new User({
        name,
        email,
        passwordHash,
        skills,
        lookingFor,
        rol: userRol,
    });

    const userSaved = await user.save();
    response.status(201).json(userSaved);
});

authRouter.post('/login', async (request, response) => {

    const { email, password } = request.body

    const user = await User.findOne({ email })
    const passwordCorrect = user === null
        ? false
        : await bcrypt.compare(password, user.passwordHash)

    if (!(user && passwordCorrect)) {
        return response.status(401).json({
            error: 'invalid email or password'
        })
    }
    const userForToken = {
        email: email,
        id: user._id
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

authRouter.get('/verify-auth', async (req, res) => {
    const token = req.cookies.token;

    if (!token) {
        return res.status(204).json({ error: 'No vacio' });
    }
    const decoded = jwt.verify(token, process.env.SECRET);
    const user = await User.findById(decoded.id); // Obtén los datos del usuario

    if (!user) {
        return res.status(401).json({ error: 'Usuario no encontrado' });
    }
    res.status(200).json(user);

});

module.exports = authRouter;