const mongoose = require("mongoose");
const { Schema } = mongoose;


// defniendo el esquema para la bd
const MemorieSchema = new Schema({
    title: { type: String, required: true },
    description: { type: String, required: true },
    place: { type: String },
    date: { type: String },
    photo: { type: String },
    pathPhoto: { type: String },
    originalNamePhoto: { type: String },
    mimeType: { type: String },
    size: { type: Number },
    DateCreate: { type: Date, default: Date.now },
    user: { type: String } // para saber a que usuario le pertenece la nota
});


//exportando el modelo
module.exports = mongoose.model('Memorie', MemorieSchema);