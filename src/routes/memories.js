const express = require('express'); // importando express
const router = express.Router(); // llamando el modulo router para el manejo de rutas
const Memorie = require('../models/Memorie');
const { unlink } = require('fs-extra'); //  carga de imagen en el servidor
const path = require('path');
const { isAuthenticated } = require('../helpers/auth');
// routing
// ruta para mostrar todas los memories
router.get('/remembers', isAuthenticated, async(req, res) => {
    // en la consulta de la bd solo va a traer las que coincidad con el usuario que las hizo
    const memories = await Memorie.find({ user: req.user.id }).sort({ DateCreate: 'desc' }); // ordenar por la fecha de creación, FIFO
    //console.log(memories);
    //console.log('////////////////////////////');
    res.render('remembers/memories', { memories }); //sándole la data a la vista memories
});

//ruta para agregar una memorie
router.get('/remembers/add', isAuthenticated, (req, res) => {
    res.render('remembers/memorieCardForm'); // mostrando la vista del formulario
});

// ruta para accciones en el recuerdo
router.get('/remembers/actions/:id', isAuthenticated, async(req, res) => {
    const memorie = await Memorie.findById(req.params.id); //cachando el id del url
    //console.log('////////////////////////////////');
    //console.log(memorie);
    res.render('remembers/memorie', { memorie });
});

//ruta para editar el recuerdo
router.get('/remembers/actions/edit/:id', isAuthenticated, async(req, res) => {
    const memorie = await Memorie.findById(req.params.id);
    res.render('remembers/memorieEdit', { memorie });
});



//recibiendo la data de los formularios
// recibiendo data de agregar nuevo recuerdo
router.post('/remembers/new-memorie', isAuthenticated, async(req, res) => { // a donde el formulario envía los datos
    //  console.log(req.body); // mostrando los datos recibidos del formulario
    // console.log(req.file);
    // recibiendo los datos y almacenandolos
    const { title, description, date, place } = req.body; // almacenando datos
    let des = description; // para que pueda manipular los valores en el formulario, traer la info cuando se recargue
    const errors = []; // para qlmacenar los errores en las validaciones

    // validando las entradas y mostrando msjs si hay un error en la validación
    if (!title) {
        errors.push({ text: 'Por favor ingresa un titulo valida' });
    }
    if (!description) {
        errors.push({ text: 'Por favor ingresa una descripción valida' });
    }
    if (!place) {
        errors.push({ text: 'Por favor ingresa una descripción valida' });
    }
    if (!date) {
        errors.push({ text: 'Por favor ingresa un fecha valida' });
    }
    // checando si hay errores 
    if (errors.length > 0) {
        res.render('remembers/memorieCardForm', { // renderizamos de nuevo la vista del formulario, pero con los errores
            errors,
            title,
            des,
            place,
            date,
        });
    } else {
        //instanciando el modelo
        // console.log(req.body);
        // console.log(req.file)
        const newMemorie = new Memorie();
        newMemorie.title = req.body.title;
        newMemorie.description = req.body.description;
        newMemorie.place = req.body.place;
        newMemorie.date = req.body.date;
        newMemorie.photo = req.file.filename;
        newMemorie.pathPhoto = '/img/' + req.file.filename;
        newMemorie.originalNamePhoto = req.file.originalname;
        newMemorie.mimeType = req.file.mimetype;
        newMemorie.size = req.file.size;
        // mostrando lo que tare el objeto
        // console.log(newMemorie);
        // asifnando a user el id del usurio que está en esa sesión (la info del usuario en sesión está en req.user)
        newMemorie.user = req.user.id;
        // guardando la data en la BD
        await newMemorie.save();
        req.flash('success_msg', 'Recuerdo almacenado correctamente');
        res.redirect('/remembers');
    }
});

// procesando los datos para actualizar
router.put('/remembers/memorieEdit/edit/:id', isAuthenticated, async(req, res) => {
    const { title, description, place, date } = req.body; // indicando los cambos que serán utilizados y actualizados
    await Memorie.findByIdAndUpdate(req.params.id, { title, description, place, date }); // cachando el id de la url
    req.flash('success_msg', 'Recuerdo actualizado correctamente');
    res.redirect('/remembers');
});

// ruta para eliminar el receurdo
router.delete('/remembers/memorieEdit/delete/:id', isAuthenticated, async(req, res) => {
    const memorie = await Memorie.findByIdAndDelete(req.params.id); // cachando el id del url
    await unlink(path.resolve('./src/public' + memorie.pathPhoto)); // borrando la foto del servidor (de la carpeta)
    req.flash('success_msg', 'Recuerdo eliminado correctamente');
    res.redirect('/remembers');
});

module.exports = router;