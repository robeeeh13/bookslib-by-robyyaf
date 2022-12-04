const jwt = require('jsonwebtoken');
const User = require('../models/user');

// CREATING AN ADMIN MIDDLEWARE
const admin = async (req, res, next) => {
    try {
        const token = req.header('x-auth-token');
        if (!token) return res.status(401).json({msg: 'Akses ditolak, Anda tidak memiliki token autentikasi'});
        const verified = jwt.verify(token, "TOKEN_SECRET");
        if (!verified) return res.status(401).json({msg: 'Autorisasi ditolak, verifikasi token gagal'});
        const user = await User.findById(verified.id);
        if (user.type == 'user' || user.type == 'seller') {
            return res.status(401).json({msg: 'Anda bukan admin'});
        }
        req.user = verified.id;
        req.token = token;
        next();
    } catch (err) {
        res.status(500).json({error: err.message});
    }
};

module.exports = admin;