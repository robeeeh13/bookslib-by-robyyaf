const express = require('express');
const userRouter = express.Router();
const auth = require('../middlewares/auth');
const Order = require('../models/order');
const { Product } = require('../models/product');
const User = require('../models/user');

// ADD TO CART
userRouter.post('/api/add-to-cart', auth, async(req, res) => {
    try {
        const { id } = req.body;
        const product = await Product.findById(id);
        let user = await User.findById(req.user);

        if(user.cart.length == 0) {
            user.cart.push({product, quantity: 1});
        } else {
            let isProductFound = false;
            for (let i=0; i<user.cart.length; i++) {
                if (user.cart[i].product._id.equals(product._id)) {
                    isProductFound = true;  
                } 
            }
            if (isProductFound) {
                let producttt = user.cart.find((productt) => productt.product._id.equals(product._id));
                producttt.quantity += 1;
            } else {
                user.cart.push({product, quantity: 1});
            }
        }
        user = await user.save();
        res.json(user);
    } catch (e) {
        res.status(500).json({error: e.message});
    }
});

// REMOVE FROM CART
userRouter.delete('/api/remove-from-cart/:id', auth, async(req, res) => {
    try {
        const { id } = req.params;
        const product = await Product.findById(id);
        let user = await User.findById(req.user);
        
        for (let i=0; i<user.cart.length; i++) {
            if (user.cart[i].product._id.equals(product._id)) {
                // JIKA QUANTITY 1 MAKA HAPUS
                if (user.cart[i].quantity == 1) {
                    user.cart.splice(i, 1);
                } else {
                    // JIKA QUANTITY > 1 MAKA KURANGI 1
                    user.cart[i].quantity -= 1;
                }
            } 
        }

        user = await user.save();
        res.json(user);
    } catch (e) {
        res.status(500).json({error: e.message});
    }
});

// SAVE USER ADDRESS
userRouter.post('/api/save-user-address', auth, async(req, res) => {
    try {
        const {address} = req.body;
        let user = await User.findById(req.user);
        // // TEST AJA NTI DI APUS 
        // user.name = 'nanda x roby';
        user.address = address;
        user = await user.save();
        res.json(user);
    } catch (e) {
        res.status(500).json({error: e.message});
    }
});

// ORDER BOOKS
userRouter.post('/api/order-books', auth, async(req, res) => {
    try {
        const { cart, totalPrice, address, receiver } = req.body;
        let products = [];
        
        for (let i = 0; i < cart.length; i++) {
            let product = await Product.findById(cart[i].product._id);
            if (product.quantity >= cart[i].quantity) {
                product.quantity -= cart[i].quantity;
                products.push({product, quantity: cart[i].quantity});
                await product.save();
            } else {
                return res.status(400).json({msg: `${product.productName} telah habis terjual`});
            }
        }
        
        let user = await User.findById(req.user);
        user.cart = [];
        user = await user.save();

        date = new Date();

        let order = new Order({
            products, receiver, totalPrice, address, userId: req.user, orderedAt: new Date().getTime(),
        });
        order = await order.save();

        res.json(order);
    } catch (e) {
        res.status(500).json({error: e.message});
    }
});

// USER ORDERS
userRouter.get('/api/orders/me', auth, async(req, res) => {
    try {
        const orders = await Order.find({userId: req.user});
        res.json(orders);
    } catch (e) {
        res.status(500).json({error: e.message});
    }
});

module.exports = userRouter;