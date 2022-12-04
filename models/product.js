const mongoose = require('mongoose');

const productSchema = mongoose.Schema({ 
    productName: {
        required: true,
        type: String,
        trim: true,
    },
    authorName: {
        required: true,
        type: String,
        trim: true,
    },
    publisher: {
        required: true,
        type: String,
        trim: true,
    },
    yearPublished: {
        required: true,
        type: String,
        trim: true,
    },
    description: {
        required: true,
        type: String,
        trim: true,
    },
    price: { 
        required: true,
        type: Number,
    },
    quantity: {
        required: true,
        type: Number,
    },
    genre: {
        required: true,
        type: String,
    },
    category: {
        required: true,
        type: String,
    },
    images: [
        {
            required: true,
            type: String,
        },
    ],
    // RATTINGS
});

const Product = mongoose.model('Product', productSchema);
module.exports = Product;