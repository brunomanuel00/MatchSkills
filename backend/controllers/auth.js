const bcrypt = require('bcrypt')
const jwt = require('jsonwebtoken')
const User = require('../models/User')
const authRouter = require('express').Router()

authRouter.post('/register', async (request, response) => {
    const { name, email, password, skills, lookingFor, rol } = request.body;

    if (password.length < 8) {
        return response.status(400).json({ error: "The password is too short" });
    }

    if (!name || !email) {
        return response.status(400).json({ error: "Invalid fields" });
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
        process.env.SECRET
    )

    response.cookie('token', token, {

    })

    response.status(200).send({ token, email: user.email, name: user.name })
})

module.exports = authRouter;