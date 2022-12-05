const express = require('express');
const adminRouter = express.Router();
const admin = require('../middlewares/admin');
const Product = require('../models/product');

// ADD BOOK PRODUCT
adminRouter.post('/admin/add-product', admin, async(req, res) => {
    try {
        const {productName, authorName, publisher, yearPublished, description, price, quantity, genre, category, images} = req.body;
        let product = new Product({
            productName,
            authorName,
            publisher,
            yearPublished,
            description,
            price,
            quantity,
            genre,
            category,
            images, 
        });
        product = await product.save();
        res.json(product);
    } catch (e) {
        res.status(500).json({error: e.message});
    }
});

// GET ALL BOOKS PRODUCT
adminRouter.get('/admin/get-all-products', admin, async(req, res) => {
    try {
        const product = await Product.find({});
        res.json(product);
    } catch (e) {
        res.status(500).json({error: e.message});
    }
});

// DELETE BOOKS PRODUCT
adminRouter.post('/admin/delete-product', admin, async (req, res) => {
    try {
        const {id} = req.body;
        let product = await Product.findByIdAndDelete(id);
        // product = await product.save();
        res.json(product);
    } catch (e) {
        res.status(500).json({error: e.message});
    }
});

module.exports = adminRouter;