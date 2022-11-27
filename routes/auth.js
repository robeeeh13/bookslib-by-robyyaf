const express = require('express');
const User = require('../models/user');
const bcryptjs = require('bcryptjs');
const authRouter = express.Router();

// SIGN UP
authRouter.post('/api/signup', async (req, res) => {
    try {
      const { name, email, username, password } = req.body;
  
      const existingUser = await User.findOne({ email });
      if (existingUser) {
        return res
          .status(400)
          .json({ msg: 'Email telah terdaftar' });
      }

      const hashedPassword = await bcryptjs.hash(password, 8);
  
      let user = new User({
        name,
        email,
        username,
        password: hashedPassword,
      });
      user = await user.save();
      res.json(user);
    } catch (e) {
      res.status(500).json({ error: e.message });
    }
  });

module.exports = authRouter;