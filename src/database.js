// importando mongoose
const mongoose = require('mongoose');


// conexión a la bd, mediante una promesa
mongoose.connect("mongodb://localhost/moviesNote", {
        // parametros para evitar warnings en la bd
        useCreateIndex: true,
        useNewUrlParser: true,
        useUnifiedTopology: true,
        useFindAndModify: false
    }).then(() => console.log('Connected BD successfull')) // si se conecta muestra el msj
    .catch(err => {
        console.log(err) // si no muestra el error
    });