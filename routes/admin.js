const express = require('express');
const adminRouter = express.Router();
const admin = require('../middlewares/admin');
const { Product } = require('../models/product');
const Order = require('../models/order');

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

// GET ALL ORDERS
adminRouter.get('/admin/get-all-orders', admin, async (req, res) => {
    try {
        const orders = await Order.find({});
        res.json(orders);
    } catch (e) {
        res.status(500).json({error: e.message});
    }
});

// CHANGE ORDER STATUS
adminRouter.post('/admin/change-order-status', admin, async (req, res) => {
    try {
        const {id, status} = req.body;
        let order = await Order.findById(id);
        order.status = status;
        order = await order.save();
        res.json(order);
    } catch (e) {
        res.status(500).json({error: e.message});
    }
});

// ANALYTIC PAGE
adminRouter.get('/admin/analytics', admin, async (req, res) => {
    try {
        const orders = await Order.find({});
        let totalEarnings = 0;

        for (let i=0; i<orders.length; i++) {
           for (let j=0; j<orders[i].products.length; j++) {
            totalEarnings += orders[i].products[j].product.price * orders[i].products[j].quantity;
           }
        }

        // FETCH ORDER(BOOK) BY CATEGORY
        let novelEarnings = await fetchCategoryWiseProduct('Novel');
        let majalahEarnings = await fetchCategoryWiseProduct('Majalah');
        let kamusEarnings = await fetchCategoryWiseProduct('Kamus');
        let komikEarnings = await fetchCategoryWiseProduct('Komik');
        let mangaEarnings = await fetchCategoryWiseProduct('Manga');
        let ensiklopediaEarnings = await fetchCategoryWiseProduct('Ensiklopedia');
        let biografiEarnings = await fetchCategoryWiseProduct('Biografi');

        let earnings = {
            totalEarnings,
            novelEarnings,
            majalahEarnings,
            kamusEarnings,
            komikEarnings,
            mangaEarnings,
            ensiklopediaEarnings,
            biografiEarnings,
        };

        res.json(earnings);
    } catch (e) {
        res.status(500).json({error: e.message});
    }
});

// GET BOOKS BY CATEGORY
async function fetchCategoryWiseProduct(category) {
    let earnings = 0;

    let categoryOrders = await Order.find({
        'products.product.category': category,
    });

    for (let i=0; i<categoryOrders.length; i++) {
        for (let j=0; j<categoryOrders[i].products.length; j++) {
            earnings += categoryOrders[i].products[j].product.price * categoryOrders[i].products[j].quantity;
        }
    }
    return earnings;
}


module.exports = adminRouter;