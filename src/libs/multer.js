const multer = require('multer');
const path = require('path');



const storage = multer.diskStorage({
    destination: 'src/public/img', // carpeta donde serán alojadas las imagenes en el server
    filename: (req, file, cb) => {
        cb(null, Date.now() + path.extname(file.originalname)); // null, generación de string tipo ID(como seran llamados lo archivos) +  extrayendo la extensión del archivo
    }
});

// exportando
module.exports = multer({ storage });