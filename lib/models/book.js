const mongoose = require('mongoose');
const Schema = mongoose.Schema;

// set up a mongoose model
module.exports = mongoose.model('Book', new Schema({ 
    isbn: String,
    user: Schema.Types.ObjectId,
    title: String,
    author: String,
    genre: String,
    year: Number
}));