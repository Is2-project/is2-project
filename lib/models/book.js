const mongoose = require('mongoose');
const Review = require('./review');
const Schema = mongoose.Schema;

// set up a mongoose model

const schema = new Schema({ 
    isbn: { type: String, required: true, unique: true},
    user: { type: Schema.Types.ObjectId, required: true },
    title: { type: String, required: true },
    author: { type: String, required: true },
    genre: { type: String, required: true },
    year: { type: Number, required: true }
});

schema.methods.rating = async function () {
    const reviews = await Review.find({ book: this.isbn }).exec();
    if(reviews.length > 0) {
        return reviews.map(r => r.rating).reduce((a, b) => a+b) / reviews.length;
    } else {
        return undefined;
    }
};

module.exports = mongoose.model('Book', schema);

