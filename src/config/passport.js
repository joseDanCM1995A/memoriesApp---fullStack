const passport = require('passport'); // almacenar la sesión de un usuario
const localStrategy = require('passport-local').Strategy; // indicar que vamos a ocupar la autenticación con la info interna

// llamando al modelo
const User = require('../models/User');

passport.use(new localStrategy({
    usernameField: 'email' // indicando el campo por el cual va a ingresar
}, async(email, password, done) => { // campo, pass, callback
    const user = await User.findOne({ email: email }); // buscando al usuario por el email
    if (!user) { // si no se encuentra el user
        return done(null, false, { message: 'Usuario no encontrado' }); // callback  (error, si se encontró el usuario, mensaje) 
    } else {
        const match = await user.matchPassword(password); // comparando la contraseña
        if (match) { // si las passwords coinciden
            return done(null, user); // (no hay error, usuario)
        } else {
            return done(null, false, { message: 'Contraseña incorrecta' });
        }
    }
}));

passport.serializeUser((user, done) => { // almacenar en sesión al usuario
    done(null, user.id);
});

passport.deserializeUser((id, done) => { // desearizar al usuario
    User.findById(id, (err, user) => {
        done(err, user);
    });
});