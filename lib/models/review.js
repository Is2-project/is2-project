const mongoose = require('mongoose');
const Schema = mongoose.Schema;

// set up a mongoose model
module.exports = mongoose.model('Review', new Schema({ 
    book: String, //Schema.Types.ObjectId,
    user: Schema.Types.ObjectId,
    description: String,
    rating: Number
}));