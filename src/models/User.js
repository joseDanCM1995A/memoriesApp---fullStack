const mongoose = require('mongoose');
const { Schema } = mongoose;
const bcrypt = require('bcryptjs');



const UserSchema = new Schema({
    name: {
        type: String,
        required: true
    },
    email: {
        type: String,
        required: true
    },
    password: {
        type: String,
        required: true
    },
    dateCreate: {
        type: Date,
        default: Date.now
    }
});

// Declarando métodos 
// procesar el encriptado del password
UserSchema.methods.encryptPassword = async(password) => {
    const salt = await bcrypt.genSalt(10); // obteniendo el hash
    const hash = bcrypt.hash(password, salt); // convirtiendo el pass en hash
    return hash; // retornando la contraseña encriptada
};

// Comparar el pass con pass que pasa el usuario con el pass del modelo
// se usa function de ES% para poder acceder a las propiedades del modelo
UserSchema.methods.matchPassword = async function(password) {
    return await bcrypt.compare(password, this.password);
};



module.exports = mongoose.model('User', UserSchema);