const express = require('express'); // importando express

const router = express.Router(); // llamando el modulo router para el manejo de rutas
// llamando al modelo
const User = require('../models/User');

const passport = require('passport');



// routing
// ruta princial
router.get('/users/signin', (req, res) => {
    res.render('users/signin');
});

router.post('/users/signin', passport.authenticate('local', {
    successRedirect: '/remembers', // si todo salió bien
    failureRedirect: '/users/signin', // si algo salió mal
    failureFlash: true // indicar que se permiten msjs flash
}));

// ruta para formulario
router.get('/users/signup', (req, res) => {
    res.render('users/signup');
});

// datos del formulario signup --Tener rutas iguales no afecta siempre y cuando sean de diferentes peticiones http --
router.post('/users/signup', async(req, res) => {
    const { name, email, password, cpassword } = req.body; // almacenado los valores del formulario
    const errors = [];
    if (name.length <= 0) {
        errors.push({ text: 'Por favor ingresa el nombre' });
    }
    if (email.length <= 0) {
        errors.push({ text: 'Por favor ingresa el email' });
    }
    if (password.length <= 0) {
        errors.push({ text: 'POr favor ingresa la contraseña' });
    }
    if (cpassword.length <= 0) {
        errors.push({ text: 'Por favor repita la contraseña' });
    }

    if (password != cpassword) {
        errors.push({ text: 'Las contraseña no coincide' });
    }
    if (password.length < 8) {
        errors.push({ text: 'La contraseña debe contener al menos 8 carácteres' });
    }
    if (errors.length > 0) {
        res.render('users/signup', { errors, name, email, password, cpassword });
    } else {
        const emailUser = await User.findOne({ email: email });
        if (emailUser) { // verificando si ya existe el email
            req.flash('error_msg', 'El email ya está registrado. Intenta con uno diferente'); // mandando el msj y redireccionando
            res.redirect('/users/signup');
        }
        const NewUser = new User({ name, email, password }); // trayendo los datos que vamos a requerir
        NewUser.password = await NewUser.encryptPassword(password); // encryptando el pass con el metodo que definimos en el schema
        await NewUser.save(); // almacenando en la bd
        req.flash('success_msg', 'Te has registrado correctamente');
        res.redirect('/users/signin'); // mandando a que ingresen
    }
});

// ruta para logout
router.get('/users/logout', (req, res) => {
    req.logout(); // método para salir
    res.redirect('/'); // redireccionando a home
});



module.exports = router;