const express = require('express');
const router = express.Router();
const jwt = require('jsonwebtoken');
const passport = require('passport');
const bcrypt = require('bcrypt');

const LocalStrategy = require('passport-local').Strategy;

const Users = require('../models/Users');

passport.use(new LocalStrategy(async (username, password, done) => {
    try {
        // Recherchez l'utilisateur dans la base de données
        const user = await Users.findOne({ email: username }); // Trouvez l'utilisateur par son nom d'utilisateur
        if (!user) {
            return done(null, false, { message: 'Incorrect email.' });
        }

        // Vérifiez le mot de passe
        const isMatch = await bcrypt.compare(password, user.motDePasse);
        if (!isMatch) {
            return done(null, false, { message: 'Incorrect password.' });
        }

        return done(null, user);
    } catch (err) {
        return done(err);
    }
}));

router
    .get('/', async (req, res) => {
        const users = await Users.find();
        res.json(users);
    })
    .get('/:id', async (req, res) => {
        const user = await Users.findById(req.params.id);
        res.json(user);
    })
    .post('/register', async (req, res) => {
        try {
            const { email, nom, age, motDePasse } = req.body;

            // Vérifiez si l'utilisateur existe déjà
            const existingUser = await Users.findOne({ login: email }); // Trouvez l'utilisateur par son nom d'utilisateur
            if (existingUser) {
                return res.status(400).json({ message: 'Email already exists.' });
            }

            // // Hachez le mot de passe
            const salt = await bcrypt.genSalt(10);
            const hashedPassword = await bcrypt.hash(motDePasse, salt);

            // // Créez un nouvel utilisateur
            const newUser = new Users({
                email: email,
                nom: nom,
                age: age,
                motDePasse: hashedPassword,
            });

            // // Sauvegardez l'utilisateur dans la base de données
            await newUser.save();

            res.status(201).json({ message: 'User registered successfully.' });
        } catch (err) {
            res.status(500).json({ message: 'Error registering user.', error: err });
        }
    })
    .post('/login', (req, res, next) => {
        passport.authenticate('local', { session: false }, (err, user, info) => {
            if (err || !user) {
                return res.status(400).json({
                    message: 'Something is not right',
                    user: user,
                });
            }

            req.login(user, { session: false }, (err) => {
                if (err) {
                    res.send(err);
                }

                const token = jwt.sign({ id: user.id }, 'your_jwt_secret', {
                    expiresIn: '1h',
                });

                res.status(201).json({ id: user.id });
            });
        })(req, res, next);
    })
    .patch('/addNotifs/:id', async (req, res) => {
        let body = {
            "$push": {
                "lieuxNotifications": [req.body]
            }
        }
        try {
            const updatedUser = await Users.findByIdAndUpdate(req.params.id, body, { new: true });
            res.json(updatedUser);
        } catch (err) {
            console.error("Error updating user:", err.message);
            res.status(500).json({ error: 'Something went wrong' });
        }
    })
    .patch('/:id', async (req, res) => {
        const updatedUser = await Users.findByIdAndUpdate(req.params.id, req.body, { new: true });
        res.json(req.body);
    })
    .delete('/:id', async (req, res) => {
        const deletedUser = await Users.findByIdAndDelete(req.params.id);
        res.json(deletedUser);
    })
    .delete('/deleteNotif/:id/:nom', async (req, res) => {
        console.log(req.params.id);
        console.log(req.params.nom);
        const deletedNotif = await Users.updateOne(
            { _id: req.params.id },
            { $pull: { lieuxNotifications: { nom: req.params.nom } } }
        )
        res.json(deletedNotif)
    })

module.exports = router;
