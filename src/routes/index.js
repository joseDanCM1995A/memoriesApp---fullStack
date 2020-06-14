const express = require('express'); // importando express

const router = express.Router(); // llamando el modulo router para el manejo de rutas

// routing
// ruta princial
router.get('/', (req, res) => {
    res.render('index'); // llamando a la vista index.hbs
    // ya no se pone la extensión porque ya está configurado en el server
});

// ruta para about
router.get('/about', (req, res) => {
    res.render('about'); // llamando a la vista about.hbs
});

//exportando paa que pueda ser accedido por otros
module.exports = router;