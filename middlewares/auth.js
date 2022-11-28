const jwt = require('jsonwebtoken');

const auth = async (req, res, next)=> {
    try {
        const token = req.header('x-auth-token');
        if (!token) return res.status(401).json({msg: 'Akses ditolak, Anda tidak memiliki token autentikasi'});
        const verified = jwt.verify(token, 'passwordKeyChangedLater');
        if (!verified) return res.status(401).json({msg: 'Autorisasi ditolak, verifikasi token gagal'});

        req.user = verified.id;
        req.token = token;
        next();
    } catch (err) {
        res.status(500).json({error: err.message});
    }
}

module.exports = auth;