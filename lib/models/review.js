const mongoose = require('mongoose');
const Schema = mongoose.Schema;

// set up a mongoose model
module.exports = mongoose.model('Review', new Schema({ 
    book: { type: String, required: true }, //Schema.Types.ObjectId,
    user: { type: Schema.Types.ObjectId, required: true },
    description: { type: String, required: true },
    rating: { type: Number, required: true }
}));