const mongoose = require('mongoose');
const ratingSchema = require('./rating');

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
        validate: {
            validator: (value) => {
                const re = /^[A-Za-z\s]*$/;
                return value.match(re);
            },
            message: 'Nama penulis harus huruf alphabet'
        }
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
        validate: {
            validator: (value) => {
                const re = /^[0-9]*$/;
                return value.match(re);
            },
            message: 'Tahun terbit harus angka'
        }
    },
    description: {
        required: true,
        type: String,
        trim: true,
    },
    price: { 
        required: true,
        type: Number,
        validate: {
            validator: (value) => {
                return value > 0;
            },
            message: 'Harga harus lebih dari 0'
        }
    },
    quantity: {
        required: true,
        type: Number,
        validate: {
            validator: (value) => {
                return value > 0;
            },
            message: 'Jumlah buku harus lebih dari 0'
        }
    },
    genre: {
        required: true,
        type: String,
        trim: true,
        validate: {
            validator: (value) => {
                const re =/\s+|,\s+g/;
                return value.match(re);
            },
            message: 'Masukkan genre yang sesuai'
        }
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
    ratings: [
        ratingSchema
    ],
});

const Product = mongoose.model('Product', productSchema);
module.exports = Product;