const mongoose = require('mongoose');

const LieuNotificationSchema = mongoose.Schema({
    nom: { type: String, required: true },
    latitude: { type: Number, required: true },
    longitude: { type: Number, required: true },
    rayon: { type: Number, required: true },
    message: { type: String, required: true }
});

const UserSchema = mongoose.Schema({
    prenom: { type: String, required: false },
    nom: { type: String, required: true },
    age: { type: Number, required: true },
    dateNaissance: { type: Date, required: false },
    email: { type: String, required: true },
    motDePasse: { type: String, required: true },
    bio: { type: String, required: false },
    lieuxNotifications: { type: [LieuNotificationSchema], required: false },
});

module.exports = mongoose.model('Users', UserSchema);