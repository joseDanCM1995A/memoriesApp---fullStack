const express = require('express');
const path = require('path');
const Handlebars = require('handlebars');
const exphbs = require('express-handlebars');
const methodOverride = require('method-override');
const { allowInsecurePrototypeAccess } = require('@handlebars/allow-prototype-access');
const session = require('express-session');
const multer = require('multer');
const uuid = require('uuid');
const flash = require('connect-flash');
const passport = require('passport');
const { initialize } = require('passport');
// initializations
const app = express(); // inicializando express
require('./database'); // importando la configuración de la BD
require('./config/passport'); // importando la confiiguración de passport

// settings
// preparación de views
app.set('port', process.env.PORT || 3000); // si hay un puerto en el computador que lo tome o si no que tome el 3000
app.set('views', path.join(__dirname, 'views')); //indicando donde se encuentran las vistas
// configurando el handlerbar (plantilla)
app.engine('.hbs', exphbs({
    handlebars: allowInsecurePrototypeAccess(Handlebars),
    defaultLayout: 'main', // plantilla principal de la aplicación
    layoutsDir: path.join(app.get('views'), 'layouts'), // obteniedo e indicando donde está layouts
    partialsDir: path.join(app.get('views'), 'partials'), // pedazos de html que van a reutilizarse
    extname: '.hbs' // indicando el tipo de extensión de las plantillas
}));

app.set('view engine', '.hbs'); // configurando el motor de plantillas


// middlewares
app.use(express.urlencoded({ extended: false })); // para que la info de los formulación se entiendan con otros serviicios
app.use(methodOverride('_method')); // para tener put y delete en los formularios}
app.use(session({ // conf para la sesion
    secret: 'mysecretapp',
    resave: true,
    saveUninitialized: true
}));
app.use(passport.initialize()); // inicializar
app.use(passport.session()); // para que inicie la sesión hecha por express

const storage = multer.diskStorage({
    destination: path.join(__dirname, 'public/img'),
    fileFilter(req, file, cb) {
        if (file.mimetype == "image/png" || file.mimetype == "image/jpg" || file.mimetype == "image/jpeg") {
            cb(null, true);
        } else {
            cb(null, false);
            return cb(new Error('Only .png, .jpg and .jpeg format allowed!'));
        }
    },
    filename: (req, file, cb, filename) => {
        cb(null, uuid.v4() + path.extname(file.originalname));
    }

});

// multer conf
app.use(multer({ storage: storage }).single('photo'));

app.use(express.urlencoded({ extended: false }));

//flash
app.use(flash());

// global variables
app.use((req, res, next) => {
    res.locals.success_msg = req.flash('success_msg');
    res.locals.error_msg = req.flash('error_msg');
    res.locals.error = req.flash('error'); // los msjs de error de flash se llaman error
    res.locals.user = req.user || null; // cuando passport autentica a un usuario, la data de ese user esta almacenada en request
    next();
});

// routes
//indicando donde están los archivos de nuestras rutas
app.use(require('./routes/index'));
app.use(require('./routes/memories'));
app.use(require('./routes/users'));

// static files
//indicando donde están los archivos estátiticos 
app.use(express.static(path.join(__dirname, 'public'))); // __dirname da la url del proyecto

// server
app.listen(app.get('port'), () => {
    console.log('Server ok');
});